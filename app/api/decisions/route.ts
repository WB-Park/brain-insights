import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const importance = searchParams.get('importance')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    let query = supabase
      .from('atomic_notes')
      .select('*')
      .eq('status', 'active')
      .eq('note_type', 'decision')
      .order('week_start', { ascending: false })

    if (importance === '5') {
      query = query.eq('importance', 5)
    } else if (importance === '4+') {
      query = query.gte('importance', 4)
    }

    const { data, error } = await query.limit(limit)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    let results = data || []
    if (search) {
      const searchLower = search.toLowerCase()
      results = results.filter(
        (note: any) =>
          note.title.toLowerCase().includes(searchLower) ||
          note.content.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}