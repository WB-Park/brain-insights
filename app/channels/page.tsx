import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface ChannelStat {
  channel_id: string
  channel_name: string
  total_notes: number
  decisions: number
  risks: number
  action_items: number
  insights: number
  patterns: number
  avg_importance: number
  last_activity: string
}

export default async function ChannelsPage() {
  const { data } = await supabase.rpc('get_channel_stats')
  const channels = (data as ChannelStat[] | null) || []

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })

  const daysSince = (d: string) => {
    const diff = Date.now() - new Date(d).getTime()
    return Math.floor(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="p-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-white mb-2">채널 분포</h1>
      <p className="text-gray-400 mb-6">
        채널별 노트 집계. 어느 채널이 의사결정 허브/리스크 허브인지, 어느 채널이 조용해졌는지 파악용.
      </p>

      <div className="mb-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded text-sm text-amber-200">
        <strong className="text-amber-300">해석 주의.</strong> 개인 단위 집계는 의도적으로 제외했습니다.
        감시 도구로 변질되는 것을 막기 위함입니다. 채널 단위 신호로만 해석하세요.
      </div>

      <div className="overflow-x-auto bg-gray-900/50 border border-gray-800 rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-900 border-b border-gray-800">
            <tr className="text-left text-gray-400">
              <th className="p-3 font-medium">채널</th>
              <th className="p-3 font-medium text-right">전체</th>
              <th className="p-3 font-medium text-right">결정</th>
              <th className="p-3 font-medium text-right">리스크</th>
              <th className="p-3 font-medium text-right">액션</th>
              <th className="p-3 font-medium text-right">인사이트</th>
              <th className="p-3 font-medium text-right">패턴</th>
              <th className="p-3 font-medium text-right">평균 중요도</th>
              <th className="p-3 font-medium text-right">최근 활동</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((c) => {
              const days = daysSince(c.last_activity)
              const stale = days > 30
              return (
                <tr
                  key={c.channel_id}
                  className="border-b border-gray-800/50 hover:bg-gray-800/30"
                >
                  <td className="p-3">
                    <a
                      href={'https://wishket.slack.com/archives/' + c.channel_id}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      #{c.channel_name}
                    </a>
                  </td>
                  <td className="p-3 text-right text-white font-semibold">{c.total_notes}</td>
                  <td className="p-3 text-right text-blue-400">{c.decisions}</td>
                  <td className="p-3 text-right text-red-400">{c.risks}</td>
                  <td className="p-3 text-right text-green-400">{c.action_items}</td>
                  <td className="p-3 text-right text-purple-400">{c.insights}</td>
                  <td className="p-3 text-right text-amber-400">{c.patterns}</td>
                  <td className="p-3 text-right text-gray-300">
                    {c.avg_importance.toFixed(2)}
                  </td>
                  <td
                    className={
                      'p-3 text-right ' + (stale ? 'text-gray-600' : 'text-gray-300')
                    }
                  >
                    {formatDate(c.last_activity)}
                    <span className="text-xs text-gray-600 ml-1">({days}일 전)</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
