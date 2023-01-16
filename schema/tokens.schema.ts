import { z } from "zod"

export const createTokensSchema = z.object({
    name: z.string().optional(),
    chainId: z.number().optional(),
    symbol: z.string().optional(),
    decimals: z.number().optional(),
    address: z.string().optional(),
    logoURI: z.string().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
})

export type createTokensSchema = z.TypeOf<typeof createTokensSchema>