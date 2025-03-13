import {NextResponse} from 'next/server'
import {fetchLikes} from '@api/v1/widget/fetch-likes'

export type WidgetResponse = {
  profile: string | null
  likes: number | null
  error?: string
}

export type WidgetOptions = {
  format?: 'json' | 'svg'
  theme?: 'light' | 'dark'
}

export async function GET(request: Request): Promise<NextResponse<WidgetResponse>> {
  const {searchParams} = new URL(request.url)
  const profile = searchParams.get('profile')
  const format = searchParams.get('format') || 'json'
  const theme = searchParams.get('theme') || 'light'

  if (!profile) {
    return NextResponse.json(
      {
        profile: '',
        likes: 0,
        error: 'Profile parameter is required',
      },
      {status: 400},
    )
  }

  const totalLikes = await fetchLikes(profile)

  const cacheHeaders = {
    'Cache-Control': 'public, max-age=86400, s-maxage=86400', // 24 hours in seconds
    'CDN-Cache-Control': 'public, max-age=86400', // For CDN caching
    'Surrogate-Control': 'public, max-age=86400', // For reverse proxy caching
    'stale-while-revalidate': '43200', // Allow serving stale content for 12 hours while revalidating
  }

  if (format === 'svg') {
    const colors = {
      light: {
        background: '#fff',
        text: '#000',
      },
      dark: {
        background: '#1a1a1a',
        text: '#fff',
      },
    }

    const {background, text} = colors[theme as keyof typeof colors]

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="20">
        <rect width="80" height="20" rx="3" fill="${background}"/>
        <text x="22" y="14" font-family="Arial" font-size="12" fill="${text}">❤️ ${totalLikes}</text>
      </svg>
    `
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        ...cacheHeaders,
      },
    })
  }

  return NextResponse.json(
    {
      profile,
      likes: totalLikes,
    },
    {
      headers: cacheHeaders,
    },
  )
}
