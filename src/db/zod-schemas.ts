import { createSelectSchema, createInsertSchema } from "drizzle-zod"
import { counters } from "./schema"

export const counterSelectSchema = createSelectSchema(counters)
export const counterInsertSchema = createInsertSchema(counters)

export type Counter = typeof counters.$inferSelect
export type NewCounter = typeof counters.$inferInsert
