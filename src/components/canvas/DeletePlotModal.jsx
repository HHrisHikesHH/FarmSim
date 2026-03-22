export function DeletePlotModal({ open, plotName, onCancel, onConfirm }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close"
        onClick={onCancel}
      />
      <div
        className="relative z-10 w-full max-w-sm rounded-3xl bg-card p-6 text-center shadow-2xl animate-sheet-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 text-4xl" aria-hidden>
          🗑️
        </div>
        <h2 className="font-display text-[1.2rem] text-soil">
          Delete {plotName}?
        </h2>
        <p className="mt-2 text-[0.85rem] text-muted">
          This will remove the plot and all crop assignments on it. This
          cannot be undone.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex h-12 w-full items-center justify-center rounded-xl border border-border text-sm font-medium text-muted transition hover:bg-straw"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-12 w-full items-center justify-center rounded-xl bg-red-600 text-sm font-semibold text-white transition active:scale-[0.97]"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  )
}
