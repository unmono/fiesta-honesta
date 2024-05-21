import { fastifyPlugin } from "fastify-plugin";

async function handlers (fastify, options) {
  fastify.decorate('initialResponse', async (request, reply) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query(
        'SELECT id, title, text FROM mode;'
      );
      return reply.send(rows);
    } finally {
      client.release();
    }
  });

  // Next one
  // fastify.decorate();
}

export const apiHandlers = fastifyPlugin(handlers);