# Supabase Voting App Setup

## 1. Struktur Proyek
```
voting-app/
│
├─ .env.local
├─ supabase/
│   ├─ migrations/
│   └─ seed.sql
│
├─ src/
│   ├─ lib/
│   │   └─ supabaseClient.ts
│   ├─ app/
│   │   ├─ login/page.tsx
│   │   ├─ vote/page.tsx
│   │   └─ success/page.tsx
│   ├─ api/
│   │   ├─ auth/
│   │   │   └─ route.ts
│   │   ├─ calon/
│   │   │   └─ route.ts
│   │   └─ vote/
│   │       └─ route.ts
│   └─ components/
│       └─ ui/
│
├─ package.json
└─ README.md
```

---

## 2. Konfigurasi Supabase

### `.env.local`
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### `src/lib/supabaseClient.ts`
```ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## 3.1 Updated Supabase Schema (New Structure)
```sql
create table warga (
  id bigint generated always as identity primary key,
  blok text not null,
  nomor_rumah text not null,
  no_kk text not null,
  nama text not null,
  domisili text not null, -- 'Tetap' or 'Domisili'
  pemilik_rumah text, -- Name of house owner (nullable)
  penyewa text, -- Name of tenant (nullable)
  is_calon boolean default false,
  sudah_memilih boolean default false
);

---

## 3. Supabase Schema (DDL)
```sql
-- Updated schema for C8 blok residents
create table warga (
  id bigint generated always as identity primary key,
  blok text not null,
  nomor_rumah text not null,
  no_kk text not null,
  nama text not null,
  domisili text not null, -- 'Tetap' or 'Domisili'
  pemilik_rumah text, -- Name of house owner (nullable)
  penyewa text, -- Name of tenant (nullable)
  is_calon boolean default false,
  sudah_memilih boolean default false
);

create table pilihan (
  id bigint generated always as identity primary key,
  pemilih_id bigint not null references warga(id),
  calon_id bigint not null references warga(id),
  waktu_pilih timestamp default current_timestamp
);
```

---

## 4. Seed Data (`supabase/seed.sql`)
```sql
-- Seed data for C8 blok residents
INSERT INTO warga (blok, nomor_rumah, no_kk, nama, domisili, pemilik_rumah, penyewa, is_calon, sudah_memilih)
VALUES
('C8', '1', '6471040609190004', 'Amal Jauhari', 'Tetap', NULL, NULL, FALSE, FALSE),
('C8', '2', '6471030309210012', 'Aris Darma', 'Domisili', 'Pemilik Rumah', NULL, FALSE, FALSE),
('C8', '3', '6471031907100005', 'Heryy Septianto', 'Domisili', 'Pemilik Rumah', NULL, FALSE, FALSE),
('C8', '4', '6471030712230002', 'Fadhel Al Farisy', 'Tetap', NULL, NULL, FALSE, FALSE),
('C8', '5', '6471060209200003', 'A Epsonny Kristian S', 'Domisili', NULL, 'Penyewa', FALSE, FALSE);

-- Example votes
INSERT INTO pilihan (pemilih_id, calon_id)
VALUES
(4, 1),
(5, 2),
(6, 3);
```

---

## 5. API Routes (Next.js App Router)

### `/api/auth/route.ts`
```ts
import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { no_kk, nomor_rumah, blok } = body

  const { data, error } = await supabase
    .from('warga')
    .select('*')
    .eq('no_kk', no_kk)
    .eq('nomor_rumah', nomor_rumah)
    .eq('blok', blok)
    .single()

  if (error || !data) {
    return NextResponse.json({ status: 'error', message: 'Data tidak ditemukan.' })
  }

  if (data.sudah_memilih) {
    return NextResponse.json({ status: 'forbidden', message: 'Anda sudah melakukan pemilihan.' })
  }

  return NextResponse.json({ 
    status: 'ok', 
    warga_id: data.id, 
    nama: data.nama,
    no_kk: data.no_kk,
    nomor_rumah: data.nomor_rumah,
    blok: data.blok
  })
}
```

### `/api/calon/route.ts`
```ts
import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET() {
  const { data, error } = await supabase
    .from('warga')
    .select('id, nama, nomor_rumah, blok')
    .eq('is_calon', true)

  if (error) return NextResponse.json({ status: 'error', message: error.message })

  const list = data.map((c) => ({
    id: c.id,
    display: `${c.nama} / ${c.nomor_rumah} / ${c.blok}`,
  }))

  return NextResponse.json(list)
}
```

### `/api/vote/route.ts`
```ts
import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { pemilih_id, calon_id } = await req.json()

  const { error } = await supabase.from('pilihan').insert([{ pemilih_id, calon_id }])
  if (error) return NextResponse.json({ status: 'error', message: error.message })

  await supabase.from('warga').update({ sudah_memilih: true }).eq('id', pemilih_id)

  return NextResponse.json({
    status: 'ok',
    message: 'Terima kasih, suara Anda telah dicatat.',
  })
}
```

---

## 6. Frontend Login Page
```tsx
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
```

---

## 7. Menjalankan Proyek
```bash
npm install @supabase/supabase-js next react react-dom tailwindcss shadcn-ui
npx supabase start
npm run dev
```

---

## 8. Kesimpulan
File ini menggabungkan seluruh konfigurasi Supabase, schema SQL, seed data, serta API dan contoh frontend untuk sistem pemilihan Ketua RT berbasis Next.js dan Supabase.
