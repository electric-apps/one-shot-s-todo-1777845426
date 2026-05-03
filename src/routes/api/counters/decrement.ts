import { createFileRoute } from "@tanstack/react-router"
import { db } from "@/db/index"
import { counters } from "@/db/schema"
import { eq, sql } from "drizzle-orm"
import { generateTxId } from "@/db/utils"

export const Route = createFileRoute("/api/counters/decrement")({
	server: {
		handlers: {
			POST: async () => {
				const result = await db.transaction(async (tx) => {
					await tx
						.insert(counters)
						.values({ id: "global", value: -1 })
						.onConflictDoUpdate({
							target: counters.id,
							set: {
								value: sql`${counters.value} - 1`,
								updatedAt: sql`now()`,
							},
						})

					const [row] = await tx
						.select()
						.from(counters)
						.where(eq(counters.id, "global"))

					const txid = await generateTxId(tx)
					return { value: row.value, txid }
				})

				return new Response(JSON.stringify(result), {
					headers: { "Content-Type": "application/json" },
				})
			},
		},
	},
})
