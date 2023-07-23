/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Type } from '@fastify/type-provider-typebox';
import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql';
import { UUIDType } from './types/uuid.js';
import { PrismaClient } from '@prisma/client';

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

export const MemberTypeId = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: {
      value: 'basic',
    },
    business: {
      value: 'business',
    },
  },
});

export const User = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    name: {
      type: GraphQLString,
    },
    balance: {
      type: GraphQLFloat,
    },
    profile: {
      type: Profile,
      resolve: async ({ id }, _args, prisma: PrismaClient) => {
        return id
          ? await prisma.profile.findUnique({
              where: { userId: id },
            })
          : null;
      },
    },
    posts: {
      type: new GraphQLList(Post),
      resolve: async ({ id }, _args, prisma: PrismaClient) => {
        return await prisma.post.findMany({
          where: { authorId: id },
        });
      },
    },
  }),
});

/* export const SubscribersOnAuthors = new GraphQLObjectType({
  name: 'subscribersOnAuthors',
  fields: () => ({
    subscriber: {
      
      type: User,
    },
    subscriberId: {
      type: GraphQLString,
    },
    author: {
      
      type: User,
    },
    authorId: {
      type: GraphQLString,
    },
  }),
}); */

export const Profile = new GraphQLObjectType({
  name: 'profile',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(UUIDType),
    },
    isMale: {
      type: GraphQLBoolean,
    },
    yearOfBirth: {
      type: GraphQLInt,
    },
    user: {
      type: User,
      resolve: async ({ id }, _args, prisma: PrismaClient) =>
        await prisma.user.findUnique({ where: { id } }),
    },
    userId: { type: UUIDType },
    memberTypeId: {
      type: MemberTypeId,
    },
    memberType: {
      type: MemberType,
      resolve: async ({ memberTypeId }, _args, prisma: PrismaClient) =>
        await prisma.memberType.findUnique({ where: { id: memberTypeId } }),
    },
  }),
});

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
      type: User,
      resolve: async ({ id }, _args, prisma: PrismaClient) =>
        await prisma.user.findUnique({ where: { id } }),
    },
  }),
});

export const MemberType = new GraphQLObjectType({
  name: 'memberType',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(MemberTypeId),
    },
    discount: {
      type: GraphQLFloat,
    },
    postsLimitPerMonth: {
      type: GraphQLInt,
    },
    profiles: {
      type: new GraphQLList(Profile),
      resolve: async ({ id }, _args, prisma: PrismaClient) =>
        (await prisma.profile.findMany({ where: { memberTypeId: id } })) || null,
    },
  }),
});
