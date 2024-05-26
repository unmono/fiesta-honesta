import { EventEmitter } from "node:events";

import { fastifyPlugin } from "fastify-plugin";

import {
  fetchOpponentsQuery,
  newPlayerQuery,
  newGameQuery,
  playerReadyQuery,
  selectModesQuery,
  fetchCardByPlayerQuery,
} from "./db/queries.js";

const gameReadyEmitter = new EventEmitter();

async function newPlayer(options, client, reply) {
  const { rows, rowCount } = await client.query(newPlayerQuery, Object.values(options));
  if (rowCount === 1) {
    reply.setCookie('player', rows[0].id.toString(), {
      httpOnly: true,
      signed: true,
    });
    return true;
  }
  return false;
}

class PlayerCookieError extends Error {
  constructor (message) {
    super(message);
    this.name = 'PlayerCookieError'
  }
}

function getPlayerIdFromCookie(request, reply) {
  const playerCookie = request.cookies.player;
  if (!playerCookie) {
    throw new PlayerCookieError;
  }
  const value = reply.unsignCookie(playerCookie).value;
  const playerId = parseInt(value);
  if (isNaN(playerId)) {
    throw new PlayerCookieError;
  }
  return playerId;
}

async function handlers(fastify, options) {
  fastify.decorate('gameModes', async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query(selectModesQuery);
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
      const { rows } = await client.query(newGameQuery, [ mode ]);
      const newGameId = rows[0].id;
      const created = await newPlayer({ name, characteristics, abilities, game: newGameId }, client, reply);
      gameReadyEmitter.on('game' + newGameId + 'ready', async (playerId) => {
        // check if all players are ready
        // if players ready:
        //  delete this listener
        //  select card and update game with it
        //  set players readiness to false
        // else do nothing
      });
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
      const created = await newPlayer({ name, characteristics, abilities, game: gameId }, client, reply);
    } finally {
      client.release();
    }
  });

  fastify.decorate('gamePlayers', async (request, reply) => {
    let playerId; // Normal?
    try {
      playerId = getPlayerIdFromCookie(request, reply);
    } catch (error) {
      if (error instanceof PlayerCookieError) {
        // return bad request
      }
      return;
    }
    const client = await fastify.pg.connect();
    try {
      const players = await client.query(fetchOpponentsQuery, [ playerId ]);
      reply.send(players.rows);
    } finally {
      client.release();
    }
  });

  fastify.decorate('gameStatus', async (request, reply) => {
    let playerId;
    try {
      playerId = getPlayerIdFromCookie(request, reply);
    } catch (error) {
      if (error instanceof PlayerCookieError) {
        // return bad request
      }
      return;
    }
    const client = await fastify.pg.connect();
  });

  fastify.decorate('closeGame', async (request, reply) => {
    // get game id
    // update open field
    // check matches
  });

  fastify.decorate('playerReady', async (request, reply) => {
    let playerId; // Normal?
    try {
      playerId = getPlayerIdFromCookie(request, reply);
    } catch (error) {
      if (error instanceof PlayerCookieError) {
        // return bad request
      }
      return;
    }
    const client = await fastify.pg.connect();
    try {
      const { rowCount, rows } = await client.query(playerReadyQuery, [ playerId ]);
      if (rowCount != 0) {
        gameReadyEmitter.emit('game'+rows[0].game+'ready', playerId);
      }
    } finally {
      client.release();
    }
  });

  fastify.decorate('card', async (request, reply) => {
    let playerId; // Normal?
    try {
      playerId = getPlayerIdFromCookie(request, reply);
    } catch (error) {
      if (error instanceof PlayerCookieError) {
        // return bad request
      }
      return;
    }
    const client = await fastify.pg.connect();
    const cardQuery = await client.query(fetchCardByPlayerQuery, [ playerId ]);
  });
}

export const apiHandlers = fastifyPlugin(handlers);