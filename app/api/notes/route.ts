import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const topic = searchParams.get('topic')
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    let query = supabase
      .from('atomic_notes')
      .select('*')
      .eq('status', 'active')
      .order('week_start', { ascending: false })

    const { data, error } = await query.limit(limit * 2)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    let results = data || []
    if (topic) {
      results = results.filter(
        (note: any) => note.topics && Array.isArray(note.topics) && note.topics.includes(topic)
      )
    }

    return NextResponse.json(results.slice(0, limit))
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}