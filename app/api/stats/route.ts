import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { data: notes, error } = await supabase
      .from('atomic_notes')
      .select('id, note_type, importance, week_start, created_at')
      .eq('status', 'active')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const totalNotes = notes?.length || 0
    const decisions = notes?.filter(n => n.note_type === 'decision').length || 0
    const insights = notes?.filter(n => n.note_type === 'insight').length || 0
    const risks = notes?.filter(n => n.note_type === 'risk').length || 0
    const actionItems = notes?.filter(n => n.note_type === 'action_item').length || 0
    const patterns = notes?.filter(n => n.note_type === 'pattern').length || 0
    const importance5Count = notes?.filter(n => n.importance === 5).length || 0

    const weeklyMap = new Map<string, number>()
    notes?.forEach(note => {
      const week = note.week_start?.substring(0, 10) || note.created_at?.substring(0, 10) || ''
      if (week) {
        weeklyMap.set(week, (weeklyMap.get(week) || 0) + 1)
      }
    })

    const weeklyTrend = Array.from(weeklyMap.entries())
      .map(([week, count]) => ({ week, count }))
      .sort((a, b) => a.week.localeCompare(b.week))
      .slice(-16)

    const noteTypeDist = [
      { type: 'decision', count: decisions },
      { type: 'insight', count: insights },
      { type: 'action_item', count: actionItems },
      { type: 'risk', count: risks },
      { type: 'pattern', count: patterns },
    ]

    return NextResponse.json({
      totalNotes,
      decisions,
      insights,
      risks,
      actionItems,
      patterns,
      importance5Count,
      weeklyTrend,
      noteTypeDist,
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}