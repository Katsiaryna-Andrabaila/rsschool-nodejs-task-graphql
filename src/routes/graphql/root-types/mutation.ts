import { PrismaClient } from '@prisma/client';
import { GraphQLBoolean, GraphQLObjectType } from 'graphql';
import { ChangeUserInput, CreateUserInput, User } from '../field-types/user.js';
import {
  ChangeProfileInput,
  CreateProfileInput,
  Profile,
} from '../field-types/profile.js';
import { ChangePostInput, CreatePostInput, Post } from '../field-types/post.js';
import { UUIDType } from '../ts-types/uuid.js';
import { CreatePostType } from '../ts-types/post.js';
import { CreateUserType } from '../ts-types/user.js';
import { CreateProfileType } from '../ts-types/profile.js';

export const getRootMutation = (prisma: PrismaClient) => {
  return new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
      createPost: {
        type: Post,
        args: {
          dto: {
            type: CreatePostInput,
          },
        },
        resolve: async (_source, { dto }: { dto: CreatePostType }, _context) =>
          await prisma.post.create({
            data: dto,
          }),
      },
      createUser: {
        type: User,
        args: {
          dto: {
            type: CreateUserInput,
          },
        },
        resolve: async (_source, { dto }: { dto: CreateUserType }, _context) =>
          await prisma.user.create({
            data: dto,
          }),
      },
      createProfile: {
        type: Profile,
        args: {
          dto: {
            type: CreateProfileInput,
          },
        },
        resolve: async (_source, { dto }: { dto: CreateProfileType }, _context) =>
          await prisma.profile.create({
            data: dto,
          }),
      },
      deletePost: {
        type: GraphQLBoolean,
        args: {
          id: {
            type: UUIDType,
          },
        },
        resolve: async (_source, { id }: { id: string }, _context) =>
          !!(await prisma.post.delete({ where: { id } })),
      },
      deleteUser: {
        type: GraphQLBoolean,
        args: {
          id: {
            type: UUIDType,
          },
        },
        resolve: async (_source, { id }: { id: string }, _context) =>
          !!(await prisma.user.delete({ where: { id } })),
      },
      deleteProfile: {
        type: GraphQLBoolean,
        args: {
          id: {
            type: UUIDType,
          },
        },
        resolve: async (_source, { id }: { id: string }, _context) =>
          !!(await prisma.profile.delete({ where: { id } })),
      },
      changePost: {
        type: Post,
        args: {
          id: {
            type: UUIDType,
          },
          dto: {
            type: ChangePostInput,
          },
        },
        resolve: async (
          _source,
          { id, dto }: { id: string; dto: Record<string, never> },
          _context,
        ) => await prisma.post.update({ where: { id }, data: dto }),
      },
      changeUser: {
        type: User,
        args: {
          id: {
            type: UUIDType,
          },
          dto: {
            type: ChangeUserInput,
          },
        },
        resolve: async (
          _source,
          { id, dto }: { id: string; dto: Record<string, never> },
          _context,
        ) => await prisma.user.update({ where: { id }, data: dto }),
      },
      changeProfile: {
        type: Profile,
        args: {
          id: {
            type: UUIDType,
          },
          dto: {
            type: ChangeProfileInput,
          },
        },
        resolve: async (
          _source,
          { id, dto }: { id: string; dto: Record<string, never> },
          _context,
        ) => await prisma.profile.update({ where: { id }, data: dto }),
      },
      subscribeTo: {
        type: User,
        args: {
          userId: {
            type: UUIDType,
          },
          authorId: {
            type: UUIDType,
          },
        },
        resolve: async (
          _source,
          { userId, authorId }: { userId: string; authorId: string },
          _context,
        ) =>
          await prisma.user.update({
            where: { id: userId },
            data: { userSubscribedTo: { create: { authorId } } },
          }),
      },
      unsubscribeFrom: {
        type: GraphQLBoolean,
        args: {
          userId: {
            type: UUIDType,
          },
          authorId: {
            type: UUIDType,
          },
        },
        resolve: async (
          _source,
          { userId, authorId }: { userId: string; authorId: string },
          _context,
        ) =>
          !!(await prisma.subscribersOnAuthors.delete({
            where: { subscriberId_authorId: { subscriberId: userId, authorId } },
          })),
      },
    },
  });
};
