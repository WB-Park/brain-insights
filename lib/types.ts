export type NoteType = 'decision' | 'insight' | 'action_item' | 'risk' | 'pattern'

export type Importance = 1 | 2 | 3 | 4 | 5

export interface AtomicNote {
  id: string
  wiki_page_id: string
  channel_id: string
  channel_name: string
  week_start: string
  note_type: NoteType
  title: string
  content: string
  importance: Importance
  date_observed: string
  topics: string[]
  people: string[]
  related_channels: string[]
  obsidian_wikilinks: string[]
  status: string
  created_at: string
}

export interface StatsData {
  totalNotes: number
  decisions: number
  insights: number
  risks: number
  actionItems: number
  patterns: number
  importance5Count: number
  weeklyTrend: Array<{ week: string; count: number }>
  noteTypeDist: Array<{ type: string; count: number }>
}

export interface TopicData {
  topic: string
  count: number
}

export interface ChannelData {
  channel_name: string
  count: number
}