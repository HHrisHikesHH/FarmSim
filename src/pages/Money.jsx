import { PageShell } from '../components/layout/PageShell.jsx'

export function Money() {
  return (
    <PageShell>
      <h2 className="font-display text-2xl text-farmText">Money</h2>
      <p className="mt-2 text-muted">
        Costs, income, and loans. Coming soon.
      </p>
      <div className="mt-6 flex h-64 items-center justify-center rounded-2xl bg-wheat/40">
        <span className="text-5xl" aria-hidden>
          💰
        </span>
      </div>
    </PageShell>
  )
}
