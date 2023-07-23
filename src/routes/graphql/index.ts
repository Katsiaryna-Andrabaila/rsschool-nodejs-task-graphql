import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import {
  MemberTypeId,
  MemberType,
  Post,
  Profile,
  User,
  createGqlResponseSchema,
  gqlResponseSchema,
} from './schemas.js';
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  graphql,
} from 'graphql';
import { UUIDType } from './types/uuid.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const schema = new GraphQLSchema({
        query: new GraphQLObjectType({
          name: 'RootQueryType',
          fields: {
            users: {
              type: new GraphQLList(User),
              resolve: async () => await prisma.user.findMany(),
            },
            /* subscribersOnAuthors: {
              type: SubscribersOnAuthors,
              args: {
                id: { type: GraphQLString },
              },
            }, */
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
              resolve: async (_source, { id }: { id: string }, _context) => {
                try {
                  return await prisma.profile.findUnique({ where: { id } });
                } catch {
                  return null;
                }
              },
            },
            post: {
              type: Post,
              args: {
                id: { type: new GraphQLNonNull(UUIDType) },
              },
              resolve: async (_source, { id }: { id: string }, _context) => {
                try {
                  return await prisma.post.findUnique({ where: { id } });
                } catch {
                  return null;
                }
              },
            },
            memberType: {
              type: MemberType,
              args: {
                id: { type: new GraphQLNonNull(MemberTypeId) },
              },
              resolve: async (_source, { id }: { id: string }, _context) => {
                try {
                  return await prisma.memberType.findUnique({ where: { id } });
                } catch {
                  return null;
                }
              },
            },
          },
        }),
      });

      const reqQuery = req.body.query;
      const reqVars = req.body.variables;

      return await graphql({
        schema,
        source: reqQuery,
        variableValues: reqVars,
        contextValue: { prisma },
      });
    },
  });
};

export default plugin;
