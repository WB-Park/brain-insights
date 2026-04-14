import React from 'react'
import Link from 'next/link'
import { AtomicNote } from '@/lib/types'

const importanceColors: Record<number, string> = {
  5: 'border-l-red-500 bg-red-500/5',
  4: 'border-l-amber-500 bg-amber-500/5',
  3: 'border-l-blue-500 bg-blue-500/5',
  2: 'border-l-gray-500 bg-gray-500/5',
  1: 'border-l-gray-600 bg-gray-600/5',
}

const importanceBadges: Record<number, string> = {
  5: 'bg-red-500/20 text-red-400 border border-red-500/30',
  4: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  3: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  2: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
  1: 'bg-gray-600/20 text-gray-500 border border-gray-600/30',
}

const typeLabels: Record<string, string> = {
  decision: '의사결정',
  insight: '인사이트',
  action_item: '액션아이템',
  risk: '리스크',
  pattern: '패턴',
}

interface NoteCardProps {
  note: AtomicNote
  showContent?: boolean
}

export function NoteCard({ note, showContent = true }: NoteCardProps) {
  const truncateContent = (text: string, length: number = 150) => {
    return text.length > length ? text.substring(0, length) + '...' : text
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <Link href={'/notes/' + note.id} className="block">
      <div
        className={'border-l-4 p-5 rounded-lg border border-gray-800 transition-all hover:border-blue-500 hover:bg-gray-800/30 cursor-pointer ' + (importanceColors[note.importance] || '')}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-base font-semibold text-white flex-1 leading-tight">{note.title}</h3>
          <span
            className={'text-xs font-semibold px-2.5 py-1 rounded whitespace-nowrap ' + (importanceBadges[note.importance] || '')}
          >
            Level {note.importance}
          </span>
        </div>

        {showContent && (
          <p className="text-gray-300 text-sm mb-4 leading-relaxed">
            {truncateContent(note.content)}
          </p>
        )}

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="bg-gray-800/50 px-2 py-1 rounded text-gray-300">
              #{note.channel_name}
            </span>
            <span className="text-gray-400">{typeLabels[note.note_type] || note.note_type}</span>
          </div>
          <span className="text-gray-500">{formatDate(note.week_start || note.created_at)}</span>
        </div>

        {note.topics && note.topics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {note.topics.slice(0, 3).map((topic: string, idx: number) => (
              <span key={idx} className="bg-gray-800/30 px-2 py-1 rounded text-xs text-gray-400">
                {topic}
              </span>
            ))}
            {note.topics.length > 3 && (
              <span className="text-xs text-gray-500">+{note.topics.length - 3} more</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
