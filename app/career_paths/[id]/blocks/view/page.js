'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'

export default function JournalEntryViewer() {
  const { getToken } = useAuth()
  const router = useRouter()

  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const entryId = localStorage.getItem('entryId') // get entry id from localStorage
    if (!entryId) {
      console.error('No entry id found in localStorage')
      setLoading(false)
      return
    }

    const fetchBlock = async () => {
      try {
        const token = await getToken()
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/get-entry-block?entry_block_id=${entryId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        // Set blocks from the returned entry
        setBlocks(res.data?.content || [])
      } catch (err) {
        console.error('Failed to fetch block', err)
      } finally {
        setLoading(false)
      }
    }

    fetchBlock()
  }, [getToken])

  const renderBlock = (block, idx) => {
    switch (block.type) {
      case 'title':
        return <h1 key={idx} className="text-2xl text-amber-400 font-bold">{block.content}</h1>
      case 'heading':
        return <h2 key={idx} className="text-xl text-amber-300 mt-4">{block.content}</h2>
      case 'paragraph':
        return <p key={idx} className="text-zinc-300 mt-2">{block.content}</p>
      case 'points':
        return <ul key={idx} className="list-disc ml-6 text-zinc-200">{block.content.split('\n').map((p, i) => <li key={i}>{p}</li>)}</ul>
      case 'code':
        return <pre key={idx} className="bg-black text-green-400 p-3 rounded-lg overflow-x-auto">{block.content}</pre>
      case 'table':
        return <pre key={idx} className="bg-zinc-900 p-3 rounded-lg">{block.content}</pre>
      case 'quote':
        return <blockquote key={idx} className="border-l-4 border-amber-400 pl-4 italic text-zinc-200">{block.content}</blockquote>
      case 'checklist':
        return <ul key={idx} className="text-zinc-200">{block.content.split('\n').map((c, i) => <li key={i}>{c}</li>)}</ul>
      case 'image':
        return block.content ? <img key={idx} src={block.content} alt="Image preview" className="rounded-md" /> : <div key={idx} className="text-sm text-gray-400 italic">No image URL</div>
      case 'video':
        return block.content ? (
          <div key={idx} className="w-full rounded-md overflow-hidden">
            <iframe src={block.content} className="w-full h-auto" style={{ minHeight: '200px' }} allowFullScreen />
          </div>
        ) : <div key={idx} className="text-sm text-gray-400 italic">No video URL</div>
      case 'attachment':
        return block.content ? <a key={idx} href={block.content} target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">Attachment</a> : <div key={idx} className="text-sm text-gray-400 italic">No attachment URL</div>
      case 'reference':
        return block.content ? <a key={idx} href={block.content} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Reference</a> : <div key={idx} className="text-sm text-gray-400 italic">No reference URL</div>
      case 'embed':
        if (!block.content) return <div key={idx} className="text-sm text-gray-400 italic">No embed content</div>
        try {
          const embedded = block.content.replace(/<iframe([^>]*)>/i,'<iframe$1 style="width:100%;height:auto;" width="100%" height="auto">')
          return <div key={idx} className="w-full rounded-md overflow-hidden" dangerouslySetInnerHTML={{ __html: embedded }} />
        } catch (e) {
          return <div key={idx} dangerouslySetInnerHTML={{ __html: block.content }} />
        }
      case 'callout':
        return <div key={idx} className="bg-amber-400/10 border border-amber-400/30 p-4 rounded-xl text-amber-300">{block.content}</div>
      case 'divider':
        return <hr key={idx} className="border-zinc-800 my-4" />
      default:
        return null
    }
  }

  if (loading) return <div className="text-gray-400 text-center mt-20">Loading entry block...</div>

  return (
    <div className="min-h-screen py-12 bg-[#0f0f0f]">
      <div className="max-w-4xl mx-auto px-6 space-y-6">
        <h2 className="text-xl font-bold text-amber-400 mb-4">View Entry Block</h2>
        <div className="space-y-4">
          {blocks.length ? blocks.map((block, idx) => renderBlock(block, idx)) : <p className="text-gray-400">No blocks found for this entry.</p>}
        </div>
      </div>
    </div>
  )
}
