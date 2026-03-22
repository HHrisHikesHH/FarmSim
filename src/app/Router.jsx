/* eslint-disable react-refresh/only-export-components -- router config exports `router` plus route elements */
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'
import { LoginScreen } from '../components/auth/LoginScreen.jsx'
import { BottomNav } from '../components/layout/BottomNav.jsx'
import { TopBar } from '../components/layout/TopBar.jsx'
import { Canvas } from '../pages/Canvas.jsx'
import { Livestock } from '../pages/Livestock.jsx'
import { Money } from '../pages/Money.jsx'
import { Tasks } from '../pages/Tasks.jsx'
import { Timeline } from '../pages/Timeline.jsx'
import { Ventures } from '../pages/Ventures.jsx'
import { SimulationBar } from '../simulation/SimulationBar.jsx'
import { SimulationDrawer } from '../simulation/SimulationDrawer.jsx'
import { useAuthStore } from '../store/useAuthStore.js'
import { useSimStore } from '../store/useSimStore.js'

function FullScreenLoader() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-soil">
      <span className="animate-farm-pulse text-5xl text-white" aria-hidden>
        🌾
      </span>
      <p className="mt-4 text-sm text-wheat">Loading...</p>
    </div>
  )
}

function LoginRoute() {
  const session = useAuthStore((s) => s.session)
  const loading = useAuthStore((s) => s.loading)
  if (loading) return <FullScreenLoader />
  if (session) return <Navigate to="/canvas" replace />
  return <LoginScreen />
}

function ProtectedLayout() {
  const session = useAuthStore((s) => s.session)
  const loading = useAuthStore((s) => s.loading)
  if (loading) return <FullScreenLoader />
  if (!session) return <Navigate to="/login" replace />
  return <ModeShell />
}

function ModeShell() {
  const isSimulating = useSimStore((s) => s.isSimulating)
  if (isSimulating) return <SimulationShell />
  return <PlanningShell />
}

function PlanningShell() {
  const location = useLocation()
  return (
    <div className="min-h-dvh bg-farmBg">
      <TopBar />
      <main className="pt-14 transition-opacity duration-200 md:pl-16 lg:pl-[200px]">
        <div key={location.pathname} className="animate-page-fade">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

function SimulationShell() {
  const isDrawerOpen = useSimStore((s) => s.isDrawerOpen)
  return (
    <div className="min-h-dvh bg-farmBg">
      <SimulationBar />
      <div
        className={[
          'transition-[padding-bottom] duration-300 ease-in-out',
          isDrawerOpen ? 'pb-[45vh]' : 'pb-12',
        ].join(' ')}
      >
        <div className="flex h-[52vh] min-h-[200px] items-center justify-center bg-mint/15 pt-14">
          <span className="text-lg text-muted">MapView</span>
        </div>
        <div className="flex h-[20vh] min-h-[120px] items-center justify-center bg-sky/15">
          <span className="text-lg text-muted">TimelineStrip</span>
        </div>
      </div>
      <SimulationDrawer />
    </div>
  )
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginRoute />,
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <Navigate to="canvas" replace /> },
      { path: 'canvas', element: <Canvas /> },
      { path: 'timeline', element: <Timeline /> },
      { path: 'ventures', element: <Ventures /> },
      { path: 'livestock', element: <Livestock /> },
      { path: 'money', element: <Money /> },
      { path: 'tasks', element: <Tasks /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/canvas" replace />,
  },
])
