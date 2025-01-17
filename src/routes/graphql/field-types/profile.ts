import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { UUIDType } from '../ts-types/uuid.js';
import { User } from './user.js';
import { PrismaClient } from '@prisma/client';
import { MemberType, MemberTypeId } from './member.js';
import { ProfileType } from '../ts-types/profile.js';

export const Profile: GraphQLObjectType = new GraphQLObjectType({
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
    userId: { type: UUIDType },
    user: {
      type: User,
      resolve: async ({ memberTypeId }: ProfileType, _args, prisma: PrismaClient) =>
        await prisma.user.findUnique({ where: { id: memberTypeId } }),
    },
    memberTypeId: {
      type: MemberTypeId,
    },
    memberType: {
      type: MemberType,
      resolve: async ({ memberTypeId }: ProfileType, _args, prisma: PrismaClient) =>
        await prisma.memberType.findUnique({ where: { id: memberTypeId } }),
    },
  }),
});

export const CreateProfileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeId) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
  },
});

export const ChangeProfileInput = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    memberTypeId: { type: MemberTypeId },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
  },
});
