import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data: notes, error } = await supabase
      .from('atomic_notes')
      .select('topics')
      .eq('status', 'active')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const topicMap = new Map<string, number>()
    notes?.forEach(note => {
      if (note.topics && Array.isArray(note.topics)) {
        note.topics.forEach((topic: string) => {
          if (topic && topic.trim()) {
            topicMap.set(topic, (topicMap.get(topic) || 0) + 1)
          }
        })
      }
    })

    const topics = Array.from(topicMap.entries())
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50)

    return NextResponse.json(topics)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}