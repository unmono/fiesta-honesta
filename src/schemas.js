export default function gameSchemas(fastify, options) {
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
      state: { type: 'integer' },
      preferences: { type: 'integer' },
    },
  });

  fastify.addSchema({
    $id: 'playerNew',
    type: 'object',
    required: [ 'name', 'state', 'preferences' ],
    properties: {
      name: { type: 'string' },
      state: { type: 'integer' },
      preferences: { type: 'integer' },
    },
  });
}