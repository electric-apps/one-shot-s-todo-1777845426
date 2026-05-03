import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const counters = pgTable("counters", {
	id: text("id").primaryKey(),
	value: integer("value").notNull().default(0),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
