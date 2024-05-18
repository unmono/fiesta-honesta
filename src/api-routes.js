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
      description: 'Connecto to the game'
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
}