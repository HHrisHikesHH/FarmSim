import { useSimStore } from '../store/useSimStore.js'

export function SimulationDrawer() {
  const isDrawerOpen = useSimStore((s) => s.isDrawerOpen)
  const toggleDrawer = useSimStore((s) => s.toggleDrawer)

  return (
    <div
      className={[
        'fixed bottom-0 left-0 right-0 z-40 flex flex-col border-t-2 border-border bg-card transition-[height] duration-300 ease-in-out',
        isDrawerOpen ? 'h-[45vh]' : 'h-12 overflow-hidden',
      ].join(' ')}
    >
      {!isDrawerOpen ? (
        <button
          type="button"
          className="relative flex h-12 w-full flex-col items-center justify-center gap-0.5 px-2"
          onClick={toggleDrawer}
        >
          <span className="h-1 w-10 shrink-0 rounded-full bg-border" />
          <div className="flex w-full max-w-md items-center justify-between gap-1 text-[0.65rem] leading-tight sm:justify-center sm:gap-2">
            <span className="rounded-full bg-straw px-2 py-0.5 text-farmText">
              💧 <span className="text-[0.6rem] text-muted">Water</span>{' '}
              <span className="text-muted">—</span>
            </span>
            <span className="rounded-full bg-straw px-2 py-0.5 text-farmText">
              💰 <span className="text-[0.6rem] text-muted">Cash</span>{' '}
              <span className="text-muted">—</span>
            </span>
            <span className="rounded-full bg-straw px-2 py-0.5 text-farmText">
              🌾 <span className="text-[0.6rem] text-muted">Yield</span>{' '}
              <span className="text-muted">—</span>
            </span>
          </div>
        </button>
      ) : (
        <>
          <button
            type="button"
            className="flex w-full shrink-0 flex-col items-center pt-2"
            onClick={toggleDrawer}
            aria-expanded
          >
            <span className="mb-2 h-1.5 w-10 rounded-full bg-border" />
          </button>
          <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-6 pt-1">
            <section>
              <h3 className="mb-2 flex items-center gap-2 font-display text-farmText">
                💧 Water Budget
              </h3>
              {['Dam', 'Borewell', 'Rainfall'].map((label) => (
                <div
                  key={label}
                  className="mb-3 flex items-center gap-3 text-sm"
                >
                  <span className="w-24 text-muted">{label}</span>
                  <div className="h-2 flex-1 rounded-full bg-border" />
                  <span className="w-10 text-right text-muted">—%</span>
                </div>
              ))}
            </section>
            <section>
              <h3 className="mb-2 flex items-center gap-2 font-display text-farmText">
                💰 Cashflow
              </h3>
              <p className="text-sm text-farmText">
                Spent: ₹— | Earned: ₹— | Balance: ₹—
              </p>
            </section>
            <section>
              <h3 className="mb-2 flex items-center gap-2 font-display text-farmText">
                🌾 Yield Forecast
              </h3>
              <p className="text-sm text-muted">No crops assigned yet.</p>
            </section>
          </div>
        </>
      )}
    </div>
  )
}
