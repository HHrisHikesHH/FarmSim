import { PageShell } from '../components/layout/PageShell.jsx'

export function Tasks() {
  return (
    <PageShell>
      <h2 className="font-display text-2xl text-farmText">Tasks</h2>
      <p className="mt-2 text-muted">
        Field work and reminders. Coming soon.
      </p>
      <div className="mt-6 flex h-64 items-center justify-center rounded-2xl bg-leaf/15">
        <span className="text-5xl" aria-hidden>
          ✅
        </span>
      </div>
    </PageShell>
  )
}
