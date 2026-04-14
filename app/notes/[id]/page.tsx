import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AtomicNote } from '@/lib/types'

export const dynamic = 'force-dynamic'

const typeLabels: Record<string, string> = {
  decision: '의사결정',
  insight: '인사이트',
  action_item: '액션아이템',
  risk: '리스크',
  pattern: '패턴',
}

const importanceBadges: Record<number, string> = {
  5: 'bg-red-500/20 text-red-400 border-red-500/30',
  4: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  3: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  2: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  1: 'bg-gray-600/20 text-gray-500 border-gray-600/30',
}

export default async function NoteDetailPage({ params }: { params: { id: string } }) {
  const { data: note, error } = await supabase
    .from('atomic_notes')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !note) return notFound()

  const n = note as AtomicNote
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="p-8 max-w-5xl">
      <Link href="/decisions" className="text-sm text-gray-400 hover:text-white mb-6 inline-block">
        ← 목록으로
      </Link>
      <div className="mb-6 flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold text-white leading-tight">{n.title}</h1>
        <span
          className={
            'text-sm font-semibold px-3 py-1.5 rounded border whitespace-nowrap ' +
            (importanceBadges[n.importance] || '')
          }
        >
          Level {n.importance}
        </span>
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-400 mb-8 flex-wrap">
        <span className="bg-gray-800 px-3 py-1 rounded">#{n.channel_name}</span>
        <span>{typeLabels[n.note_type] || n.note_type}</span>
        <span>{formatDate(n.week_start || n.created_at)}</span>
      </div>
      <div className="whitespace-pre-wrap text-gray-200 text-base leading-relaxed bg-gray-900/50 p-6 rounded-lg border border-gray-800 mb-10">
        {n.content}
      </div>
      {n.topics && n.topics.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">주제</h2>
          <div className="flex flex-wrap gap-2">
            {n.topics.map((t, i) => (
              <Link
                key={i}
                href={'/topics?topic=' + encodeURIComponent(t)}
                className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-1 rounded hover:bg-blue-500/20 text-sm"
              >
                {t}
              </Link>
            ))}
          </div>
        </section>
      )}
      {n.people && n.people.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">관련 인물</h2>
          <div className="flex flex-wrap gap-2">
            {n.people.map((p, i) => (
              <span key={i} className="bg-gray-800 px-3 py-1 rounded text-sm text-gray-300">
                {p}
              </span>
            ))}
          </div>
        </section>
      )}
      {n.related_channels && n.related_channels.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">관련 채널</h2>
          <div className="flex flex-wrap gap-2">
            {n.related_channels.map((c, i) => (
              <span key={i} className="bg-gray-800 px-3 py-1 rounded text-sm text-gray-300">
                #{c}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
