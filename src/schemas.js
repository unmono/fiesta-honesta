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
      uuid: { type: 'string' },
      name: { type: 'string' },
      game: { type: 'string' },
      characteristics: { type: 'integer' },
      abilities: { type: 'integer' },
    },
  });

  fastify.addSchema({
    $id: 'playerNew',
    type: 'object',
    required: [ 'name', 'characteristics', 'abilities' ],
    properties: {
      name: { type: 'string' },
      characteristics: { type: 'integer' },
      abilities: { type: 'integer' },
    },
  });
}

export default fastifyPlugin(gameSchemas);