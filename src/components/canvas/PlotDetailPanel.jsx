import { soilLabel, waterLabel } from '../../lib/plotConstants.js'

function formatDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function PlotDetailPanel({
  plot,
  open,
  onClose,
  onEdit,
  onDelete,
  mobile,
}) {
  if (!plot || !open) return null

  const headerBg = { backgroundColor: `${plot.color}1F` }

  const body = (
    <>
      <header className="px-6 pb-4 pt-6" style={headerBg}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2">
            <span
              className="mt-1 h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: plot.color }}
            />
            <div>
              <h2 className="font-display text-[1.3rem] text-soil">
                {plot.name}
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="rounded-full bg-straw px-2 py-0.5 text-[0.65rem] text-muted">
                  💧 {waterLabel(plot.water_source)}
                </span>
                <span className="rounded-full bg-straw px-2 py-0.5 text-[0.65rem] text-muted">
                  🌱 {soilLabel(plot.soil_type)}
                </span>
              </div>
            </div>
          </div>
          <span className="shrink-0 rounded-full bg-straw px-3 py-1 font-display text-sm text-clay">
            {plot.area_acres != null ? Number(plot.area_acres).toFixed(1) : '—'}{' '}
            ac
          </span>
        </div>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto px-6 py-5">
        <section>
          <h3 className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[1px] text-terracotta">
            This Season
          </h3>
          <div className="rounded-xl border border-dashed border-terracotta/40 bg-straw px-4 py-6 text-center">
            <p className="text-sm text-terracotta">No crops assigned yet</p>
            <button
              type="button"
              className="mt-3 text-sm font-medium text-terracotta underline"
              disabled
            >
              + Assign Crop
            </button>
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[1px] text-terracotta">
            Plot Details
          </h3>
          <div className="divide-y divide-border text-sm">
            <div className="flex justify-between py-2">
              <span className="text-muted">📐 Area</span>
              <span className="font-display text-soil">
                {plot.area_acres != null
                  ? `${Number(plot.area_acres).toFixed(2)} acres`
                  : '—'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted">💧 Water Source</span>
              <span className="text-farmText">{waterLabel(plot.water_source)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted">🌱 Soil Type</span>
              <span className="text-farmText">{soilLabel(plot.soil_type)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted">📅 Added</span>
              <span className="text-farmText">{formatDate(plot.created_at)}</span>
            </div>
          </div>
        </section>

        {plot.notes ? (
          <section>
            <h3 className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[1px] text-terracotta">
              Notes
            </h3>
            <p className="rounded-xl bg-straw p-3 text-[0.85rem] italic text-muted">
              {plot.notes}
            </p>
          </section>
        ) : null}
      </div>

      <div className="sticky bottom-0 flex gap-3 border-t border-border bg-card px-6 py-4">
        <button
          type="button"
          onClick={onEdit}
          className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border-2 border-clay text-sm font-medium text-clay transition hover:bg-straw active:scale-[0.97]"
        >
          ✏️ Edit Plot
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl border-2 border-red-500 text-sm font-medium text-red-600 transition hover:bg-red-50 active:scale-[0.97]"
        >
          🗑️ Delete Plot
        </button>
      </div>
    </>
  )

  if (mobile) {
    return (
      <div className="fixed inset-0 z-[85] flex items-end bg-black/40 backdrop-blur-[4px]">
        <button
          type="button"
          className="absolute inset-0"
          aria-label="Close panel"
          onClick={onClose}
        />
        <div
          className="relative z-10 flex max-h-[65dvh] w-full flex-col rounded-t-3xl bg-card shadow-2xl animate-sheet-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center pt-3">
            <span className="h-1 w-10 rounded-full bg-border" />
          </div>
          {body}
        </div>
      </div>
    )
  }

  return (
    <aside className="fixed right-0 top-14 z-[85] flex h-[calc(100dvh-56px)] w-[360px] flex-col border-l border-border bg-card shadow-xl animate-sheet-in md:top-14 md:h-[calc(100dvh-56px)] lg:top-14">
      <button
        type="button"
        className="absolute right-3 top-3 z-10 rounded-lg px-2 py-1 text-sm text-muted hover:bg-straw"
        onClick={onClose}
      >
        ✕
      </button>
      {body}
    </aside>
  )
}
