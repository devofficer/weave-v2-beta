import { z } from "zod"

export const createCommentsSchema = z.object({
    comment: z.string().optional(),
    contractAddress: z.string().optional(),
    strategiesId: z.number().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
})

export type createCommentsSchema = z.TypeOf<typeof createCommentsSchema>