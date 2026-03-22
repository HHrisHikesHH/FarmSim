import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuthStore } from '../store/useAuthStore.js'
import { router } from './Router.jsx'

export default function App() {
  useEffect(() => {
    let active = true

    const init = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!active) return
        useAuthStore.getState().setSession(session)
        useAuthStore.getState().setUser(session?.user ?? null)
      } catch {
        if (!active) return
        useAuthStore.getState().setSession(null)
        useAuthStore.getState().setUser(null)
      } finally {
        if (active) useAuthStore.getState().setLoading(false)
      }
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      useAuthStore.getState().setSession(session)
      useAuthStore.getState().setUser(session?.user ?? null)
      useAuthStore.getState().setLoading(false)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  return <RouterProvider router={router} />
}
