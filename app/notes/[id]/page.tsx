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

const typeColors: Record<string, string> = {
  decision: 'border-l-blue-500',
  insight: 'border-l-purple-500',
  action_item: 'border-l-green-500',
  risk: 'border-l-red-500',
  pattern: 'border-l-amber-500',
}

const importanceBadges: Record<number, string> = {
  5: 'bg-red-500/20 text-red-400 border-red-500/30',
  4: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  3: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  2: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  1: 'bg-gray-600/20 text-gray-500 border-gray-600/30',
}

interface RelatedNote {
  id: string
  title: string
  content: string
  note_type: string
  importance: number
  channel_name: string
  date_observed: string
  topics: string[]
  similarity: number
}

export default async function NoteDetailPage({ params }: { params: { id: string } }) {
  const { data: note, error } = await supabase
    .from('atomic_notes')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !note) return notFound()

  const n = note as AtomicNote

  const { data: relatedData } = await supabase.rpc('get_related_notes', {
    note_id: params.id,
    match_count: 5,
  })
  const related = (relatedData as RelatedNote[] | null) || []

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })

  const slackChannelUrl = n.channel_id
    ? 'https://wishket.slack.com/archives/' + n.channel_id
    : null

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
        <span>{formatDate(n.date_observed || n.week_start || n.created_at)}</span>
        {slackChannelUrl && (
          <a
            href={slackChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded text-xs"
          >
            Slack 채널 열기 ↗
          </a>
        )}
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

      {related.length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-800">
          <h2 className="text-lg font-semibold text-white mb-4">
            관련 노트 <span className="text-gray-500 text-sm font-normal">(주제 기반)</span>
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            ※ 현재 atomic_notes 임베딩 미생성 상태로 주제 겹침 + 시간 근접도 기준. 임베딩 완료 후 의미 기반 유사도로 전환 예정.
          </p>
          <div className="space-y-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={'/notes/' + r.id}
                className={
                  'block p-4 bg-gray-900/50 border border-gray-800 border-l-4 rounded hover:border-blue-500 hover:bg-gray-800/30 transition-colors ' +
                  (typeColors[r.note_type] || 'border-l-gray-500')
                }
              >
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="text-white font-medium text-sm leading-snug">{r.title}</h3>
                  <span
                    className={
                      'text-xs px-2 py-0.5 rounded border whitespace-nowrap ' +
                      (importanceBadges[r.importance] || '')
                    }
                  >
                    L{r.importance}
                  </span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 mb-2">{r.content}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>#{r.channel_name}</span>
                  <span>{typeLabels[r.note_type] || r.note_type}</span>
                  <span>{formatDate(r.date_observed)}</span>
                  <span className="ml-auto text-blue-400">
                    유사도 {r.similarity.toFixed(2)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
