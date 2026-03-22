export function SimulationControls({ onPrev, onNext, children }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={onPrev}
        className="flex h-11 min-w-[44px] items-center justify-center rounded-lg text-lg text-white"
        aria-label="Previous day"
      >
        ◀
      </button>
      {children}
      <button
        type="button"
        onClick={onNext}
        className="flex h-11 min-w-[44px] items-center justify-center rounded-lg text-lg text-white"
        aria-label="Next day"
      >
        ▶
      </button>
    </div>
  )
}
