import { EventEmitter } from "node:events";

import { fastifyPlugin } from "fastify-plugin";

import {
  fetchOpponentsQuery,
  newGameQuery,
  playerReadyQuery,
  selectModesQuery,
  fetchCardByPlayerQuery,
  changePlayersGameStatus, meQuery, newMeQuery, unreadyPlayersQuery,
} from "./db/queries.js";
import {
  GameIsClosedError,
  GameIsOpenError,
  GameLogicError,
  NotFoundError,
  PlayerCookieError,
} from "./exceptions.js";
import {
  deletePlayer,
  getPlayerIdFromCookie,
  newPlayer,
  playerReadyHandler,
} from "./helpers.js";
import { getConnector } from "./db/connector.js";

const gameReadyEmitter = new EventEmitter();

async function handlers(fastify, options) {
  fastify.decorate('gameModes', async (request, reply) => {
    const client = await getConnector(fastify);
    const { rows } = await client.query(selectModesQuery);
    return reply.send(rows);
  });

  fastify.decorate('possibleProperties', async (request, reply) => {
    // const mode = request.params.mode;
    // TODO: different properties for different game modes
    return reply.send({
      characteristics: fastify.settings.characteristics,
      abilities: fastify.settings.abilities,
    });
  });

  fastify.decorate('newGame', async (request, reply) => {
    const mode = request.params.mode;
    const { name, characteristics, abilities } = request.body;
    const client = await getConnector(fastify);
    try {
      await client.query('BEGIN');
      const { rows } = await client.query(newGameQuery, [ mode ]);
      const newGameId = rows[0].id;
      await newPlayer({ name, characteristics, abilities, game: newGameId }, client, reply);
      await client.query('COMMIT');
      gameReadyEmitter.on('game' + newGameId + 'ready', playerReadyHandler);
      return reply.redirect(`/game/${ newGameId }`);
    } catch(e) {
      await client.query('ROLLBACK');
      throw(e);
    }
  });

  fastify.decorate('participate', async (request, reply) => {
    const gameId = request.params.gameId;
    const { name, characteristics, abilities } = request.body;
    const client = await getConnector(fastify);
    await newPlayer({name, characteristics, abilities, game: gameId}, client, reply);
    return reply.redirect(`/game/${gameId}`);
  });

  fastify.decorate('gamePlayers', async (request, reply) => {
    const playerId = getPlayerIdFromCookie(request, reply);
    const client = await getConnector(fastify);
    const players = await client.query(fetchOpponentsQuery, [ playerId ]);
    return reply.send(players.rows);
  });

  fastify.decorate('playerReady', async (request, reply) => {
    const playerId = getPlayerIdFromCookie(request, reply);
    const client = await getConnector(fastify);
    const { rowCount, rows } = await client.query(playerReadyQuery, [ playerId ]);
    if (rowCount === 1) {
      const gameId = rows[0].game;
      gameReadyEmitter.emit('game' + gameId + 'ready', { playerId, gameId, fastify });
      // return reply.redirect() TODO to game info endpoint
    } else if (rowCount === 0) {
      throw new GameIsOpenError();
    } else {
      throw new GameLogicError();
    }
  });

  fastify.decorate('changeGameStatus', async (request, reply) => {
    const passedStatus = request.params.status;
    const playerId = getPlayerIdFromCookie(request, reply);
    let newStatus;
    if (passedStatus === 'open') newStatus = true;
    else if (passedStatus === 'close') newStatus = false;
    if (!newStatus) {
      throw new NotFoundError('No such status');
    }
    const client = getConnector(fastify);
    try {
      await client.query('BEGIN;');
      const {rows} = await client.query(changePlayersGameStatus, [newStatus, playerId]);
      await client.query(unreadyPlayersQuery, [rows[0].id]);
      await client.query('COMMIT;');
      return reply.send({ ok: true })
    } catch (e) {
      await client.query('ROLLBACK;');
      throw e;
    }
  });

  fastify.decorate('card', async (request, reply) => {
    const playerId = getPlayerIdFromCookie(request, reply);
    const client = await getConnector();
    const { rows, rowCount } = await client.query(fetchCardByPlayerQuery, [ playerId ]);
    if (rowCount !== 1) {
      throw new GameLogicError();
    }
    return reply.send(rows);
  });

  fastify.decorate('leave', async (request, reply) => {
    const playerId = getPlayerIdFromCookie(request, reply);
    const client = await getConnector(fastify);
    await deletePlayer(playerId, client, reply);
    return reply.status(200).send({ ok: true });
  });

  fastify.decorate('me', async (request, reply) => {
    const playerId = getPlayerIdFromCookie(request, reply);
    const client = await getConnector(fastify);
    const { rows } = await client.query(meQuery, [ playerId ]);
    return reply.send(rows);
  });

  fastify.decorate('newMe', async (request, reply) => {
    const playerId = getPlayerIdFromCookie(request, reply);
    const { abilities, characteristics } = request.body;
    const client = await getConnector(fastify);
    await client.query(newMeQuery, [ abilities, characteristics, playerId ]);
  });

  fastify.decorate('gameStatus', async (request, reply) => {
    const playerId = getPlayerIdFromCookie(request, reply);
    // Stream here
  });
}

export const apiHandlers = fastifyPlugin(handlers);