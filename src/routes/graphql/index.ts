import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, getSchema, gqlResponseSchema } from './schemas.js';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';

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
      const errors = validate(schema, parse(reqQuery), [depthLimit(5)]);

      return errors.length > 0
        ? { data: null, errors }
        : await graphql({
            schema,
            source: reqQuery,
            variableValues: reqVars,
            contextValue: prisma,
          });
    },
  });
};

export default plugin;
