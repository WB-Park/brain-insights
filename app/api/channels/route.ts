import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data: notes, error } = await supabase
      .from('atomic_notes')
      .select('channel_name')
      .eq('status', 'active')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const channelMap = new Map<string, number>()
    notes?.forEach(note => {
      if (note.channel_name) {
        channelMap.set(note.channel_name, (channelMap.get(note.channel_name) || 0) + 1)
      }
    })

    const channels = Array.from(channelMap.entries())
      .map(([channel_name, count]) => ({ channel_name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20)

    return NextResponse.json(channels)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}