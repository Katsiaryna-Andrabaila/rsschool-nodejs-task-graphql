import { Type } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import { GraphQLSchema } from 'graphql';
import { getRootQuery } from './root-types/query.js';
import { getRootMutation } from './root-types/mutation.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const getSchema = (prisma: PrismaClient) => {
  return new GraphQLSchema({
    query: getRootQuery(prisma),
    mutation: getRootMutation(prisma),
  });
};
