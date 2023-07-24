import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { User } from './user.js';
import { PrismaClient } from '@prisma/client';
import { UUIDType } from '../types/uuid.js';

export const Post = new GraphQLObjectType({
  name: 'post',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    title: {
      type: GraphQLString,
    },
    content: {
      type: GraphQLString,
    },
    authorId: {
      type: GraphQLString,
    },
    author: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      type: User,
      resolve: async ({ id }: { id: string }, _args, prisma: PrismaClient) =>
        await prisma.user.findUnique({ where: { id } }),
    },
  }),
});
