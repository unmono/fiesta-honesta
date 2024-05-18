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

export default fastifyPlugin(dbConnector)