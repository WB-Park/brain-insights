'use client'

import React, { useEffect, useState } from 'react'
import { NoteCard } from '@/components/NoteCard'
import type { TopicData, AtomicNote } from '@/lib/types'

export default function TopicsPage() {
  const [topics, setTopics] = useState<TopicData[]>([])
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [notes, setNotes] = useState<AtomicNote[]>([])
  const [loading, setLoading] = useState(true)
  const [notesLoading, setNotesLoading] = useState(false)

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await fetch('/api/topics')
        const data = await res.json()
        setTopics(data)
        if (data.length > 0) {
          setSelectedTopic(data[0].topic)
        }
      } catch (error) {
        console.error('Error fetching topics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [])

  useEffect(() => {
    if (!selectedTopic) return

    const fetchNotes = async () => {
      setNotesLoading(true)
      try {
        const url = new URL('/api/notes', window.location.origin)
        url.searchParams.set('topic', selectedTopic)
        url.searchParams.set('limit', '100')

        const res = await fetch(url.toString())
        const data = await res.json()
        setNotes(data)
      } catch (error) {
        console.error('Error fetching notes:', error)
      } finally {
        setNotesLoading(false)
      }
    }

    fetchNotes()
  }, [selectedTopic])

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">주제 탐색</h1>
        <p className="text-gray-400">주제별 노트를 조회하고 관련 인사이트를 발견하세요.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">주제 목록 로드 중...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden sticky top-8">
              <div className="p-4 border-b border-gray-800">
                <h2 className="text-sm font-semibold text-white">주제 목록</h2>
                <p className="text-xs text-gray-400 mt-1">{topics.length}개 주제</p>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {topics.map(topic => (
                  <button
                    key={topic.topic}
                    onClick={() => setSelectedTopic(topic.topic)}
                    className={selectedTopic === topic.topic
                      ? 'w-full text-left px-4 py-3 border-b border-gray-800/50 text-sm transition-colors bg-blue-500/10 text-blue-400 border-l-2 border-l-blue-500'
                      : 'w-full text-left px-4 py-3 border-b border-gray-800/50 text-sm transition-colors text-gray-300 hover:bg-gray-800'}
                  >
                    <div className="font-medium truncate">{topic.topic}</div>
                    <div className="text-xs text-gray-500 mt-1">{topic.count}개 노트</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            {selectedTopic && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">{selectedTopic}</h2>
                  <span className="text-sm text-gray-400">{notes.length}개 노트</span>
                </div>

                {notesLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-400">노트 로드 중...</p>
                    </div>
                  </div>
                ) : notes.length > 0 ? (
                  <div className="space-y-3">
                    {notes.map(note => (
                      <NoteCard key={note.id} note={note} showContent={true} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-900 rounded-lg p-12 border border-gray-800 text-center">
                    <p className="text-gray-400">이 주제의 노트가 없습니다.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}