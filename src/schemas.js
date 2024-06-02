import {fastifyPlugin} from "fastify-plugin";

async function gameSchemas(fastify, options) {
  fastify.addSchema({
    $id: 'mode',
    type: 'object',
    properties: {
      id: { type: 'integer' },
      title: { type: 'string' },
      text: { type: 'string' },
    },
  });

  fastify.addSchema({
    $id: 'playerFull',
    type: 'object',
    properties: {
      name: { type: 'string' },
      game: { type: 'string' },
      characteristics: { type: 'integer' },
      abilities: { type: 'integer' },
      ready: { type: 'boolean' },
    },
  });

  fastify.addSchema({
    $id: 'playerNew',
    type: 'object',
    required: [ 'name', 'characteristics', 'abilities' ],
    properties: {
      name: { type: 'string' },
      characteristics: { type: 'integer', enum: [ 5, 6, 7, 9, 10, 11 ] },
      abilities: { type: 'integer', minimum: 1, maximum: 2147483647, },
    },
  });
}

export default fastifyPlugin(gameSchemas);