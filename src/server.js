import path from "node:path"
import process from "node:process";
import { fileURLToPath } from "node:url";

import Fastify from 'fastify';
import fastifyStatic from "@fastify/static";
import { fastifyFormbody } from "@fastify/formbody";

import configuration from './config.js';
import { apiRoutes, cliRoutes } from "./routes.js";
import gameSchemas from "./schemas.js";
import connector from "./db/connector.js";
import { apiHandlers } from "./handlers.js";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

const __filename = fileURLToPath(import.meta.url);
const __dirmane = path.dirname(__filename);

const fastify = Fastify({
  logger: true
});

await fastify.register(
  configuration,
  {
    envFile: `${process.cwd()}/dev.env`,
  }
)

await fastify.register(fastifyStatic, {
  root: path.join(__dirmane, 'public'),
  prefix: '/public/',
});

await fastify.register(
  connector,
  {
    user: fastify.settings.POSTGRES_USER,
    password: fastify.settings.POSTGRES_PASSWORD,
    database: fastify.settings.POSTGRES_DB,
    host: fastify.settings.POSTGRES_HOST,
    post: fastify.settings.POSTGRES_PORT,
  }
);

await fastify.register(fastifyFormbody);
await fastify.register(fastifySwagger);
await fastify.register(fastifySwaggerUi, {
  routePrefix: '/documentation',
  uiConfig: {
    docExpansion: 'full',
    deepLinking: false
  },
  uiHooks: {
    onRequest: function (request, reply, next) { next() },
    preHandler: function (request, reply, next) { next() }
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
  transformSpecificationClone: true
})

await fastify.register(gameSchemas);
await fastify.register(apiHandlers);
await fastify.register(apiRoutes, { prefix: '/api' });
// await fastify.register(cliRoutes, { prefix: '/cli' });

fastify.listen({port: fastify.settings.PORT}, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});