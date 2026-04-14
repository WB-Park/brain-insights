'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { StatCard } from '@/components/StatCard'
import { WeeklyTrendChart, NoteTypeDistChart, HorizontalBarChart } from '@/components/Charts'
import { NoteCard } from '@/components/NoteCard'
import {
  BarChart3,
  CheckSquare,
  Lightbulb,
  AlertCircle,
  Zap,
  Shuffle,
  TrendingUp,
} from 'lucide-react'
import type { StatsData, TopicData, ChannelData, AtomicNote } from '@/lib/types'

export default function Dashboard() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [topics, setTopics] = useState<TopicData[]>([])
  const [channels, setChannels] = useState<ChannelData[]>([])
  const [criticalDecisions, setCriticalDecisions] = useState<AtomicNote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch('/api/stats')
        const statsData = await statsRes.json()
        setStats(statsData)

        const topicsRes = await fetch('/api/topics')
        const topicsData = await topicsRes.json()
        setTopics(topicsData)

        const channelsRes = await fetch('/api/channels')
        const channelsData = await channelsRes.json()
        setChannels(channelsData)

        const decisionsRes = await fetch('/api/decisions?importance=5&limit=5')
        const decisionsData = await decisionsRes.json()
        setCriticalDecisions(decisionsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">데이터 로드 중...</p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-400">데이터를 불러올 수 없습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-8">Brain Insights</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <StatCard label="총 노트" value={stats.totalNotes} icon={BarChart3} color="text-blue-400" />
          <StatCard label="의사결정" value={stats.decisions} icon={CheckSquare} color="text-amber-400" />
          <StatCard label="인사이트" value={stats.insights} icon={Lightbulb} color="text-emerald-400" />
          <StatCard label="리스크" value={stats.risks} icon={AlertCircle} color="text-rose-400" />
          <StatCard label="액션아이템" value={stats.actionItems} icon={Zap} color="text-cyan-400" />
          <StatCard label="패턴" value={stats.patterns} icon={Shuffle} color="text-purple-400" />
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-red-400" />
          <h2 className="text-lg font-semibold text-white">CEO 레벨 의사결정 (Level 5)</h2>
          <span className="text-sm text-gray-400 ml-auto">{stats.importance5Count}건</span>
        </div>
        <div className="space-y-3">
          {criticalDecisions.length > 0 ? (
            criticalDecisions.map(decision => <NoteCard key={decision.id} note={decision} />)
          ) : (
            <p className="text-gray-400 text-sm py-4">CEO 레벨 의사결정이 없습니다.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyTrendChart data={stats.weeklyTrend} />
        <NoteTypeDistChart data={stats.noteTypeDist} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HorizontalBarChart
          data={topics.slice(0, 15).map(t => ({ topic: t.topic, count: t.count }))}
          dataKey="count"
          nameKey="topic"
          title="상위 15개 주제"
          color="#3b82f6"
        />
        <HorizontalBarChart
          data={channels.map(c => ({ channel: c.channel_name, count: c.count }))}
          dataKey="count"
          nameKey="channel"
          title="상위 10개 활동 채널"
          color="#10b981"
        />
      </div>
    </div>
  )
}