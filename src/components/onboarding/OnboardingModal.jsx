import { useState } from 'react'
import { supabase } from '../../lib/supabase.js'
import { useFarmStore } from '../../store/useFarmStore.js'

const WATER_SELECT = [
  { value: 'rainfed', label: 'Rainfed' },
  { value: 'dam', label: 'Dam / Tank' },
  { value: 'borewell', label: 'Borewell' },
  { value: 'canal', label: 'Canal' },
  { value: 'mixed', label: 'Mixed' },
]

export function OnboardingModal({ userId, onComplete }) {
  const [step, setStep] = useState(1)
  const [exiting, setExiting] = useState(false)
  const [farmName, setFarmName] = useState('')
  const [locationName, setLocationName] = useState('')
  const [totalAcres, setTotalAcres] = useState('')
  const [water, setWater] = useState('rainfed')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const setFarmId = useFarmStore((s) => s.setFarmId)
  const setStoreName = useFarmStore((s) => s.setFarmName)
  const setStoreAcres = useFarmStore((s) => s.setTotalAcres)
  const setOnboarded = useFarmStore((s) => s.setOnboarded)

  const finish = async () => {
    setError('')
    const acres = parseFloat(totalAcres, 10)
    if (!farmName.trim()) {
      setError('Please name your farm.')
      return
    }
    if (Number.isNaN(acres) || acres <= 0) {
      setError('Enter a positive acreage estimate.')
      return
    }
    setSubmitting(true)
    try {
      const row = {
        user_id: userId,
        name: farmName.trim(),
        location_name: locationName.trim() || null,
        total_area_acres: acres,
        primary_water_source: water,
      }
      let { data, error: insErr } = await supabase
        .from('farms')
        .insert(row)
        .select()
        .single()
      if (
        insErr &&
        /primary_water_source|column/i.test(insErr.message ?? '')
      ) {
        const { name, location_name, total_area_acres, user_id } = row
        const retry = await supabase
          .from('farms')
          .insert({
            user_id,
            name,
            location_name,
            total_area_acres,
          })
          .select()
          .single()
        data = retry.data
        insErr = retry.error
      }
      if (insErr) throw insErr
      setFarmId(data.id)
      setStoreName(data.name)
      setStoreAcres(Number(data.total_area_acres) || acres)
      setOnboarded(true)
      setExiting(true)
      window.setTimeout(() => {
        onComplete?.(data)
      }, 320)
    } catch (e) {
      setError(e?.message ?? 'Could not save farm.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className={[
        'fixed inset-0 z-[80] flex items-center justify-center bg-soil/96 px-4 backdrop-blur-sm',
        exiting ? 'animate-[fade_0.3s_ease-in_reverse]' : '',
      ].join(' ')}
    >
      <div
        className={[
          'w-full max-w-[440px] rounded-3xl bg-card p-10 shadow-2xl',
          exiting ? 'animate-sheet-out' : 'animate-onboard-in',
        ].join(' ')}
      >
        <div className="mb-8 text-center">
          <div className="mb-3 text-[3rem] leading-none" aria-hidden>
            🌾
          </div>
          <h1 className="font-display text-[1.8rem] text-soil">
            Welcome to FarmSim
          </h1>
          <p className="mt-2 text-[0.9rem] text-muted" style={{ marginBottom: 32 }}>
            Let&apos;s start with the basics about your farm.
          </p>
        </div>

        {step === 1 ? (
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-terracotta">
                What&apos;s your farm called?
              </label>
              <input
                className="input-focus-glow h-[52px] w-full rounded-xl border-[1.5px] border-border px-4 text-base text-farmText placeholder:text-muted"
                placeholder="e.g. Rajol Farm, Kalaburagi"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-terracotta">
                Where is it located?
              </label>
              <input
                className="input-focus-glow h-[52px] w-full rounded-xl border-[1.5px] border-border px-4 text-base text-farmText placeholder:text-muted"
                placeholder="e.g. Aland, Kalaburagi, Karnataka"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
              />
            </div>
            <button
              type="button"
              disabled={submitting}
              onClick={() => setStep(2)}
              className="mt-2 flex h-[52px] w-full items-center justify-center rounded-xl bg-terracotta text-base font-semibold text-white transition hover:brightness-[0.92] active:scale-[0.98]"
            >
              Next →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-terracotta">
                Approximately how many acres total?
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="input-focus-glow h-[52px] w-full rounded-xl border-[1.5px] border-border px-4 text-base text-farmText placeholder:text-muted"
                placeholder="e.g. 12"
                value={totalAcres}
                onChange={(e) => setTotalAcres(e.target.value)}
              />
              <p className="mt-1 text-[0.8rem] text-muted">
                You can adjust this anytime. Even an estimate is fine.
              </p>
            </div>
            <div>
              <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-terracotta">
                Primary water source on most of your land?
              </label>
              <div className="relative">
                <select
                  className="input-focus-glow h-[52px] w-full appearance-none rounded-xl border-[1.5px] border-border bg-white px-4 pr-10 text-base text-farmText"
                  value={water}
                  onChange={(e) => setWater(e.target.value)}
                >
                  {WATER_SELECT.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-soil">
                  ▾
                </span>
              </div>
            </div>
            {error ? (
              <p className="text-center text-sm text-red-600">{error}</p>
            ) : null}
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                className="min-h-[44px] flex-1 text-sm text-muted transition hover:text-farmText"
                onClick={() => setStep(1)}
              >
                ← Back
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={finish}
                className="flex h-[52px] min-w-0 flex-[2] items-center justify-center rounded-xl bg-terracotta text-sm font-semibold text-white transition hover:brightness-[0.92] active:scale-[0.98] sm:text-base"
              >
                {submitting ? 'Saving…' : 'Set Up My Farm →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
