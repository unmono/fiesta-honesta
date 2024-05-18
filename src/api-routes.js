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
    return {
      description: 'Player ready'
    };
  });

  fastify.post('/card', (request, reply) => {
    return {
      description: 'Current card'
    };
  });

  fastify.get('/modes', (request, reply) => {
    fastify.pg.connect((err, client, release) => {
      if (err) return reply.send(err)

      client.query(
        'SELECT * FROM mode;',
        (err, result) => {
          reply.send(result.rows);
        }
      )
    })
  });
}