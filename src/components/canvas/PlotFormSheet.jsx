import { useEffect, useRef, useState } from 'react'
import { SOIL_OPTIONS, WATER_OPTIONS } from '../../lib/plotConstants.js'

const initial = {
  name: '',
  area_acres: '',
  soil_type: 'black_cotton',
  water_source: 'rainfed',
  notes: '',
}

export function PlotFormSheet({
  open,
  onClose,
  onSave,
  calculatedAcres,
  initialValues,
  showRedraw,
  onRedraw,
  offline,
  nameError,
  onClearNameError,
}) {
  const [values, setValues] = useState(initial)
  const nameRef = useRef(null)

  useEffect(() => {
    if (!open) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset form when sheet opens
    setValues({
      ...initial,
      ...initialValues,
      area_acres:
        initialValues?.area_acres != null
          ? String(initialValues.area_acres)
          : '',
    })
    const t = requestAnimationFrame(() => nameRef.current?.focus())
    return () => cancelAnimationFrame(t)
  }, [open, initialValues])

  if (!open) return null

  const applyCalc = () => {
    if (calculatedAcres != null && !Number.isNaN(calculatedAcres)) {
      setValues((v) => ({
        ...v,
        area_acres: calculatedAcres.toFixed(2),
      }))
    }
  }

  const isDesktop =
    typeof window !== 'undefined' && window.innerWidth >= 768

  const inner = (
    <>
      {showRedraw ? (
        <button
          type="button"
          className="mb-4 w-full rounded-xl border-2 border-terracotta py-2 text-sm font-medium text-terracotta transition hover:bg-straw"
          onClick={onRedraw}
        >
          Redraw Polygon
        </button>
      ) : null}
      <h2 className="font-display text-[1.3rem] text-soil">
        {initialValues?.id ? 'Edit Plot' : 'New Plot'}
      </h2>

      <div className="mt-4">
        <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-wide text-terracotta">
          Plot Name
        </label>
        <input
          ref={nameRef}
          value={values.name}
          onChange={(e) => {
            onClearNameError?.()
            setValues((v) => ({ ...v, name: e.target.value }))
          }}
          placeholder="e.g. Rajol, North Field"
          className={[
            'input-focus-glow h-[52px] w-full rounded-xl border-[1.5px] px-4 text-base text-farmText placeholder:text-muted',
            nameError ? 'animate-shake border-red-500' : 'border-border',
          ].join(' ')}
        />
        {nameError ? (
          <p className="mt-1 text-xs text-red-600">Plot needs a name</p>
        ) : null}
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-wide text-terracotta">
          Area (acres)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={values.area_acres}
          onChange={(e) =>
            setValues((v) => ({ ...v, area_acres: e.target.value }))
          }
          placeholder="e.g. 4.5"
          className="input-focus-glow h-[52px] w-full rounded-xl border-[1.5px] border-border px-4 text-base text-farmText placeholder:text-muted"
        />
        <p className="mt-1 text-xs text-muted">
          Estimated from drawing is shown below.
        </p>
        {calculatedAcres != null ? (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted">
              Drawn area: ~
              <span className="font-display text-soil">
                {calculatedAcres.toFixed(1)}
              </span>{' '}
              acres
            </span>
            <button
              type="button"
              className="text-sm font-medium text-terracotta underline"
              onClick={applyCalc}
            >
              Use calculated
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-wide text-terracotta">
          Soil Type
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {SOIL_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setValues((v) => ({ ...v, soil_type: o.value }))}
              className={[
                'shrink-0 rounded-full border px-3 py-2 text-xs transition',
                values.soil_type === o.value
                  ? 'border-terracotta bg-terracotta text-white'
                  : 'border-border bg-straw text-muted',
              ].join(' ')}
            >
              {o.icon} {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <span className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-wide text-terracotta">
          Water Source
        </span>
        <div className="flex flex-wrap gap-2">
          {WATER_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() =>
                setValues((v) => ({ ...v, water_source: o.value }))
              }
              className={[
                'rounded-full border px-3 py-2 text-xs transition',
                values.water_source === o.value
                  ? 'border-terracotta bg-terracotta text-white'
                  : 'border-border bg-straw text-muted',
              ].join(' ')}
            >
              {o.icon} {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-wide text-terracotta">
          Notes (optional)
        </label>
        <textarea
          rows={3}
          value={values.notes}
          onChange={(e) =>
            setValues((v) => ({ ...v, notes: e.target.value }))
          }
          placeholder="Any notes about this plot — access, slope, soil issues..."
          className="input-focus-glow w-full rounded-xl border-[1.5px] border-border px-3 py-2 text-[0.85rem] text-farmText placeholder:text-muted"
        />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          disabled={offline}
          onClick={() => onSave(values)}
          className="flex h-[52px] w-full items-center justify-center rounded-xl bg-terracotta text-sm font-semibold text-white transition hover:brightness-[0.95] active:scale-[0.97] disabled:opacity-50"
        >
          Save Plot
        </button>
        <button
          type="button"
          onClick={onClose}
          className="text-center text-sm text-muted transition hover:text-farmText"
        >
          Cancel
        </button>
      </div>
    </>
  )

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/50 backdrop-blur-sm md:items-center md:p-6">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className={[
          'relative z-10 max-h-[92dvh] w-full overflow-y-auto bg-card shadow-2xl animate-sheet-in',
          isDesktop
            ? 'max-w-lg rounded-3xl p-6'
            : 'rounded-t-3xl px-5 pb-8 pt-3',
        ].join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {!isDesktop ? (
          <div className="mb-3 flex justify-center">
            <span className="h-1 w-9 rounded-full bg-border" />
          </div>
        ) : null}
        {inner}
      </div>
    </div>
  )
}
