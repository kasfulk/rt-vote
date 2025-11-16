import { supabase } from '../../lib/supabaseClient';
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  let query = supabase
    .from('warga')
    .select('id, nama, nomor_rumah, blok')
    .eq('is_calon', true)

  if (q) {
    query = query.ilike('nama', `%${q}%`)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ status: 'error', message: error.message })
  }

  const list = data.map((c) => ({
    id: c.id,
    display: `${c.nama} / ${c.nomor_rumah} / ${c.blok}`,
  }))

  return NextResponse.json(list)
}