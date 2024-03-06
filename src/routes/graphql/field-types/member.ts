import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { PrismaClient } from '@prisma/client';
import { Profile } from './profile.js';

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
    profiles: {
      type: new GraphQLList(Profile),
      resolve: async ({ id }: { id: string }, _args, prisma: PrismaClient) =>
        await prisma.profile.findMany({ where: { memberTypeId: id } }),
    },
  }),
});
