import { supabase } from '../../lib/supabaseClient';
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const blok = searchParams.get('blok')

  if (!blok) {
    return NextResponse.json({ status: 'error', message: 'Blok parameter is required' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('warga')
      .select('nomor_rumah')
      .eq('blok', blok)
      .order('nomor_rumah', { ascending: true })

    if (error) {
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
    }

    // Get unique nomor_rumah values
    const uniqueNomorRumah = [...new Set(data.map(item => item.nomor_rumah))]
    
    return NextResponse.json(uniqueNomorRumah)
  } catch {
    return NextResponse.json({ status: 'error', message: 'Internal server error' }, { status: 500 })
  }
}