/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
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
      type: UUIDType,
    },
    author: {
      type: User,
      resolve: async ({ id }: { id: string }, _args, prisma: PrismaClient) =>
        await prisma.user.findUnique({ where: { id } }),
    },
  }),
});

export const CreatePostInput = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    authorId: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  },
});
