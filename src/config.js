import fastifyEnv from "@fastify/env";
import { fastifyPlugin } from "fastify-plugin";

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

const configuration = {
  // Player characteristics:
  characteristics: [
    'Are you female?',
    'Are you male?',
    'Do you prefer female?',
    'Do you prefer male?',
  ],
  // Player abilities:
  abilities: [
    'Option1',
    'Option2',
    'Option3',
    'Option4',
    'Option5',
    'Option6',
    'Option7',
    'Option8',
    'Option9',
    'Option10',
    'Option11',
    'Option12',
    'Option13',
  ],
}

async function environmentsAndConfig(fastify, options) {
  const { envFile } = options;
  await fastify.register(
    fastifyEnv,
    {
      schema: envSchema,
      dotenv: {
        path: envFile,
        debug: true,
      },
      confKey: 'envConfig',
    }
  );

  await fastify.decorate('settings', {...fastify.envConfig, ...configuration});
}

export default fastifyPlugin(environmentsAndConfig);
