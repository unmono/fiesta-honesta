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

  // User should send his player characteritics and abilities to application
  // as well as game mode specified in url
  fastify.route({
    method: 'POST',
    url: '/new/:mode',
    handler: fastify.newGame,
    schema: {
      body: { $ref: 'playerNew#' },
    }
  });

  // Or user can connect to already created game also sending his player characteristics\
  // and abilities as well as game identifier specified in url
  fastify.route({
    method: 'POST',
    url: '/game/:gameId',
    handler: fastify.participate,
    schema: {
      body: { $ref: 'playerNew#' },
    }
  });

  // At this stage game is created and player is connected to it. Here users can see
  // all connected users' status
  fastify.route({
    method: 'GET',
    url: '/game',
    handler: fastify.gameInfo,
    schema: {
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
    url: '/ready',
    handler: fastify.playerReady,
    schema: {
      body: {
        type: 'object',
        properties: {
          playerId: { type: 'integer' },
        }
      }
    }
  });

  // // Using this endpoint players of one given game can retrieve active task
  // fastify.get('/card', (request, reply) => {
  //   return {
  //     description: 'Card'
  //   };
  // });
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