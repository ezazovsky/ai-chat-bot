// app/[...url]/page.tsx
export const dynamic = 'force-dynamic'

import { ChatWrapper } from '@/components/ChatWrapper'
import { ragChat } from '@/lib/rag-chat'
import { redis } from '@/lib/redis'

function reconstructUrl(url: string[]) {
  return url.map(decodeURIComponent).join('/')
}

type ActualParams = { params: Promise<{ url: string[] }> }

export default async function Page({ params }: ActualParams) {
  const { url } = await params; // await here

  const reconstructedUrl = reconstructUrl(url)

  const isAlreadyIndexed = await redis.sismember('indexed-urls', reconstructedUrl)

  const sessionId = "mock-session"

  if (!isAlreadyIndexed) {
    await ragChat.context.add({
      type: 'html',
      source: reconstructedUrl,
      config: { chunkOverlap: 50, chunkSize: 200 },
    })

    await redis.sadd('indexed-urls', reconstructedUrl)
  }

  return <ChatWrapper sessionId={sessionId}/>
}
