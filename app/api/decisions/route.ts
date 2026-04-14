import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

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
      .limit(limit)

    if (importance === '5') {
      query = query.eq('importance', 5)
    } else if (importance === '4+') {
      query = query.gte('importance', 4)
    }

    if (search && search.trim()) {
      const safe = search.replace(/[%,()]/g, ' ').trim()
      if (safe) {
        query = query.or('title.ilike.%' + safe + '%,content.ilike.%' + safe + '%')
      }
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
