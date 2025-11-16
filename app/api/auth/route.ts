import { supabase } from '../../lib/supabaseClient'
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