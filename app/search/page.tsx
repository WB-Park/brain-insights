'use client'

import { useState } from 'react'

interface SearchResult {
  id: string
  channel_name: string
  message_text: string
  ts: string
  classification: string
  importance: number
  summary: string | null
  has_decision: boolean
}

interface QueryResponse {
  answer: string | null
  answer_model: string | null
  elapsed_seconds: string
  results: SearchResult[]
  result_count: number
  wiki_count: number
  notion_count: number
  attachment_count: number
  gdrive_count: number
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<QueryResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || loading) return
    setLoading(true)
    setError(null)
    setData(null)
    try {
      const resp = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      })
      if (!resp.ok) {
        const text = await resp.text()
        throw new Error('HTTP ' + resp.status + ': ' + text)
      }
      const json = await resp.json()
      setData(json)
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  const slackUrl = (channelName: string | null | undefined) =>
    channelName ? 'https://wishket.slack.com/app_redirect?channel=' + channelName : null

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-white mb-2">Q&amp;A 검색</h1>
      <p className="text-gray-400 mb-6">
        자연어로 물어보세요. Slack 메시지 · Notion · 첨부파일 · Google Drive · 위키를 합쳐서 답합니다.
        (pinot_bot 쿼리 엔진 재사용)
      </p>

      <form onSubmit={submit} className="mb-6">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="예: 최근 H2O Infra 관련 논의 요약해줘"
            className="flex-1 bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded focus:outline-none focus:border-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded font-medium transition-colors"
          >
            {loading ? '검색 중…' : '검색'}
          </button>
        </div>
      </form>

      <div className="mb-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded text-sm text-amber-200">
        <strong className="text-amber-300">해석 주의.</strong> AI 답변은 컨텍스트에 포함된 문서에 기반하지만,
        공개 채널만 인덱싱되고, AI 요약 과정에서 맥락이 축약되거나 누락될 수 있습니다. 중요한 결정은
        원문 확인 후 판단하세요.
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded mb-6 whitespace-pre-wrap text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="p-6 bg-gray-900/50 border border-gray-800 rounded text-center text-gray-400">
          AI가 답변을 생성 중입니다. 보통 10~30초 소요됩니다…
        </div>
      )}

      {data && !loading && (
        <>
          <div className="mb-4 text-xs text-gray-500 flex flex-wrap gap-3">
            <span>소요 {data.elapsed_seconds}s</span>
            <span>모델: {data.answer_model || 'n/a'}</span>
            <span>Slack {data.result_count}</span>
            <span>위키 {data.wiki_count}</span>
            <span>Notion {data.notion_count}</span>
            <span>첨부 {data.attachment_count}</span>
            <span>Drive {data.gdrive_count}</span>
          </div>

          {data.answer && (
            <section className="mb-8 p-6 bg-blue-500/5 border border-blue-500/20 rounded">
              <h2 className="text-sm font-semibold text-blue-300 mb-3">AI 답변</h2>
              <div className="whitespace-pre-wrap text-gray-200 leading-relaxed text-sm">
                {data.answer}
              </div>
            </section>
          )}

          {data.results && data.results.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">출처 메시지</h2>
              <div className="space-y-2">
                {data.results.slice(0, 10).map((r) => {
                  const url = slackUrl(r.channel_name)
                  return (
                    <div
                      key={r.id}
                      className="p-4 bg-gray-900/50 border border-gray-800 rounded text-sm"
                    >
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2 flex-wrap">
                        {url ? (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300"
                          >
                            #{r.channel_name}
                          </a>
                        ) : (
                          <span>#{r.channel_name}</span>
                        )}
                        <span>{new Date(r.ts).toLocaleDateString('ko-KR')}</span>
                        <span className="px-2 py-0.5 bg-gray-800 rounded">
                          {r.classification}
                        </span>
                        {r.has_decision && (
                          <span className="text-amber-400">⭐ 의사결정</span>
                        )}
                        <span className="ml-auto text-gray-600">imp {r.importance}</span>
                      </div>
                      {r.summary && (
                        <p className="text-gray-300 mb-2 font-medium">{r.summary}</p>
                      )}
                      <p className="text-gray-400 line-clamp-3">{r.message_text}</p>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
