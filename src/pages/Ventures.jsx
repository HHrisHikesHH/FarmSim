import { PageShell } from '../components/layout/PageShell.jsx'

export function Ventures() {
  return (
    <PageShell>
      <h2 className="font-display text-2xl text-farmText">Ventures</h2>
      <p className="mt-2 text-muted">
        New crops and side projects. Coming soon.
      </p>
      <div className="mt-6 flex h-64 items-center justify-center rounded-2xl bg-ochre/25">
        <span className="text-5xl" aria-hidden>
          🚀
        </span>
      </div>
    </PageShell>
  )
}
