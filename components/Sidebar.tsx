'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, TrendingUp, Tag, Search, AlertTriangle, Hash, Activity } from 'lucide-react'

const navItems = [
  { href: '/', label: '대시보드', Icon: BarChart3 },
  { href: '/search', label: 'Q&A 검색', Icon: Search },
  { href: '/trends', label: '트렌드·이상신호', Icon: Activity },
  { href: '/follow-through', label: 'Follow-through 공백', Icon: AlertTriangle },
  { href: '/decisions', label: '의사결정', Icon: TrendingUp },
  { href: '/topics', label: '주제 탐색', Icon: Tag },
  { href: '/channels', label: '채널 분포', Icon: Hash },
]

export function Sidebar() {
  const pathname = usePathname()
  const isActive = (path: string) =>
    pathname === path || (path !== '/' && pathname.startsWith(path))

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 h-screen flex flex-col p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Brain Insights</h1>
        <p className="text-gray-400 text-sm mt-1">Wishket Knowledge System</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={
              'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ' +
              (isActive(href)
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                : 'text-gray-300 hover:bg-gray-800 border border-transparent')
            }
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="pt-6 border-t border-gray-800">
        <p className="text-gray-500 text-xs">Atomic Notes 기반 인사이트</p>
      </div>
    </div>
  )
}
