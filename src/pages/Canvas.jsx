import { PageShell } from '../components/layout/PageShell.jsx'

export function Canvas() {
  return (
    <PageShell>
      <h2 className="font-display text-2xl text-farmText">Farm Canvas</h2>
      <p className="mt-2 text-muted">
        Draw your plots here. Coming in Sprint 2.
      </p>
      <div className="mt-6 flex h-64 items-center justify-center rounded-2xl bg-mint/20">
        <span className="text-5xl" aria-hidden>
          🗺️
        </span>
      </div>
    </PageShell>
  )
}
