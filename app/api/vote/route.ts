import { supabase } from '../../lib/supabaseClient';
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