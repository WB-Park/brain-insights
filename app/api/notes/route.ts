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
      .limit(limit)

    if (topic) {
      query = query.contains('topics', [topic])
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
