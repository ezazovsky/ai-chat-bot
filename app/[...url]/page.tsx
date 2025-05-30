import { ragChat } from '@/lib/rag-chat'
import { redis } from '@/lib/redis'

function reconstructUrl({ url }: { url: string[] }) {
  const decodedComponents = url.map((component) => decodeURIComponent(component))
  return decodedComponents.join('/')
}

// No need to define PageProps manually
const Page = async ({ params }: { params: { url: string[] } }) => {
  const reconstructedUrl = reconstructUrl({ url: params.url })

  const isAlreadyIndexed = await redis.sismember('indexed-urls', reconstructedUrl)

  if (!isAlreadyIndexed) {
    await ragChat.context.add({
      type: 'html',
      source: reconstructedUrl,
      config: { chunkOverlap: 50, chunkSize: 200 },
    })

    await redis.sadd('indexed-urls', reconstructedUrl)
  }

  return <p>hello</p>
}

export default Page
