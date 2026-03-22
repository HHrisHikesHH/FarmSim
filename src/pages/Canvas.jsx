/*
 * Supabase schema (run in SQL editor):
 *
 * create table farms (
 *   id uuid primary key default gen_random_uuid(),
 *   user_id uuid references auth.users(id) on delete cascade,
 *   name text not null,
 *   location_name text,
 *   total_area_acres numeric(6,2) default 0,
 *   primary_water_source text check (primary_water_source in (
 *     'dam','borewell','rainfed','canal','pond','mixed'
 *   )),
 *   created_at timestamptz default now()
 * );
 * alter table farms enable row level security;
 * create policy "Users manage own farms"
 *   on farms for all using (auth.uid() = user_id);
 *
 * create table plots (
 *   id uuid primary key default gen_random_uuid(),
 *   farm_id uuid references farms(id) on delete cascade,
 *   name text not null,
 *   area_acres numeric(6,2),
 *   soil_type text check (soil_type in (
 *     'black_cotton','red_laterite','alluvial',
 *     'sandy_loam','clay_loam','mixed'
 *   )),
 *   water_source text check (water_source in (
 *     'dam','borewell','rainfed','canal','pond','mixed'
 *   )),
 *   geometry jsonb not null,
 *   color text not null default '#3A6B35',
 *   notes text,
 *   created_at timestamptz default now()
 * );
 * alter table plots enable row level security;
 * create policy "Users manage own plots"
 *   on plots for all
 *   using (farm_id in (
 *     select id from farms where user_id = auth.uid()
 *   ));
 */

import { useEffect, useState } from 'react'
import { FarmMapView } from '../components/canvas/FarmMapView.jsx'
import { OnboardingModal } from '../components/onboarding/OnboardingModal.jsx'
import { useToast } from '../components/ui/Toast.jsx'
import { supabase } from '../lib/supabase.js'
import { useAuthStore } from '../store/useAuthStore.js'
import { useFarmStore } from '../store/useFarmStore.js'

export function Canvas() {
  const user = useAuthStore((s) => s.user)
  const toast = useToast()
  const isLoadingPlots = useFarmStore((s) => s.isLoadingPlots)
  const setFarmId = useFarmStore((s) => s.setFarmId)
  const setFarmName = useFarmStore((s) => s.setFarmName)
  const setTotalAcres = useFarmStore((s) => s.setTotalAcres)
  const setPlots = useFarmStore((s) => s.setPlots)
  const setLoadingPlots = useFarmStore((s) => s.setLoadingPlots)
  const setOnboarded = useFarmStore((s) => s.setOnboarded)

  const [loading, setLoading] = useState(true)
  const [farmRow, setFarmRow] = useState(null)
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (!user?.id) return

    let cancelled = false

    const run = async () => {
      setLoadingPlots(true)
      try {
        const { data: farm, error: fe } = await supabase
          .from('farms')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle()

        if (fe) throw fe
        if (cancelled) return

        if (!farm) {
          setShowOnboarding(true)
          setFarmRow(null)
          setLoading(false)
          setLoadingPlots(false)
          return
        }

        setShowOnboarding(false)
        setFarmRow(farm)
        setFarmId(farm.id)
        setFarmName(farm.name)
        setTotalAcres(Number(farm.total_area_acres) || 0)
        setOnboarded(true)

        const { data: plotRows, error: pe } = await supabase
          .from('plots')
          .select('*')
          .eq('farm_id', farm.id)
          .order('created_at', { ascending: true })

        if (pe) throw pe
        if (cancelled) return
        setPlots(plotRows ?? [])
      } catch (e) {
        if (!cancelled) {
          toast.show({
            message: e?.message ?? 'Could not load plots. Check connection.',
            type: 'error',
          })
        }
      } finally {
        if (!cancelled) {
          setLoadingPlots(false)
          setLoading(false)
        }
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [
    user?.id,
    setFarmId,
    setFarmName,
    setTotalAcres,
    setPlots,
    setLoadingPlots,
    setOnboarded,
    toast,
  ])

  const handleOnboardingDone = async (farm) => {
    setFarmRow(farm)
    setShowOnboarding(false)
    setFarmId(farm.id)
    setFarmName(farm.name)
    setTotalAcres(Number(farm.total_area_acres) || 0)
    setOnboarded(true)
    toast.show({
      message: 'Farm created! Now draw your first plot.',
      type: 'success',
    })
    setLoadingPlots(true)
    try {
      const { data: plotRows, error } = await supabase
        .from('plots')
        .select('*')
        .eq('farm_id', farm.id)
        .order('created_at', { ascending: true })
      if (error) throw error
      setPlots(plotRows ?? [])
    } catch (e) {
      toast.show({ message: e?.message ?? 'Could not load plots.', type: 'error' })
    } finally {
      setLoadingPlots(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 top-14 z-[20] flex items-center justify-center bg-straw md:left-16 lg:left-[200px]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-pulse rounded-full bg-terracotta/25" />
          <p className="font-display text-soil">Loading your farm...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-x-0 bottom-16 top-14 z-[20] flex flex-col bg-straw md:bottom-0 md:left-16 lg:left-[200px]">
      {showOnboarding && user?.id ? (
        <OnboardingModal userId={user.id} onComplete={handleOnboardingDone} />
      ) : null}

      {farmRow ? (
        <>
          <FarmMapView farm={farmRow} />
          {isLoadingPlots ? (
            <div className="pointer-events-none absolute inset-0 z-[30] flex items-center justify-center bg-straw/85">
              <p className="font-display text-soil">Loading your farm...</p>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
