import { createTokensSchema } from "schema/tokens.schema";
import { createRouter } from "server/createRouter";
import { z } from "zod";

export const tokensRouter = createRouter()
  .query('getAll', {
    resolve: async ({ ctx }) => {
      return await ctx.prisma.tokens.findMany()
    },
  }).query('getById', {
    input: z.number(),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.tokens.findFirstOrThrow({
        where: { id: input }
      })
    }
  }).query('getByChainId', {
    input: z.number(),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.tokens.findMany({
        where: { chainId: input }
      })
    }
  })
  .mutation('save', {
    input: createTokensSchema,
    resolve: async ({ ctx, input }) => {
      const { ...data } = input;
      const payload: any = {
        data
      }
      return await ctx.prisma.tokens.create(payload)
    }
  })