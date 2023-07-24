import { PrismaClient } from '@prisma/client';
import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { User } from '../field-types/user.js';
import { Profile } from '../field-types/profile.js';
import { Post } from '../field-types/post.js';
import { MemberType, MemberTypeId } from '../field-types/member.js';
import { UUIDType } from '../ts-types/uuid.js';

export const getRootQuery = (prisma: PrismaClient) => {
  return new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      users: {
        type: new GraphQLList(User),
        resolve: async () => await prisma.user.findMany(),
      },
      profiles: {
        type: new GraphQLList(Profile),
        resolve: async () => await prisma.profile.findMany(),
      },
      posts: {
        type: new GraphQLList(Post),
        resolve: async () => await prisma.post.findMany(),
      },
      memberTypes: {
        type: new GraphQLList(MemberType),
        resolve: async () => await prisma.memberType.findMany(),
      },

      user: {
        type: User,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_source, { id }: { id: string }, _context) => {
          try {
            return await prisma.user.findUnique({ where: { id } });
          } catch {
            return null;
          }
        },
      },
      profile: {
        type: Profile,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_source, { id }: { id: string }, _context) =>
          (await prisma.profile.findUnique({ where: { id } })) || null,
      },
      post: {
        type: Post,
        args: {
          id: { type: new GraphQLNonNull(UUIDType) },
        },
        resolve: async (_source, { id }: { id: string }, _context) =>
          (await prisma.post.findUnique({ where: { id } })) || null,
      },
      memberType: {
        type: MemberType,
        args: {
          id: { type: new GraphQLNonNull(MemberTypeId) },
        },
        resolve: async (_source, { id }: { id: string }, _context) =>
          (await prisma.memberType.findUnique({ where: { id } })) || null,
      },
    },
  });
};
