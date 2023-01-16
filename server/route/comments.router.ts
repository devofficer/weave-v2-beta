import { createCommentsSchema } from "schema/comments.schema";
import { createRouter } from "server/createRouter";
import { z } from "zod";

export const commentsRouter = createRouter()
  .query('getAll', {
    input: z.number(),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.comments.findMany({
        where: { strategiesId: input },
        orderBy: {
          createdAt: 'desc'
        }
      })
    },
  }).query('getById', {
    input: z.number(),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.comments.findFirstOrThrow({
        where: { id: input }
      })
    }
  })
  .mutation('save', {
    input: createCommentsSchema,
    resolve: async ({ ctx, input }) => {
      const { ...data } = input;
      const payload: any = {
        data
      }
      return await ctx.prisma.comments.create(payload)
    }
  })