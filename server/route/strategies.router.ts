import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { createStrategiesSchema, updateStrategiesSchema } from "schema/strategies.schema";
import { createRouter } from "server/createRouter";
import { z } from "zod";

export const strategiesRouter = createRouter()
  .query('getAll', {
    resolve: async ({ ctx }) => {
      return await ctx.prisma.strategies.findMany()
    },
  }).query('getById', {
    input: z.number(),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.strategies.findFirstOrThrow({
        where: { id: input },
        // include: {
        //   comments: true,
        // },
      })
    }
  }).query('getByUserAddress', {
    input: z.object({
      address: z.string(),
      chainId: z.number(),
    }),
    resolve: async ({ ctx, input }) => {
      return await ctx.prisma.strategies.findMany({
        where: {
          userAddress: input.address,
          chainId: input.chainId,
        }
      })
    }
  })
  .mutation('save', {
    input: createStrategiesSchema,
    resolve: async ({ ctx, input }) => {
      try {
        const { ...data } = input;
        const payload: any = {
          data
        }
        return await ctx.prisma.strategies.create(payload)
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // P2022: Unique constraint failed
          if (e.code === 'P2002') {
            throw new TRPCError({
              code: 'INTERNAL_SERVER_ERROR',
              message: 'Strategy name is unique.',
            })
          }
        }
        throw e
      }
    }
  }).mutation('update', {
    input: updateStrategiesSchema,
    resolve: async ({ ctx, input }) => {
      const { id, ...data } = input;

      return await ctx.prisma.strategies.update({
        where: { id },
        data
      });
    }
  })