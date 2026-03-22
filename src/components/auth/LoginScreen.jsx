import { useState } from 'react'
import { supabase } from '../../lib/supabase.js'

function GoogleIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

function Spinner() {
  return (
    <span
      className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-muted border-t-transparent"
      aria-hidden
    />
  )
}

function formatAuthError(err) {
  if (!err) return 'Sign in failed'
  const code = err.code ?? err.error_code
  const msg = err.message ?? String(err)
  if (
    code === 'validation_failed' ||
    /not enabled|Unsupported provider/i.test(msg)
  ) {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : '(your app URL)'
    return (
      'Google sign-in is not enabled in Supabase yet. Open the Supabase dashboard → Authentication → Providers → Google, enable it, and paste your Google OAuth Client ID and Client Secret. Under Authentication → URL Configuration, add ' +
      origin +
      ' to Redirect URLs (use the same origin you use to open this app).'
    )
  }
  return msg
}

export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('signin')
  const [oauthLoading, setOauthLoading] = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const onGoogle = async () => {
    setError('')
    setInfo('')
    setOauthLoading(true)
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo:
            typeof window !== 'undefined'
              ? `${window.location.origin}/`
              : undefined,
        },
      })
      if (err) setError(formatAuthError(err))
    } catch (e) {
      setError(e?.message ?? 'Sign in failed')
    } finally {
      setOauthLoading(false)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setInfo('')
    const trimmed = email.trim()
    if (!trimmed || !password) {
      setError('Enter your email and password.')
      return
    }
    setEmailLoading(true)
    try {
      if (mode === 'signin') {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: trimmed,
          password,
        })
        if (err) setError(err.message)
      } else {
        const { data, error: err } = await supabase.auth.signUp({
          email: trimmed,
          password,
        })
        if (err) {
          setError(err.message)
          return
        }
        if (data.user && !data.session) {
          setInfo('Check your email to confirm your account, then sign in.')
        }
      }
    } catch (e) {
      setError(e?.message ?? 'Something went wrong')
    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-soil px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl bg-card p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <span className="text-3xl" aria-hidden>
              🌾
            </span>
            <span className="font-display text-2xl font-semibold text-ochre">
              FarmSim
            </span>
          </div>
          <p className="text-sm text-muted">
            Plan your farm. Season by season.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <button
            type="button"
            disabled={oauthLoading || emailLoading}
            onClick={onGoogle}
            className="flex min-h-[44px] w-full items-center justify-center gap-3 rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-farmText shadow-sm"
          >
            {oauthLoading ? <Spinner /> : <GoogleIcon />}
            Continue with Google
          </button>

          <form className="flex flex-col gap-3" onSubmit={onSubmit}>
            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-[44px] w-full rounded-xl border border-border bg-straw/50 px-4 py-3 text-farmText placeholder:text-muted"
            />
            <label className="sr-only" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete={
                mode === 'signin' ? 'current-password' : 'new-password'
              }
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-h-[44px] w-full rounded-xl border border-border bg-straw/50 px-4 py-3 text-farmText placeholder:text-muted"
            />
            <button
              type="submit"
              disabled={oauthLoading || emailLoading}
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-terracotta px-4 py-3 text-sm font-semibold text-white"
            >
              {emailLoading ? <Spinner /> : null}
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-muted">
            {mode === 'signin' ? (
              <>
                No account?{' '}
                <button
                  type="button"
                  className="min-h-[44px] font-medium text-terracotta underline"
                  onClick={() => {
                    setMode('signup')
                    setError('')
                    setInfo('')
                  }}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  className="min-h-[44px] font-medium text-terracotta underline"
                  onClick={() => {
                    setMode('signin')
                    setError('')
                    setInfo('')
                  }}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>

        {info ? (
          <p className="mt-4 text-center text-sm text-leaf" role="status">
            {info}
          </p>
        ) : null}
        {error ? (
          <p className="mt-4 text-center text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  )
}
