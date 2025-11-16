'use client'
import { useState, useEffect, FormEvent } from 'react'
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
  const [blokList, setBlokList] = useState<string[]>([])
  const [nomorRumahList, setNomorRumahList] = useState<string[]>([])
  const [isLoadingBlok, setIsLoadingBlok] = useState(true)
  const [isLoadingNomorRumah, setIsLoadingNomorRumah] = useState(false)

  // Fetch blok list on component mount
  useEffect(() => {
    fetchBlokList()
  }, [])

  // Fetch nomor rumah when blok changes
  useEffect(() => {
    if (blok) {
      fetchNomorRumahList(blok)
    } else {
      setNomorRumahList([])
      setNoRumah('')
    }
  }, [blok])

  async function fetchBlokList() {
    try {
      setIsLoadingBlok(true)
      const res = await fetch('/api/blok')
      const data = await res.json()
      
      if (res.ok) {
        setBlokList(data)
      } else {
        setError('Gagal memuat daftar blok')
      }
    } catch {
      setError('Gagal memuat daftar blok')
    } finally {
      setIsLoadingBlok(false)
    }
  }

  async function fetchNomorRumahList(selectedBlok: string) {
    try {
      setIsLoadingNomorRumah(true)
      const res = await fetch(`/api/nomor-rumah?blok=${encodeURIComponent(selectedBlok)}`)
      const data = await res.json()
      
      if (res.ok) {
        setNomorRumahList(data)
      } else {
        setError('Gagal memuat daftar nomor rumah')
      }
    } catch {
      setError('Gagal memuat daftar nomor rumah')
    } finally {
      setIsLoadingNomorRumah(false)
    }
  }

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
          blokList={blokList}
          nomorRumahList={nomorRumahList}
          isLoadingBlok={isLoadingBlok}
          isLoadingNomorRumah={isLoadingNomorRumah}
          onNoKkChange={setNoKk}
          onNoRumahChange={setNoRumah}
          onBlokChange={setBlok}
          onSubmit={handleLogin}
        />
      </div>
    </div>
  )
}