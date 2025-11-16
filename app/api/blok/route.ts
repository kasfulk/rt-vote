import { supabase } from '../../lib/supabaseClient';
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('warga')
      .select('blok')
      .order('blok', { ascending: true })

    if (error) {
      return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
    }

    // Get unique blok values
    const uniqueBlok = [...new Set(data.map(item => item.blok))]
    
    return NextResponse.json(uniqueBlok)
  } catch {
    return NextResponse.json({ status: 'error', message: 'Internal server error' }, { status: 500 })
  }
}