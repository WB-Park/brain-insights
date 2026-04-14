import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function POST(request: Request) {
  try {
    const { query } = await request.json()
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'query required' }, { status: 400 })
    }
    const resp = await fetch(SUPABASE_URL + '/functions/v1/knowledge-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ query, match_count: 15, side_count: 5 }),
    })
    const data = await resp.json()
    return NextResponse.json(data, { status: resp.status })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
