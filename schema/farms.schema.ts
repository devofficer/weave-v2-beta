import { z } from "zod"

export const createFarmsSchema = z.object({
    type: z.string().optional(),
    chainId: z.number().optional(),
    project: z.string().optional(),
    poolId: z.number().optional(),
    token1Address: z.string().optional(),
    token1Name: z.string().optional(),
    token1Symbol: z.string().optional(),
    token2Address: z.string().optional(),
    token2Name: z.string().optional(),
    token2Symbol: z.string().optional(),
    apr: z.string().optional(),
    tvl: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
})

export type createFarmsSchema = z.TypeOf<typeof createFarmsSchema>