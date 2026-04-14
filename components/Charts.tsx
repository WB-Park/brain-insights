'use client'

import React from 'react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

interface WeeklyTrendProps {
  data: Array<{ week: string; count: number }>
}

export function WeeklyTrendChart({ data }: WeeklyTrendProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">주간 노트 생성 추세</h2>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="week" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
            labelStyle={{ color: '#e5e7eb' }}
          />
          <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

interface NoteTypeDistProps {
  data: Array<{ type: string; count: number }>
}

const typeColors: Record<string, string> = {
  decision: '#f59e0b',
  insight: '#10b981',
  action_item: '#06b6d4',
  risk: '#ef4444',
  pattern: '#a855f7',
}

const typeLabels: Record<string, string> = {
  decision: '의사결정',
  insight: '인사이트',
  action_item: '액션아이템',
  risk: '리스크',
  pattern: '패턴',
}

export function NoteTypeDistChart({ data }: NoteTypeDistProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">노트 유형 분포</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="count"
          >
            {data.map((entry, index) => (
              <Cell key={String(index)} fill={typeColors[entry.type]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
            labelStyle={{ color: '#e5e7eb' }}
            formatter={(value: number) => value.toLocaleString()}
          />
          <Legend formatter={(value: string) => typeLabels[value] || value} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

interface HorizontalBarChartProps {
  data: Array<Record<string, string | number>>
  dataKey: string
  nameKey: string
  title: string
  color?: string
}

export function HorizontalBarChart({
  data,
  dataKey,
  nameKey,
  title,
  color = '#3b82f6',
}: HorizontalBarChartProps) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <h2 className="text-lg font-semibold text-white mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 200, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis type="number" stroke="#9ca3af" />
          <YAxis dataKey={nameKey} type="category" stroke="#9ca3af" width={180} tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
            labelStyle={{ color: '#e5e7eb' }}
            formatter={(value: number) => value.toLocaleString()}
          />
          <Bar dataKey={dataKey} fill={color} radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}