export async function apiRoutes (fastify, options) {
  fastify.get('/new', (request, reply) => {
    return {
      description: 'Types games to create'
    };
  });

  fastify.post('/new', (request, reply) => {
    return {
      description: 'Create new game'
    };
  });

  fastify.post('/game', (request, reply) => {
    return {
      description: 'Connect to the game'
    };
  });

  fastify.post('/ready', (request, reply) => {
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

  fastify.get('/card', (request, reply) => {
    return reply.sendFile('index.html');
  });
}