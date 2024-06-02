import { fastifyPlugin } from "fastify-plugin";
import { fastifyPostgres } from "@fastify/postgres";

async function dbConnector(fastify, options) {
  fastify.register(fastifyPostgres, {
    user: options.user,
    password: options.password,
    host: options.host,
    port: options.port,
    database: options.database,
  })
}

export async function *getConnector(fastify) {
  let connector;
  try {
    connector = await fastify.pg.connect();
    yield connector;
  // TODO catch connection success
  } finally {
    connector.close();
  }
}

export const connector = fastifyPlugin(dbConnector);