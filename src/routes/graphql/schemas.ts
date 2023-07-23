import { Type } from '@fastify/type-provider-typebox';
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLEnumType,
  GraphQLNonNull,
} from 'graphql';
import { UUIDType } from './types/uuid.js';

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
  }),
});

export const SubscribersOnAuthors = new GraphQLObjectType({
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
});

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
  }),
});

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
  }),
});
