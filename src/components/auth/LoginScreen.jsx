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

function normalizePhone(raw) {
  const digits = raw.replace(/\D/g, '')
  if (raw.trim().startsWith('+')) {
    return `+${digits}`
  }
  if (digits.length === 10) {
    return `+91${digits}`
  }
  if (digits.length >= 10) {
    return `+${digits}`
  }
  return raw.trim()
}

export function LoginScreen() {
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      })
      if (err) setError(err.message)
    } catch (e) {
      setError(e?.message ?? 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const onSendOtp = async () => {
    setError('')
    const normalized = normalizePhone(phone)
    if (!normalized || normalized.length < 8) {
      setError('Enter a valid phone number with country code.')
      return
    }
    setLoading(true)
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        phone: normalized,
      })
      if (err) {
        setError(err.message)
        return
      }
      setOtpSent(true)
    } catch (e) {
      setError(e?.message ?? 'Could not send OTP')
    } finally {
      setLoading(false)
    }
  }

  const onVerifyOtp = async () => {
    setError('')
    const normalized = normalizePhone(phone)
    if (otp.length !== 6) {
      setError('Enter the 6-digit code.')
      return
    }
    setLoading(true)
    try {
      const { error: err } = await supabase.auth.verifyOtp({
        phone: normalized,
        token: otp,
        type: 'sms',
      })
      if (err) setError(err.message)
    } catch (e) {
      setError(e?.message ?? 'Verification failed')
    } finally {
      setLoading(false)
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
            disabled={loading}
            onClick={onGoogle}
            className="flex min-h-[44px] w-full items-center justify-center gap-3 rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-farmText shadow-sm"
          >
            {loading ? <Spinner /> : <GoogleIcon />}
            Continue with Google
          </button>

          <div className="flex flex-col gap-3">
            <label className="sr-only" htmlFor="phone">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="min-h-[44px] w-full rounded-xl border border-border bg-straw/50 px-4 py-3 text-farmText placeholder:text-muted"
            />
            {!otpSent ? (
              <button
                type="button"
                disabled={loading}
                onClick={onSendOtp}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-terracotta px-4 py-3 text-sm font-semibold text-white"
              >
                {loading ? <Spinner /> : null}
                Send OTP
              </button>
            ) : (
              <>
                <label className="sr-only" htmlFor="otp">
                  One-time password
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  className="min-h-[44px] w-full rounded-xl border border-border bg-straw/50 px-4 py-3 text-center text-lg tracking-widest text-farmText placeholder:text-muted"
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={onVerifyOtp}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-terracotta px-4 py-3 text-sm font-semibold text-white"
                >
                  {loading ? <Spinner /> : null}
                  Verify
                </button>
              </>
            )}
          </div>
        </div>

        {error ? (
          <p className="mt-4 text-center text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  )
}
