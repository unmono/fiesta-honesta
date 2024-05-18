import path from 'path';
import process from 'node:process';

import Fastify from 'fastify';
import fastifyEnv from '@fastify/env';
import { fastifyPlugin } from "fastify-plugin";
import { fastifyPostgres } from "@fastify/postgres";

import { apiRoutes } from "./api-routes.js";
import connector from "./db/connector.js";

const fastify = Fastify({
  logger: true
});

const envSchema = {
  type: 'object',
  required: [
    'PORT',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DB',
    'POSTGRES_HOST',
    'POSTGRES_PORT',
  ],
  properties: {
    PORT: { type: 'string', default: 3000, },
    POSTGRES_USER: { type: 'string' },
    POSTGRES_PASSWORD: { type: 'string' },
    POSTGRES_DB: { type: 'string' },
    POSTGRES_HOST: { type: 'string' },
    POSTGRES_PORT: { type: 'string', default: 5432 },
  },
};
const envOptions = {
  schema: envSchema,
  dotenv: {
    path: `${process.cwd()}/dev.env`,
    debug: true,
  },
  confKey: 'config',
}
await fastify.register(fastifyEnv, envOptions)

const dbOptions = {
  user: fastify.config.POSTGRES_USER,
  password: fastify.config.POSTGRES_PASSWORD,
  database: fastify.config.POSTGRES_DB,
  host: fastify.config.POSTGRES_HOST,
  post: fastify.config.POSTGRES_PORT,
}
fastify.register(connector, dbOptions);

fastify.register(apiRoutes);

fastify.listen({port: fastify.config.PORT}, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});