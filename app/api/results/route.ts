import { supabase } from '../../lib/supabaseClient';
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Query to get top 3 candidates by vote count
    // First, get all votes with calon_id
    const { data: votesData, error: votesError } = await supabase
      .from('pilihan')
      .select('calon_id')

    if (votesError) {
      return NextResponse.json({ status: 'error', message: votesError.message })
    }

    // Then, get candidate details for all unique calon_ids
    const uniqueCalonIds = [...new Set(votesData.map(v => v.calon_id))]
    
    const { data: candidatesData, error: candidatesError } = await supabase
      .from('warga')
      .select('id, nama, blok, nomor_rumah')
      .in('id', uniqueCalonIds)
      .eq('is_calon', true)

    if (candidatesError) {
      return NextResponse.json({ status: 'error', message: candidatesError.message })
    }

    // Create a map of candidate details
    const candidateMap: { [key: string]: { id: string; nama: string; blok: string; nomor_rumah: string } } = {}
    candidatesData.forEach(candidate => {
      candidateMap[candidate.id] = candidate
    })

    // Count votes for each candidate
    const voteCounts: { [key: string]: { count: number; details: { id: string; nama: string; blok: string; nomor_rumah: string } } } = {}
    
    votesData.forEach((item: { calon_id: string }) => {
      const calonId = item.calon_id
      const candidateDetails = candidateMap[calonId]
      
      if (candidateDetails) {
        if (!voteCounts[calonId]) {
          voteCounts[calonId] = {
            count: 0,
            details: candidateDetails
          }
        }
        voteCounts[calonId].count++
      }
    })

    // Convert to array and sort by vote count (descending)
    const results = Object.entries(voteCounts)
      .map(([calonId, data]) => ({
        id: calonId,
        nama: data.details.nama,
        blok: data.details.blok,
        nomor_rumah: data.details.nomor_rumah,
        votes: data.count
      }))
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 3) // Get top 3

    return NextResponse.json({
      status: 'ok',
      data: results
    })

  } catch {
    return NextResponse.json({ status: 'error', message: 'Terjadi kesalahan server' })
  }
}