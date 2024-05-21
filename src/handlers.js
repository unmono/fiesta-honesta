import { fastifyPlugin } from "fastify-plugin";

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
      // error
    }
    const { name, characteristics, abilities } = request.body;
    // Validation

    const client = await fastify.pg.connect();
    try {
      const newGame = await client.query(
        'INSERT INTO game("mode") VALUES($1) RETURNING id;',
        [ mode ],
      );
      const newPlayer = await client.query(
        'INSERT INTO player(name, characteristics, abilities, game)' +
        'VALUES($1, $2, $3, $4);',
        [ name, characteristics, abilities, newGame.rows[0].id ],
      );

      return reply.send('created');
    } finally {
      client.release();
    }
  });

  fastify.decorate('participate', async (request, reply) => {
    const gameUUID = request.params.gameUUID;
    // check
    const { name, characteristics, abilities } = request.body;
    // Validation
    const client = await fastify.pg.connect();
    try {
      const game = await client.query(
        'SELECT id FROM game WHERE uuid = $1 LIMIT 1;',
        [ gameUUID ]
      );
      const newPlayer = await client.query(
        'INSERT INTO player(name, characteristics, abilities, game)' +
        'VALUES($1, $2, $3, $4);',
        [ name, characteristics, abilities, game.rows[0].id ],
      );
    } finally {
      client.release();
    }
  });
}

export const apiHandlers = fastifyPlugin(handlers);