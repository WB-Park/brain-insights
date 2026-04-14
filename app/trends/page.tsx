import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface Anomaly {
  topic: string
  recent_count: number
  baseline_weekly_avg: number
  ratio: number
  risk_count: number
  decision_count: number
}

interface WeeklyCount {
  topic: string
  week_start: string
  mentions: number
}

function buildSparkline(values: number[], width = 80, height = 24): string {
  if (!values.length) return ''
  const max = Math.max(...values, 1)
  const step = values.length > 1 ? width / (values.length - 1) : 0
  const points = values
    .map((v, i) => {
      const x = i * step
      const y = height - (v / max) * (height - 2) - 1
      return x.toFixed(1) + ',' + y.toFixed(1)
    })
    .join(' ')
  return points
}

export default async function TrendsPage() {
  const { data: anomaliesData } = await supabase.rpc('get_topic_anomalies', { min_recent: 4 })
  // 최소 샘플 크기 가드: baseline_weekly_avg >= 1.0 (0.5→3 같은 노이즈 배제)
  const anomalies = ((anomaliesData as Anomaly[] | null) || [])
    .filter((a) => Number(a.baseline_weekly_avg) >= 1.0)
    .slice(0, 20)

  const { data: weeklyData } = await supabase.rpc('get_topic_weekly_counts', { weeks_back: 12 })
  const weekly = (weeklyData as WeeklyCount[] | null) || []

  const weeksSet = new Set<string>()
  weekly.forEach((w) => weeksSet.add(w.week_start))
  const allWeeks = Array.from(weeksSet).sort()

  const sparklineByTopic: Record<string, number[]> = {}
  anomalies.forEach((a) => {
    const series = allWeeks.map((w) => {
      const row = weekly.find((x) => x.topic === a.topic && x.week_start === w)
      return row ? row.mentions : 0
    })
    sparklineByTopic[a.topic] = series
  })

  return (
    <div className="p-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-white mb-2">트렌드 · 이상 신호</h1>
      <p className="text-gray-400 mb-8">
        최근 7일 언급량이 이전 4주 평균 대비 급증한 주제. 최소 샘플 크기(주당 평균 ≥ 1건) 통과분만 표시.
      </p>

      <div className="mb-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded text-sm text-amber-200">
        <strong className="text-amber-300">해석 주의.</strong> 이 지표는 "질문을 생성하는 신호"입니다.
        결론이 아니라 확인의 입구입니다. 샘플링 편향(퍼블릭 채널만), AI 분류 오류,
        맥락 소실이 있을 수 있습니다.
      </div>

      {anomalies.length === 0 ? (
        <p className="text-gray-500">최근 7일 내 이상 신호가 감지된 주제가 없습니다.</p>
      ) : (
        <div className="space-y-2">
          {anomalies.map((a, idx) => {
            const series = sparklineByTopic[a.topic] || []
            const sparkPoints = buildSparkline(series)
            const isSpike = a.ratio >= 3
            const hasRisk = a.risk_count > 0
            return (
              <Link
                key={idx}
                href={'/topics?topic=' + encodeURIComponent(a.topic)}
                className="flex items-center gap-4 p-4 bg-gray-900/50 border border-gray-800 rounded hover:border-blue-500 hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium">{a.topic}</span>
                    {isSpike && (
                      <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                        +{Math.round((a.ratio - 1) * 100)}%
                      </span>
                    )}
                    {hasRisk && (
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        리스크 {a.risk_count}건
                      </span>
                    )}
                    {a.decision_count > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        결정 {a.decision_count}건
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500">
                    최근 7일 {a.recent_count}건 · 이전 4주 주당 평균 {a.baseline_weekly_avg.toFixed(1)}건
                  </div>
                </div>
                <svg width="80" height="24" className="text-blue-400 flex-shrink-0">
                  <polyline
                    points={sparkPoints}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                <div className="text-gray-500 text-xl flex-shrink-0">→</div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
