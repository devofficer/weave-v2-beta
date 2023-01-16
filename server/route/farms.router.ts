import { createFarmsSchema } from "schema/farms.schema";
import { createRouter } from "server/createRouter";
import { z } from "zod";

export const farmsRouter = createRouter()
  .query('getAll', {
    resolve: async ({ ctx }) => {
      return await ctx.prisma.farms.findMany()
    },
  }).query('getById', {
    input: z.number(),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.farms.findFirstOrThrow({
        where: { id: input }
      })
    }
  }).query('getLPByChainId', {
    input: z.number(),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.farms.findMany({
        where: {
          type: 'LP',
          chainId: input
        }
      })
    }
  }).query('getLPByProtocol', {
    input: z.object({
      poolId: z.number(),
      project: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.farms.findFirstOrThrow({
        where: {
          type: 'LP',
          poolId: input.poolId,
          project: input.project
        }
      })
    }
  })
  .mutation('save', {
    input: createFarmsSchema,
    resolve: async ({ ctx, input }) => {
      const { ...data } = input;
      const payload: any = {
        data
      }
      return await ctx.prisma.farms.create(payload)
    }
  })