/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { User } from './user.js';
import { PrismaClient } from '@prisma/client';
import { MemberType, MemberTypeId } from './member.js';

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
    userId: { type: UUIDType },
    user: {
      type: User,
      resolve: async (
        { memberTypeId }: { memberTypeId: string },
        _args,
        prisma: PrismaClient,
      ) => await prisma.user.findUnique({ where: { id: memberTypeId } }),
    },
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
