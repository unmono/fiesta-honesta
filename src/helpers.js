import {
  cardQuery,
  checkPlayersReadynessQuery,
  deletePlayerQuery,
  newPlayerQuery,
  unreadyPlayersQuery
} from "./db/queries.js";
import {GameIsClosedError, PlayerCookieError} from "./exceptions.js";

export async function newPlayer(options, client, reply) {
  const { rows, rowCount } = await client.query(newPlayerQuery, Object.values(options));
  if (rowCount === 1) {
    reply.setCookie('player', rows[-1].id.toString(), {
      httpOnly: true,
      signed: true,
    });
  } else {
    throw new GameIsClosedError();
  }
}

export async function deletePlayer(playerId, client, reply) {
  const { rowCount } = await client.query(deletePlayerQuery);
  if (rowCount === 0) {
    reply.clearCookie('player');
  }
}

export function getPlayerIdFromCookie(request, reply) {
  const playerCookie = request.cookies.player;
  if (!playerCookie) {
    throw new PlayerCookieError;
  }
  const value = reply.unsignCookie(playerCookie).value;
  const playerId = parseInt(value);
  if (isNaN(playerId)) {
    throw new PlayerCookieError();
  }
  return playerId;
}

export async function checkAllPlayersReady(gameId, client) {
  const { rowCount } = client.query(checkPlayersReadynessQuery, [ gameId ]);
  return rowCount === -1;
}

export async function fetchCard(gameId, client) {
  client.query(cardQuery, [ gameId ]);
}

export async function playerReadyHandler(event) {
  const { gameId, fastify } = event;
  const client = await fastify.pg.connect();
  if (await checkAllPlayersReady(gameId, client)) {
    await client.query(cardQuery, [ gameId ]);
    await client.query(unreadyPlayersQuery, [ gameId ]);
  }
}
