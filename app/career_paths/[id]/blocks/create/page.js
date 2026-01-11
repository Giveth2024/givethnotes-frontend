'use client'
import { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation' 
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuth, useUser } from '@clerk/nextjs'
import {
  faTrash,
  faPlus,
  faCode,
  faImage,
  faVideo,
  faLink,
  faQuoteLeft,
  faListCheck,
  faTable,
  faHeading,
  faFont,
  faMinus,
} from '@fortawesome/free-solid-svg-icons'
import { toast } from 'sonner'

/* =========================
   BLOCK ARRAY
========================= */
const BLOCK_TYPES = [
  { type: 'title', label: 'Title', icon: faFont },
  { type: 'heading', label: 'Heading', icon: faHeading },
  { type: 'paragraph', label: 'Paragraph', icon: faFont },
  { type: 'points', label: 'Bullet Points', icon: faListCheck },
  { type: 'code', label: 'Code Block', icon: faCode },
  { type: 'table', label: 'Table', icon: faTable },
  { type: 'quote', label: 'Quote', icon: faQuoteLeft },
  { type: 'checklist', label: 'Checklist', icon: faListCheck },
  { type: 'image', label: 'Image', icon: faImage },
  { type: 'video', label: 'Video', icon: faVideo },
  { type: 'attachment', label: 'Attachment', icon: faLink },
  { type: 'reference', label: 'Reference', icon: faLink },
  { type: 'embed', label: 'Embed', icon: faCode },
  { type: 'callout', label: 'Callout', icon: faQuoteLeft },
  { type: 'divider', label: 'Divider', icon: faMinus },
]

// URL-safe Base64 helpers for simple obfuscation
function decodeId(val) {
  if (!val) return val;
  try {
    const b64 = val.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4;
    const padded = pad ? b64 + '='.repeat(4 - pad) : b64;
    const decoded = decodeURIComponent(escape(atob(padded)));
    return decoded;
  } catch (e) {
    return val;
  }
} 

// URL-safe Base64 helpers for simple obfuscation
function encodeId(id) {
  try {
    const str = String(id);
    const b64 = btoa(unescape(encodeURIComponent(str)));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) {
    return String(id);
  }
}

export default function JournalEntryEditor() {
  // Document as a single textarea
  const [docText, setDocText] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [savedDocText, setSavedDocText] = useState('')
  const [justSaved, setJustSaved] = useState(false)
  const textareaRef = useRef(null)
  const lastTapRef = useRef(0)
  const router = useRouter()

  function BackToCareerPathPage(id) {
    const obfuscated = encodeId(id);
    router.push(`/career_paths/${obfuscated}`);
  }

  // Read route id and decode it
  const params = useParams()
  const rawId = params?.id
  const id = decodeId(rawId)

  // Clerk auth (for server save)
  const { getToken } = useAuth()
  const { user, isSignedIn, isLoaded } = useUser()

  // keys used for per-career-path storage (fallback to global keys)
  const docKey = id ? `journal_doc_${id}` : 'journal_doc'
  const blocksKey = id ? `journal_blocks_${id}` : 'journal_blocks'

  // Contextual menu state for double-click / double-tap insertion
  const [menuVisible, setMenuVisible] = useState(false)
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 })
  // menuAnchor will be a caret index (number)
  const [menuAnchor, setMenuAnchor] = useState(null)

  // Close the contextual menu and restore scrolling
  const closeMenu = () => {
    setMenuVisible(false)
    setMenuAnchor(null)
    document.body.style.overflow = ''
  }

  /* =========================
     LOAD/STORE LOCALSTORAGE
  ========================== */
  useEffect(() => {
    const savedDoc = localStorage.getItem(docKey)
    if (savedDoc) {
      setDocText(savedDoc)
      setSavedDocText(savedDoc)
      return
    }

    const saved = localStorage.getItem(blocksKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // convert blocks array to tag-based doc text
        const text = parsed.map(b => {
          const tag = b.type ? (b.type.charAt(0).toUpperCase() + b.type.slice(1)) : 'Paragraph'
          return `<${tag}-- ${b.content || ''} --${tag}/>`
        }).join('\n\n')
        setDocText(text)
        setSavedDocText(text)
      } catch (e) {}
    }
  }, [docKey, blocksKey])

  // Note: we persist to localStorage only when the user clicks Save (explicit UX).

  /* =========================
     BLOCK HANDLERS
  ========================== */
  const addBlock = () => {
    if (!selectedType) return
    insertTagAt(null, selectedType)
    setSelectedType('')
  }

  // Helpers: capitalization and parsing for tag-based doc
  const capitalize = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s

  const parseDoc = text => {
    const result = []
    if (!text) return result
    const tagRegex = /<([A-Za-z0-9_-]+)--([\s\S]*?)--\1\/>/gi
    let lastIndex = 0
    let m
    while ((m = tagRegex.exec(text)) !== null) {
      if (m.index > lastIndex) {
        const between = text.slice(lastIndex, m.index).trim()
        if (between) result.push({ type: 'paragraph', content: between })
      }
      const tagName = m[1]
      const content = m[2].trim()
      const type = tagName.toLowerCase()
      const known = BLOCK_TYPES.find(b => b.type === type)
      result.push({ type: known ? type : 'paragraph', content })
      lastIndex = tagRegex.lastIndex
    }
    if (lastIndex < text.length) {
      const rest = text.slice(lastIndex).trim()
      if (rest) result.push({ type: 'paragraph', content: rest })
    }
    return result
  }

  const parsedBlocks = useMemo(() => parseDoc(docText), [docText])

  const insertTagAt = (index, type) => {
    const tag = capitalize(type)
    const template = `<${tag}--  --${tag}/>\n\n`
    const el = textareaRef.current
    const start = (typeof index === 'number') ? index : (el ? el.selectionStart : docText.length)
    const end = el ? el.selectionEnd : start
    const newText = docText.slice(0, start) + template + docText.slice(end)
    setDocText(newText)
    closeMenu()
    setTimeout(() => {
      if (el) {
        const pos = start + (`<${tag}-- `).length
        el.focus()
        el.selectionStart = el.selectionEnd = pos
      }
    }, 0)
  }

  const handleSave = async () => {
    const parsed = parseDoc(docText)
    console.log('Saved blocks:', parsed)

    // persist locally first
    setSavedDocText(docText)
    localStorage.setItem(docKey, docText)
    localStorage.setItem(blocksKey, JSON.stringify(parsed))

    // small UI feedback
    setJustSaved(true)
    setTimeout(() => setJustSaved(false), 1500)

    // send to server
    try {
      if (!isLoaded || !isSignedIn) {
        console.warn('User not signed in; skipping server save')
        return
      }
      
      const token = await getToken()

      const payload = {
        career_path_id: Number(id) || id,
        content: parsed,
      }

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/entry-blocks`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

        toast.success('Career path created!', {
            style: {
                background: '#052e16', // dark green
                border: '1px solid #22c55e',
                color: '#dcfce7',
            },
        });
        setTimeout(() => {
          BackToCareerPathPage(id);
          router.refresh();
      }, 1000);
    } catch (e) {
      console.error('Failed to save to server', e);
        toast.error(
        e?.response?.data?.message || 'Failed to create Entry Blocks',
        {
            style: {
                background: '#450a0a', // deep dark red (maroon)
                border: '1px solid #ef4444', // bright red border for "danger" feel
                color: '#fee2e2', // very light pink/white for high legibility
            },
        }
        );
    }
  }

  const handleCancel = () => {
    setDocText(savedDocText || '')
    closeMenu()
    BackToCareerPathPage(id);
  }

  // Double-click handler and touch double-tap: open contextual menu at cursor position (viewport coords)
  const handleDoubleClick = e => {
    e.preventDefault()
    const el = textareaRef.current
    const pos = el ? el.selectionStart : 0
    setMenuPos({ x: e.clientX + 8, y: e.clientY + 8 })
    setMenuAnchor(pos)
    setMenuVisible(true)

    // lock page scroll while menu is open to avoid overscrolling
    document.body.style.overflow = 'hidden'
  }

  const handleTouchEnd = e => {
    const now = Date.now()
    const dt = now - lastTapRef.current
    const touch = e.changedTouches && e.changedTouches[0]
    lastTapRef.current = now
    if (dt < 300 && touch) {
      const el = textareaRef.current
      const pos = el ? el.selectionStart : 0
      setMenuPos({ x: touch.clientX + 8, y: touch.clientY + 8 })
      setMenuAnchor(pos)
      setMenuVisible(true)
      document.body.style.overflow = 'hidden'
    }
  }

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    if (!menuVisible) return
    const onDown = e => {
      const menuEl = document.getElementById('context-block-menu')
      if (menuEl && !menuEl.contains(e.target)) closeMenu()
    }
    const onKey = e => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuVisible])

  // After the menu is shown, make sure it doesn't overflow the viewport.
  useEffect(() => {
    if (!menuVisible) return
    const raf = requestAnimationFrame(() => {
      const menuEl = document.getElementById('context-block-menu')
      if (!menuEl) return
      const rect = menuEl.getBoundingClientRect()
      const padding = 8
      let x = menuPos.x
      let y = menuPos.y
      if (rect.right > window.innerWidth - padding) x = Math.max(padding, window.innerWidth - rect.width - padding)
      if (rect.bottom > window.innerHeight - padding) y = Math.max(padding, window.innerHeight - rect.height - padding)
      if (x !== menuPos.x || y !== menuPos.y) setMenuPos({ x, y })
    })
    return () => cancelAnimationFrame(raf)
  }, [menuVisible, menuPos])

  /* Single-text editor: use the textarea above and parse tags for preview */

  /* =========================
     RENDER PREVIEW
  ========================== */
  const renderPreview = block => {
    switch (block.type) {
      case 'title':
        return <h1 className="text-2xl text-amber-400 font-bold">{block.content}</h1>
      case 'heading':
        return <h2 className="text-xl text-amber-300 mt-4">{block.content}</h2>
      case 'paragraph':
        return <p className="text-zinc-300 mt-2">{block.content}</p>
      case 'points':
        return <ul className="list-disc ml-6 text-zinc-200">{block.content.split('\n').map((p, i) => <li key={i}>{p}</li>)}</ul>
      case 'code':
        return <pre className="bg-black text-green-400 p-3 rounded-lg overflow-x-auto">{block.content}</pre>
      case 'table':
        return <pre className="bg-zinc-900 p-3 rounded-lg">{block.content}</pre>
      case 'quote':
        return <blockquote className="border-l-4 border-amber-400 pl-4 italic text-zinc-200">{block.content}</blockquote>
      case 'checklist':
        return <ul className="text-zinc-200">{block.content.split('\n').map((c, i) => <li key={i}>{c}</li>)}</ul>
      case 'image':
        return block.content ? <img src={block.content} alt="Image preview" className="rounded-md" /> : <div className="text-sm text-gray-400 italic">No image URL</div>
      case 'video':
        return block.content ? (
          <div className="w-full rounded-md overflow-hidden">
            <iframe src={block.content} className="w-full h-auto" style={{ minHeight: '200px', height: 'auto' }} allowFullScreen />
          </div>
        ) : <div className="text-sm text-gray-400 italic">No video URL</div>
      case 'attachment':
        return block.content ? <a href={block.content} target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">Attachment</a> : <div className="text-sm text-gray-400 italic">No attachment URL</div>
      case 'reference':
        return block.content ? <a href={block.content} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Reference</a> : <div className="text-sm text-gray-400 italic">No reference URL</div>
      case 'embed':
        if (!block.content) return <div className="text-sm text-gray-400 italic">No embed content</div>
        // Force iframe embeds to be responsive (full width, auto height) when possible
        try {
          const embedded = block.content.replace(/<iframe([^>]*)>/i, '<iframe$1 style="width:100%;height:auto;" width="100%" height="auto">')
          return <div className="w-full rounded-md overflow-hidden" dangerouslySetInnerHTML={{ __html: embedded }} />
        } catch (e) {
          return <div dangerouslySetInnerHTML={{ __html: block.content }} />
        }
      case 'callout':
        return <div className="bg-amber-400/10 border border-amber-400/30 p-4 rounded-xl text-amber-300">{block.content}</div>
      case 'divider':
        return <hr className="border-zinc-800 my-4" />
      default:
        return null
    }
  }

  /* =========================
     MAIN RENDER
  ========================== */
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6 space-y-6">
        {/* EDITOR - dark card to match site palette */}
        <div className="bg-[#141414] p-6 rounded-lg border border-gray-700/50">
            <h2 className="text-lg font-semibold my-3 text-gray-100">Create Blocks</h2>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <select
                className="bg-[#141414] text-gray-200 border border-gray-700 rounded-md px-3 py-2 text-sm md:hidden"
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
              >
                <option value="">Add block</option>
                {BLOCK_TYPES.map(b => (
                  <option key={b.type} value={b.type}>{b.label}</option>
                ))}
              </select>
              <button onClick={() => insertTagAt(null, selectedType)} className="bg-amber-400 hover:bg-amber-500 text-gray-900 px-3 py-2 rounded-md md:hidden">
                <FontAwesomeIcon icon={faPlus} />
              </button>

              <div className="hidden md:flex gap-2 flex-wrap">
                {BLOCK_TYPES.map(bt => (
                  <button key={bt.type} onClick={() => insertTagAt(null, bt.type)} className="text-sm px-2 py-1 rounded border border-gray-700/50 text-gray-200 hover:bg-gray-800">{bt.label}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <textarea
              ref={textareaRef}
              value={docText}
              onChange={e => setDocText(e.target.value)}
              onDoubleClick={handleDoubleClick}
              onTouchEnd={handleTouchEnd}
              className="w-full min-h-[60vh] h-[70vh] md:h-[80vh] p-4 rounded-md bg-[#0f0f0f] text-gray-100 border border-gray-800 focus:outline-none resize-none font-mono"
              placeholder="Type using tags like <Title-- My Title --Title/> or just write paragraphs."
            />
          </div> 
        </div>

        {/* PREVIEW (moved under editor) */}
        <div className="p-5 rounded-lg border border-gray-100 shadow">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Preview</h3>
            <div className="space-y-4">
              {parsedBlocks.map((block, idx) => <div key={idx}>{renderPreview(block)}</div>)}
            </div>
          </div> 

        {/* ACTIONS (below preview) */}
        <div className="flex justify-end gap-3">
          <button onClick={handleCancel} className="border border-amber-400 hover:bg-amber-400/10 text-amber-400 px-4 py-2 rounded-lg font-semibold text-sm">Cancel</button>
          <button 
            onClick={handleSave} 
            disabled={justSaved}
            className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors ${
              justSaved 
                ? "bg-green-600 text-white cursor-default" // Success State
                : "bg-amber-400 hover:bg-amber-500 text-gray-900" // Default State
            }`}
          >
            {justSaved ? "✓ Saved" : "Save"}
          </button>
        </div>

        {menuVisible && (
          <div id="context-block-menu" style={{ position: 'fixed', top: menuPos.y + 'px', left: menuPos.x + 'px', minWidth: '180px' }} className="z-50 bg-[#0f0f0f] text-gray-100 rounded-md shadow p-2">
            <div className="text-xs text-gray-400 px-2 pb-1">Insert block</div>

            {/* Scrollable list with a capped height */}
            <div style={{ maxHeight: '220px', overflowY: 'auto' }} className="mt-1 space-y-1">
              {BLOCK_TYPES.map(bt => (
                <button key={bt.type} onClick={() => insertTagAt(menuAnchor, bt.type)} className="w-full text-left px-3 py-2 rounded hover:bg-gray-800 flex items-center gap-3 text-sm">
                  <FontAwesomeIcon icon={bt.icon} className="text-amber-400" />
                  <span>{bt.label}</span>
                </button>
              ))} 
            </div>

            <div className="border-t border-gray-700 mt-2 pt-2">
              <button onClick={closeMenu} className="w-full text-left px-3 py-2 rounded hover:bg-gray-800 text-sm text-gray-300">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
