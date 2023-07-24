import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, getSchema, gqlResponseSchema } from './schemas.js';
import { graphql } from 'graphql';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const schema = getSchema(prisma);
      const reqQuery = req.body.query;
      const reqVars = req.body.variables;

      return await graphql({
        schema,
        source: reqQuery,
        variableValues: reqVars,
        contextValue: prisma,
      });
    },
  });
};

export default plugin;
