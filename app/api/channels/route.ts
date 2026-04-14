import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { data, error } = await supabase.rpc('get_channel_counts', { p_limit: 20 })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    const channels = (data || []).map((r: { channel_name: string; count: number | string }) => ({
      channel_name: r.channel_name,
      count: Number(r.count),
    }))
    return NextResponse.json(channels)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
