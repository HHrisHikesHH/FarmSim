import { useSimStore } from '../store/useSimStore.js'
import { SimulationControls } from './SimulationControls.jsx'

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function formatSimDate(ts) {
  const d = new Date(ts)
  const day = d.getUTCDate()
  const mon = MONTHS[d.getUTCMonth()]
  const yearNum = d.getUTCFullYear() - 2024 + 1
  return `${day} ${mon}, Year ${yearNum}`
}

export function SimulationBar() {
  const simDate = useSimStore((s) => s.simDate)
  const setSimDate = useSimStore((s) => s.setSimDate)
  const stopSimulation = useSimStore((s) => s.stopSimulation)

  const shift = (delta) => {
    if (simDate == null) return
    setSimDate((prev) => {
      const base = prev ?? simDate
      const d = new Date(base)
      d.setUTCDate(d.getUTCDate() + delta)
      return d.getTime()
    })
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between gap-2 bg-soil px-3">
      <div className="min-w-0 flex-1 flex justify-center">
        <SimulationControls
          onPrev={() => shift(-1)}
          onNext={() => shift(1)}
        >
          <p className="min-w-0 text-center font-display text-sm text-wheat sm:px-2 sm:text-base">
            {simDate != null ? formatSimDate(simDate) : '—'}
          </p>
        </SimulationControls>
      </div>
      <button
        type="button"
        onClick={stopSimulation}
        className="flex h-11 min-w-[44px] shrink-0 items-center justify-center rounded-lg text-sm text-white"
      >
        ✕ Exit
      </button>
    </header>
  )
}
