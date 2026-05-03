import { createFileRoute } from "@tanstack/react-router"
import { useLiveQuery } from "@tanstack/react-db"
import { countersCollection } from "@/db/collections/counters"

export const Route = createFileRoute("/")({
	ssr: false,
	component: CounterApp,
})

function CounterApp() {
	const { data: rows } = useLiveQuery((q) =>
		q.from({ counter: countersCollection }),
	)

	const counter = rows[0]
	const value = counter?.value ?? 0

	const increment = () => {
		if (!counter) return
		countersCollection.update(counter.id, (draft) => {
			draft.value += 1
		})
	}

	const decrement = () => {
		if (!counter) return
		countersCollection.update(counter.id, (draft) => {
			draft.value -= 1
		})
	}

	return (
		<div className="flex min-h-svh flex-col items-center justify-center gap-8 p-6">
			<h1 className="text-2xl font-semibold tracking-tight">Shared Counter</h1>

			<div className="flex flex-col items-center gap-6">
				<span className="text-8xl font-bold tabular-nums">{value}</span>

				<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={decrement}
						style={{
							width: 56,
							height: 56,
							borderRadius: "50%",
							border: "1px solid var(--theme-divider)",
							background: "var(--theme-bg-elevated)",
							color: "var(--theme-text-1)",
							fontSize: 28,
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							transition: "background 0.15s",
						}}
						aria-label="Decrement"
					>
						−
					</button>
					<button
						type="button"
						onClick={increment}
						style={{
							width: 56,
							height: 56,
							borderRadius: "50%",
							border: "1px solid var(--theme-divider)",
							background: "var(--theme-bg-elevated)",
							color: "var(--theme-text-1)",
							fontSize: 28,
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							transition: "background 0.15s",
						}}
						aria-label="Increment"
					>
						+
					</button>
				</div>
			</div>

			<p style={{ fontSize: 14, color: "var(--theme-text-3)" }}>
				Synced across all tabs in real-time.
			</p>
		</div>
	)
}
