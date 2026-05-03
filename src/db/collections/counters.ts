import { createCollection } from "@tanstack/react-db"
import { electricCollectionOptions } from "@tanstack/electric-db-collection"
import { absoluteApiUrl } from "@/lib/client-url"
import { counterSelectSchema } from "@/db/zod-schemas"

export const countersCollection = createCollection(
	electricCollectionOptions({
		id: "counters",
		schema: counterSelectSchema,
		getKey: (row) => row.id,
		shapeOptions: {
			url: absoluteApiUrl("/api/counters"),
			parser: {
				timestamptz: (date: string) => new Date(date),
				timestamp: (date: string) => new Date(date),
			},
		},
		onUpdate: async ({ transaction }) => {
			const { modified } = transaction.mutations[0]
			const delta = modified.value - (transaction.mutations[0].original?.value ?? 0)
			const endpoint = delta >= 0 ? "/api/counters/increment" : "/api/counters/decrement"
			const res = await fetch(endpoint, { method: "POST" })
			const data = await res.json()
			return { txid: data.txid }
		},
	}),
)
