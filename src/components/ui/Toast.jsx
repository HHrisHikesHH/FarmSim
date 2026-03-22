/* eslint-disable react-refresh/only-export-components -- hook + provider */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const hide = useCallback(() => setToast(null), [])

  const show = useCallback((opts) => {
    const { message, type = 'info' } =
      typeof opts === 'string' ? { message: opts } : opts
    setToast({ message, type, id: Date.now() })
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [])

  const value = useMemo(() => ({ show, hide }), [show, hide])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed bottom-24 left-1/2 z-[100] w-[min(100%-2rem,420px)] -translate-x-1/2 md:bottom-8"
        aria-live="polite"
      >
        {toast ? (
          <div
            key={toast.id}
            className={[
              'pointer-events-auto animate-toast-in rounded-2xl px-4 py-3 text-center text-sm font-medium text-white shadow-lg',
              toast.type === 'success' && 'bg-leaf',
              toast.type === 'error' && 'bg-red-600',
              toast.type === 'info' && 'bg-sky',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {toast.message}
          </div>
        ) : null}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return ctx
}
