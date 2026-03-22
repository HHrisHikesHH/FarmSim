import { PageShell } from '../components/layout/PageShell.jsx'

export function Timeline() {
  return (
    <PageShell>
      <h2 className="font-display text-2xl text-farmText">
        Simulation Timeline
      </h2>
      <p className="mt-2 text-muted">
        Crop timelines and scrubber. Coming soon.
      </p>
      <div className="mt-6 flex h-64 items-center justify-center rounded-2xl bg-sky/20">
        <span className="text-5xl" aria-hidden>
          📅
        </span>
      </div>
    </PageShell>
  )
}
