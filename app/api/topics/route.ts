import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { data, error } = await supabase.rpc('get_topic_counts', { p_limit: 50 })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    const topics = (data || []).map((r: { topic: string; count: number | string }) => ({
      topic: r.topic,
      count: Number(r.count),
    }))
    return NextResponse.json(topics)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
