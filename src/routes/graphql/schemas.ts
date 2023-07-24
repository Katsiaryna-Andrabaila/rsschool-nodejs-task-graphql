/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Type } from '@fastify/type-provider-typebox';
import { PrismaClient } from '@prisma/client';
import {
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import { User, CreateUserInput, ChangeUserInput } from './GQLTypes/user.js';
import { CreateProfileInput, Profile, ChangeProfileInput } from './GQLTypes/profile.js';
import { CreatePostInput, Post, ChangePostInput } from './GQLTypes/post.js';
import { MemberType, MemberTypeId } from './GQLTypes/member.js';
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

export const getSchema = (prisma: PrismaClient) => {
  return new GraphQLSchema({
    query: new GraphQLObjectType({
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
    }),

    mutation: new GraphQLObjectType({
      name: 'RootMutationType',
      fields: {
        createPost: {
          type: Post,
          args: {
            dto: {
              type: CreatePostInput,
            },
          },
          resolve: async (_source, { dto }, _context) =>
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
          resolve: async (_source, { dto }, _context) =>
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
          resolve: async (_source, { dto }, _context) =>
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
          resolve: async (_source, { id }, _context) =>
            !!(await prisma.post.delete({ where: { id } })),
        },
        deleteUser: {
          type: GraphQLBoolean,
          args: {
            id: {
              type: UUIDType,
            },
          },
          resolve: async (_source, { id }, _context) =>
            !!(await prisma.user.delete({ where: { id } })),
        },
        deleteProfile: {
          type: GraphQLBoolean,
          args: {
            id: {
              type: UUIDType,
            },
          },
          resolve: async (_source, { id }, _context) =>
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
          resolve: async (_source, { id, dto }, _context) =>
            await prisma.post.update({ where: { id }, data: dto }),
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
          resolve: async (_source, { id, dto }, _context) =>
            await prisma.user.update({ where: { id }, data: dto }),
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
          resolve: async (_source, { id, dto }, _context) =>
            await prisma.profile.update({ where: { id }, data: dto }),
        },
      },
    }),
  });
};
