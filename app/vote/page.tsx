'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { getVoterSession, removeVoterSession } from '@/app/lib/cookies'

interface Calon {
  id: number
  display: string
}

interface VoterSession {
  warga_id: number
  no_kk: string
  nama_kepala: string
  nomor_rumah: string
  blok: string
}

export default function VotePage() {
  const router = useRouter()
  const [voterSession, setVoterSession] = useState<VoterSession | null>(null)
  const [calon, setCalon] = useState<Calon[]>([])
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [selectedName, setSelectedName] = useState("")
  const [selectedCalonId, setSelectedCalonId] = useState<number | null>(null)

  useEffect(() => {
    // Check authentication
    const session = getVoterSession()
    if (!session) {
      router.push('/login')
      return
    }
    setVoterSession(session)

    async function fetchCalon() {
      const res = await fetch(`/api/calon?q=${searchQuery}`)
      const data = await res.json()
      setCalon(data)
    }
    fetchCalon()
  }, [searchQuery, router])

  async function handleVote() {
    if (!voterSession || !selectedCalonId) return

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pemilih_id: voterSession.warga_id,
          calon_id: selectedCalonId
        })
      })

      const result = await res.json()
      
      if (result.status === 'ok') {
        // Clear session and redirect to success page
        removeVoterSession()
        router.push('/success')
      } else {
        alert(result.message || 'Terjadi kesalahan saat memproses vote')
      }
    } catch {
      alert('Terjadi kesalahan saat memproses vote')
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-sm">
        {voterSession && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Selamat datang:</strong> {voterSession.nama_kepala}
            </p>
            <p className="text-xs text-blue-600">
              No KK: {voterSession.no_kk} | Rumah: {voterSession.nomor_rumah} / {voterSession.blok}
            </p>
          </div>
        )}
        <h1 className="text-2xl font-bold text-center mb-6">Pilih Calon RT</h1>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {value
                ? calon.find((c) => c.display.toLowerCase() === value)?.display
                : "Cari dan pilih calon..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput 
                placeholder="Ketik untuk mencari..."
                onValueChange={(search) => setSearchQuery(search)}
              />
              <CommandList>
                <CommandEmpty>Calon tidak ditemukan.</CommandEmpty>
                <CommandGroup>
                  {calon.map((c) => (
                    <CommandItem
                      key={c.id}
                      value={c.display.toLowerCase()}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue)
                        setSelectedName(currentValue === value ? "" : c.display)
                        setSelectedCalonId(currentValue === value ? null : c.id)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === c.display.toLowerCase() ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {c.display}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {selectedName && (
          <div className="mt-4 text-center">
            <p className="text-lg">Anda telah memilih:</p>
            <p className="text-xl font-bold">{selectedName}</p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="mt-4">Vote</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Pilihan Anda</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin memilih {selectedName}?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleVote}>Lanjutkan</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
        <div className="mt-6 text-center">
          <button 
            onClick={() => {
              removeVoterSession()
              router.push('/login')
            }}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  )
}