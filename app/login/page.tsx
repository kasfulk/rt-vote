'use client'
import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'
import { setVoterSession } from '@/app/lib/cookies'

export default function LoginPage() {
  const router = useRouter()
  const [noKk, setNoKk] = useState('')
  const [noRumah, setNoRumah] = useState('')
  const [blok, setBlok] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ no_kk: noKk, nomor_rumah: noRumah, blok }),
    })
    const result = await res.json()

    if (result.status === 'ok') {
      // Save voter session to cookie
      setVoterSession({
        warga_id: result.warga_id,
        no_kk: result.no_kk,
        nama_kepala: result.nama,
        nomor_rumah: result.nomor_rumah,
        blok: result.blok
      })
      router.push('/vote')
    } else {
      setError(result.message)
    }
    setIsLoading(false)
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <LoginForm
          noKk={noKk}
          noRumah={noRumah}
          blok={blok}
          isLoading={isLoading}
          error={error}
          onNoKkChange={setNoKk}
          onNoRumahChange={setNoRumah}
          onBlokChange={setBlok}
          onSubmit={handleLogin}
        />
      </div>
    </div>
  )
}