import { waterLabel } from '../../lib/plotConstants.js'

export function DesktopPlotsList({
  plots,
  selectedId,
  onSelect,
  onNewPlot,
}) {
  return (
    <aside className="hidden h-full w-[240px] shrink-0 flex-col overflow-y-auto border-r border-border bg-card lg:flex">
      <div className="border-b border-border p-3">
        <button
          type="button"
          onClick={onNewPlot}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-terracotta transition hover:bg-straw"
        >
          <span className="text-lg leading-none">+</span> New Plot
        </button>
      </div>
      <ul className="flex-1">
        {plots.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => onSelect(p.id)}
              className={[
                'flex w-full items-center gap-3 border-b border-border px-3 py-3 text-left transition hover:bg-straw',
                selectedId === p.id
                  ? 'border-l-[3px] border-l-terracotta bg-straw'
                  : 'border-l-[3px] border-l-transparent',
              ].join(' ')}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: p.color }}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-sm text-soil">
                  {p.name}
                </div>
                <div className="text-[0.7rem] text-muted">
                  {p.area_acres != null
                    ? `${Number(p.area_acres).toFixed(1)} ac`
                    : '—'}
                </div>
              </div>
              <span className="text-lg" title={waterLabel(p.water_source)}>
                💧
              </span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
