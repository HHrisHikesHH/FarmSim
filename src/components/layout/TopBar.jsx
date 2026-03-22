import { useState } from 'react'
import { useFarmStore } from '../../store/useFarmStore.js'
import { useAuthStore } from '../../store/useAuthStore.js'

export function TopBar() {
  const farmName = useFarmStore((s) => s.farmName)
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between bg-soil px-4 md:left-16 md:pl-4 lg:left-[200px] lg:pl-6">
        <h1
          className="font-display text-wheat"
          style={{ fontSize: '1.1rem' }}
        >
          {farmName}
        </h1>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex h-11 min-w-[44px] items-center justify-center rounded-lg text-xl text-white"
            aria-label="Notifications"
          >
            🔔
          </button>
          <button
            type="button"
            className="flex h-11 min-w-[44px] items-center justify-center rounded-lg text-xl text-white"
            aria-label="Profile"
            onClick={() => setSheetOpen(true)}
          >
            👤
          </button>
        </div>
      </header>

      {sheetOpen && (
        <button
          type="button"
          className="fixed inset-0 z-50 bg-black/40"
          aria-label="Close profile"
          onClick={() => setSheetOpen(false)}
        />
      )}
      {sheetOpen && (
        <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl bg-card p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-xl">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
          <p className="mb-1 text-sm text-muted">Signed in as</p>
          <p className="mb-6 break-all text-farmText">
            {user?.email ?? user?.phone ?? ''}
          </p>
          <button
            type="button"
            className="flex min-h-[44px] w-full items-center justify-center rounded-xl bg-terracotta px-4 py-3 text-sm font-semibold text-white"
            onClick={() => {
              setSheetOpen(false)
              signOut()
            }}
          >
            Sign Out
          </button>
        </div>
      )}
    </>
  )
}
