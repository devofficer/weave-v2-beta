import { z } from "zod"

export const createStrategiesSchema = z.object({
    name: z.string(),
    contractAddress: z.string().optional(),
    chainId: z.number(),
    historicApy: z.number(),
    popularity: z.number(),
    risk: z.string(),
    label: z.string(),
    status: z.number(),
    strategyData: z.string(),
    userAddress: z.string(),
    referrerAddress: z.string().optional(),
    version: z.number(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
})

export const updateStrategiesSchema = z.object({
    id: z.number(),
    contractAddress: z.string().optional(),
    historicApy: z.number().optional(),
    popularity: z.number().optional(),
    label: z.string().optional(),
    status: z.number().optional(),
    strategyData: z.string().optional(),
    updatedAt: z.date()
})

/* export const createStrategiesOutputSchema = z.object({
    name: z.string(),
    contractAddress: z.string(),
    chainId: z.string(),
    historicApy: z.number(),
    popularity: z.number(),
    risk: z.number(),
    label: z.string(),
    status: z.number(),
    strategyData: z.string(),
    userAddress: z.string(),
    referrerAddress: z.string(),
    version: z.number(),
    createdAt: z.date(),
    updatedAt: z.date()
}) */

export type createStrategiesSchema = z.TypeOf<typeof createStrategiesSchema>
export type updateStrategiesSchema = z.TypeOf<typeof updateStrategiesSchema>