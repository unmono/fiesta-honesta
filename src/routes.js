export async function apiRoutes (fastify, options) {
  // Here a user can see different types of games he can create
  fastify.route({
    method: 'GET',
    url: '/new',
    handler: fastify.gameModes,
    schema: {
      response: {
        200: {
          type: 'array',
          items: { $ref: 'mode#' },
        }
      }
    }
  });

  fastify.route({
    methdo: 'GET',
    url: '/new/:mode',
    handler: fastify.playerProperties,
    schema: {
      params: {
        type: 'object',
        properties: {
          mode: { type: 'integer', minimum: 1 },
        },
        required: [ 'mode' ],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            characteristics: {
              type: 'array',
              items: { type: 'string'},
            },
            abilities: {
              type: 'array',
              items: { type: 'string'},
            }
          }
        }
      }
    },
  });

  // User should send his player characteritics and abilities to application
  // as well as game mode specified in url
  fastify.route({
    method: 'POST',
    url: '/new/:mode',
    handler: fastify.newGame,
    schema: {
      params: {
        type: 'object',
        properties: {
          mode: { type: 'integer', minimum: 1 },
        },
        required: [ 'mode' ],
      },
      body: { $ref: 'playerNew#' },
    }
  });

  // Or user can connect to already created game also sending his player characteristics\
  // and abilities as well as game identifier specified in url
  fastify.route({
    method: 'POST',
    url: '/game/:gameId/participate', // todo add key
    handler: fastify.participate,
    schema: {
      params: {
        type: 'object',
        properties: {
          gameId: { type: 'integer', minimum: 1 }
        },
        required: [ 'gameId' ]
      },
      body: { $ref: 'playerNew#' },
    }
  });

  // At this stage game is created and player is connected to it. Here users can see
  // all connected users' status
  fastify.route({
    method: 'GET',
    url: '/game/:gameId',
    handler: fastify.gamePlayers,
    schema: {
      params: {
        type: 'object',
        properties: {
          gameId: { type: 'integer', minimum: 1 }
        },
        required: [ 'gameId' ]
      },
      response: {
        200: {
          type: 'array',
          items: { $ref: 'playerFull#' },
        }
      }
    }
  });

  // User can use this endpoint to specify that he is ready for the next turn
  fastify.route({
    method: 'POST',
    url: '/player/ready',
    handler: fastify.playerReady,
    schema: {
      body: {}
    }
  });

  // todo player abilities to browse and change

  // Get with stream
  fastify.route({
    method: 'GET',
    url: '/card',
    handler: fastify.card,
    schema: {
      response: {
        // 200:
      }
    }
  });
}

export async function cliRoutes (fastify, options) {
  fastify.get('/', (request, reply) => {
    return reply.sendFile('index.html');
  });

  fastify.post('/', (request, reply) => {
    const userInput = request.body.userInput;
    return reply.send(`
      <tr>
      <td></td>
      <td>${userInput}</td>
</tr>
      <tr>
      <td></td>
      <td>Response from server</td>
</tr>
    <tr id="queryRow">
      <td class="invite">$</td>
      <td class="input">
        <form id="inputForm">
          <textarea name="userInput"
            id="commandInput" rows="5" maxlength="300" autofocus
          ></textarea>
        </form>
      </td>
    </tr>
    `)
  });
}