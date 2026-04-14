import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const importance = searchParams.get('importance')
    const ceoRelevant = searchParams.get('ceo_relevant') === 'true'
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    // CEO 가중치 기반 조회: v_atomic_notes_weighted 뷰 사용, weighted_importance DESC
    if (ceoRelevant) {
      const { data, error } = await supabase
        .from('v_atomic_notes_weighted')
        .select('*')
        .eq('status', 'active')
        .eq('note_type', 'decision')
        .gte('weighted_importance', 4.0)
        .order('weighted_importance', { ascending: false })
        .order('date_observed', { ascending: false })
        .limit(limit)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      let results = data || []
      if (search) {
        const s = search.toLowerCase()
        results = results.filter(
          (n: any) =>
            (n.title || '').toLowerCase().includes(s) ||
            (n.content || '').toLowerCase().includes(s)
        )
      }
      return NextResponse.json(results)
    }

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
        note =>
          note.title.toLowerCase().includes(searchLower) ||
          note.content.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
