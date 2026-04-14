'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, TrendingUp, Tag } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 h-screen flex flex-col p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Brain Insights</h1>
        <p className="text-gray-400 text-sm mt-1">Wishket Knowledge System</p>
      </div>

      <nav className="flex-1 space-y-2">
        <Link
          href="/"
          className={isActive('/')
            ? 'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-blue-500/10 text-blue-400 border border-blue-500/30'
            : 'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800'}
        >
          <BarChart3 className="w-5 h-5" />
          <span>대시보드</span>
        </Link>

        <Link
          href="/decisions"
          className={isActive('/decisions')
            ? 'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-blue-500/10 text-blue-400 border border-blue-500/30'
            : 'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800'}
        >
          <TrendingUp className="w-5 h-5" />
          <span>의사결정</span>
        </Link>

        <Link
          href="/topics"
          className={isActive('/topics')
            ? 'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors bg-blue-500/10 text-blue-400 border border-blue-500/30'
            : 'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-800'}
        >
          <Tag className="w-5 h-5" />
          <span>주제 탐색</span>
        </Link>
      </nav>

      <div className="pt-6 border-t border-gray-800">
        <p className="text-gray-500 text-xs">Atomic Notes 기반 인사이트</p>
      </div>
    </div>
  )
}