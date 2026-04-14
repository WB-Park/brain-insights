'use client'

import React, { useEffect, useState } from 'react'
import { NoteCard } from '@/components/NoteCard'
import type { AtomicNote } from '@/lib/types'
import { ChevronDown } from 'lucide-react'

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<AtomicNote[]>([])
  const [filteredDecisions, setFilteredDecisions] = useState<AtomicNote[]>([])
  const [loading, setLoading] = useState(true)
  const [importance, setImportance] = useState<'all' | '4+' | '5'>('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        const url = new URL('/api/decisions', window.location.origin)
        if (importance !== 'all') {
          url.searchParams.set('importance', importance)
        }
        url.searchParams.set('limit', '500')

        const res = await fetch(url.toString())
        const data = await res.json()
        setDecisions(data)
      } catch (error) {
        console.error('Error fetching decisions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDecisions()
  }, [importance])

  useEffect(() => {
    let filtered = decisions

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        d =>
          d.title.toLowerCase().includes(searchLower) ||
          d.content.toLowerCase().includes(searchLower)
      )
    }

    setFilteredDecisions(filtered)
  }, [search, decisions])

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">의사결정 타임라인</h1>
        <p className="text-gray-400">모든 의사결정 사항을 시간 순서로 정렬하여 확인하세요.</p>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">우선순위</label>
            <div className="relative">
              <select
                value={importance}
                onChange={e => setImportance(e.target.value as 'all' | '4+' | '5')}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white appearance-none cursor-pointer hover:border-gray-600 transition-colors"
              >
                <option value="all">모든 의사결정</option>
                <option value="4+">Level 4 이상</option>
                <option value="5">Level 5 (CEO)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">검색</label>
            <input
              type="text"
              placeholder="제목 또는 내용으로 검색..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 hover:border-gray-600 focus:border-blue-500 transition-colors outline-none"
            />
          </div>
        </div>

        <div className="text-sm text-gray-400">
          총 {filteredDecisions.length}건의 의사결정
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">로드 중...</p>
          </div>
        </div>
      ) : filteredDecisions.length > 0 ? (
        <div className="space-y-3">
          {filteredDecisions.map(decision => (
            <NoteCard key={decision.id} note={decision} showContent={true} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 rounded-lg p-12 border border-gray-800 text-center">
          <p className="text-gray-400">조건에 맞는 의사결정이 없습니다.</p>
        </div>
      )}
    </div>
  )
}