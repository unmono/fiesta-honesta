import { EventEmitter } from "node:events";

import { fastifyPlugin } from "fastify-plugin";

const gameReadyEmitter = new EventEmitter();

async function newPlayer(options, client, reply) {
  console.log(options.values);
  const newPlayer = await client.query(
    'INSERT INTO player(name, characteristics, abilities, game) VALUES($1, $2, $3, $4) RETURNING "id";',
    Object.values(options)
  )

  reply.setCookie('player', newPlayer.rows[0].id.toString(), {
    httpOnly: true,
    signed: true,
  });
}

async function handlers (fastify, options) {
  fastify.decorate('gameModes', async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query(
        'SELECT id, title, text FROM "mode";'
      );
      return reply.send(rows);
    } finally {
      client.release();
    }
  });

  fastify.decorate('newGame', async (request, reply) => {
    const mode = parseInt(request.params.mode);
    if (!mode) {
      // TODO: error
    }
    const { name, characteristics, abilities } = request.body;
    // TODO: Validation

    const client = await fastify.pg.connect();
    try {
      const newGame = await client.query(
        'INSERT INTO game("mode") VALUES($1) RETURNING id;',
        [ mode ],
      );
      await newPlayer({ name, characteristics, abilities, game: newGame.rows[0].id }, client, reply);
      reply.send('created');
    } finally {
      client.release();
    }
  });

  fastify.decorate('participate', async (request, reply) => {
    const gameId = request.params.gameId;
    // TODO: check
    const { name, characteristics, abilities } = request.body;
    // TODO: Validation
    const client = await fastify.pg.connect();
    try {
      const game = await client.query(
        'SELECT id FROM game WHERE id = $1 LIMIT 1;',
        [ gameId ]
      );
      await newPlayer({ name, characteristics, abilities, game: game.rows[0].id }, client, reply);
    } finally {
      client.release();
    }
  });

  fastify.decorate('gameInfo', async (request, reply) => {
    const client = await fastify.pg.connect();
    const playerId = reply.unsignCookie(request.cookies.player).value;
    try {
      const players = await client.query(
        'SELECT po.* FROM player po ' +
        'JOIN player pi ON pi.game = po.game ' +
        'WHERE pi.id = $1;',
        [ playerId ]
      );
      reply.send(players.rows);
    } finally {
      client.release();
    }
  });

  fastify.decorate('playerReady', async (request, reply) => {
    const client = await fastify.pg.connect();
    const playerId = request.body.playerId;
    try {
      const { rowCount, rows } = await client.query(
        'UPDATE player SET ready = true WHERE id = $1 AND ready = false RETURNING game;',
        [ playerId ]
      );
      if (rowCount != 0) {
        // emit another player ready
        // catch event in gameInfo
      }
    } finally {
      client.release();
    }
  });
}

export const apiHandlers = fastifyPlugin(handlers);