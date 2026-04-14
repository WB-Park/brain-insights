import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface Gap {
  id: string
  title: string
  content: string
  date_observed: string
  channel_id: string
  channel_name: string
  topics: string[]
  importance: number
  days_since: number
  followup_count: number
}

const importanceBadges: Record<number, string> = {
  5: 'bg-red-500/20 text-red-400 border-red-500/30',
  4: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  3: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
}

export default async function FollowThroughPage() {
  const { data } = await supabase.rpc('get_followthrough_gaps', {
    lookback_days: 90,
    gap_days: 14,
  })
  const gaps = (data as Gap[] | null) || []

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="p-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-white mb-2">Follow-through 공백</h1>
      <p className="text-gray-400 mb-8">
        최근 90일 내 의사결정 중, 결정일 이후 14일간 같은 주제로 후속 노트가 0건인 건.
      </p>

      <div className="mb-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded text-sm text-amber-200">
        <strong className="text-amber-300">해석 주의.</strong> 이 목록은 "실행되지 않은 결정"이 아니라
        "atomic_notes에 후속 신호가 없는 결정"입니다. 실제로는 실행됐지만 프라이빗 채널/DM에서
        논의됐거나, AI 분류에 누락됐을 수 있습니다. 확인 후 판단하세요.
      </div>

      <div className="mb-4 text-sm text-gray-400">
        총 <span className="text-white font-semibold">{gaps.length}</span>건의 잠재 공백
      </div>

      {gaps.length === 0 ? (
        <p className="text-gray-500">현재 탐지된 공백 없음.</p>
      ) : (
        <div className="space-y-3">
          {gaps.map((g) => (
            <Link
              key={g.id}
              href={'/notes/' + g.id}
              className="block p-5 bg-gray-900/50 border border-gray-800 border-l-4 border-l-red-500 rounded hover:border-blue-500 hover:bg-gray-800/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-white font-medium leading-snug">{g.title}</h3>
                <span
                  className={
                    'text-xs px-2 py-1 rounded border whitespace-nowrap ' +
                    (importanceBadges[g.importance] || '')
                  }
                >
                  L{g.importance}
                </span>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2 mb-3">{g.content}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                <span className="bg-gray-800 px-2 py-0.5 rounded">#{g.channel_name}</span>
                <span>{formatDate(g.date_observed)}</span>
                <span className="text-red-400">
                  결정 후 {g.days_since}일 경과 · 후속 0건
                </span>
                {g.topics && g.topics.length > 0 && (
                  <span className="ml-auto text-gray-600">
                    주제: {g.topics.slice(0, 3).join(', ')}
                    {g.topics.length > 3 ? ' +' + (g.topics.length - 3) : ''}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
