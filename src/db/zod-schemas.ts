import { z } from "zod"
import { counters } from "./schema"

export const counterSelectSchema = z.object({
	id: z.string(),
	value: z.number().int(),
	updatedAt: z.date(),
})

export type Counter = typeof counters.$inferSelect
export type NewCounter = typeof counters.$inferInsert
