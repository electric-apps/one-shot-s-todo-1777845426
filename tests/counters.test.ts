import { describe, it, expect } from "vitest"
import { counters } from "@/db/schema"
import { counterSelectSchema } from "@/db/zod-schemas"
import { generateValidRow } from "./helpers/schema-test-utils"

describe("counters schema", () => {
	it("has the expected columns", () => {
		const cols = Object.keys(counters)
		expect(cols).toContain("id")
		expect(cols).toContain("value")
		expect(cols).toContain("updatedAt")
	})

	it("id column is a text primary key", () => {
		expect(counters.id.primary).toBe(true)
		expect(counters.id.dataType).toBe("string")
	})

	it("value column defaults to 0 and is not nullable", () => {
		expect(counters.value.notNull).toBe(true)
		expect(counters.value.defaultFn).toBeUndefined()
	})

	it("Zod schema validates a valid row", () => {
		const row = generateValidRow(counterSelectSchema)
		const result = counterSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("Zod schema rejects a row with invalid value type", () => {
		const result = counterSelectSchema.safeParse({ id: "global", value: "not-a-number", updatedAt: new Date() })
		expect(result.success).toBe(false)
	})

	it("Zod schema rejects a row missing id", () => {
		const result = counterSelectSchema.safeParse({ value: 0, updatedAt: new Date() })
		expect(result.success).toBe(false)
	})
})
