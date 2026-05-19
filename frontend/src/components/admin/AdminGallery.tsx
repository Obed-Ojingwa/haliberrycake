// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\admin\AdminGallery.tsx
import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload, Trash2, Star, StarOff, Tag, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { galleryApi } from '@/lib/api'
import { AdminPageHeader, ConfirmDialog, EmptyState, Badge, labelCls, selectCls } from './AdminUI'
import type { GalleryItem } from '@/types'

const CATEGORIES = ['wedding','birthday','cupcakes','desserts','treats','classes','events','general']

/* ── Drop zone ────────────────────────────────────────────────── */
function DropZone({ onFiles }: { onFiles: (files: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    if (files.length) onFiles(files)
  }

  return (
    <div
      className="border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200"
      style={{
        borderColor: dragging ? 'var(--peach)' : '#E0D0C5',
        background: dragging ? 'var(--apricot)' : '#FDF7F2',
      }}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={e => {
          const files = Array.from(e.target.files ?? [])
          if (files.length) onFiles(files)
          e.target.value = ''
        }}
      />
      <Upload size={28} className="mx-auto mb-3" style={{ color: 'var(--peach)' }} />
      <p className="font-sans text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
        Drop images here or click to browse
      </p>
      <p className="font-sans text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
        JPEG, PNG, WebP — max 8 MB each
      </p>
    </div>
  )
}

/* ── Upload queue item ────────────────────────────────────────── */
interface QueueItem {
  file: File
  preview: string
  category: string
  caption: string
  status: 'idle' | 'uploading' | 'done' | 'error'
}

function UploadQueuePanel({
  queue,
  onCategoryChange,
  onCaptionChange,
  onRemove,
  onUploadAll,
  uploading,
}: {
  queue: QueueItem[]
  onCategoryChange: (idx: number, cat: string) => void
  onCaptionChange: (idx: number, cap: string) => void
  onRemove: (idx: number) => void
  onUploadAll: () => void
  uploading: boolean
}) {
  if (queue.length === 0) return null

  return (
    <div className="mt-6 rounded-2xl border border-[var(--cream)] bg-white overflow-hidden shadow-luxury-sm">
      <div className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--cream)', background: '#FDF7F2' }}>
        <p className="font-sans text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {queue.length} image{queue.length !== 1 ? 's' : ''} ready to upload
        </p>
        <button
          onClick={onUploadAll}
          disabled={uploading}
          className="btn-primary text-xs py-2 px-5"
        >
          {uploading ? 'Uploading…' : `Upload All`}
        </button>
      </div>

      <div className="divide-y divide-[var(--cream)]">
        {queue.map((item, idx) => (
          <div key={item.preview} className="flex gap-4 p-4 items-start">
            {/* Preview */}
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--cream)] relative">
              <img src={item.preview} alt="" className="w-full h-full object-cover" />
              {item.status === 'uploading' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {item.status === 'done' && (
                <div className="absolute inset-0 bg-green-500/70 flex items-center justify-center">
                  <span className="text-white text-lg">✓</span>
                </div>
              )}
              {item.status === 'error' && (
                <div className="absolute inset-0 bg-red-500/70 flex items-center justify-center">
                  <span className="text-white text-xs">Err</span>
                </div>
              )}
            </div>

            {/* Meta inputs */}
            <div className="flex-1 grid grid-cols-2 gap-3 min-w-0">
              <div>
                <label className={labelCls}><Tag size={11} className="inline mr-1"/>Category</label>
                <select
                  value={item.category}
                  onChange={e => onCategoryChange(idx, e.target.value)}
                  className={selectCls}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Caption (optional)</label>
                <input
                  value={item.caption}
                  onChange={e => onCaptionChange(idx, e.target.value)}
                  placeholder="e.g. Three-tier wedding cake…"
                  className="w-full px-3 py-2 rounded-xl font-sans text-sm border border-[#E0D0C5] bg-[#FDF7F2] outline-none focus:border-[var(--peach)] transition-colors"
                />
              </div>
            </div>

            {/* Remove */}
            <button
              onClick={() => onRemove(idx)}
              disabled={item.status === 'uploading'}
              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors flex-shrink-0"
            >
              <X size={14} className="text-red-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Existing gallery grid ────────────────────────────────────── */
function GalleryGrid({
  items,
  onDelete,
  onToggleFeatured,
}: {
  items: GalleryItem[]
  onDelete: (item: GalleryItem) => void
  onToggleFeatured: (item: GalleryItem) => void
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <AnimatePresence>
        {items.map(item => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="group relative rounded-2xl overflow-hidden bg-[var(--cream)] aspect-square"
          >
            {item.image_url ? (
              <img
                src={item.image_url}
                alt={item.caption ?? ''}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">🎂</div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex flex-col items-center justify-center gap-2">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                {/* Featured toggle */}
                <button
                  onClick={() => onToggleFeatured(item)}
                  className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                  title={item.is_featured ? 'Remove from featured' : 'Set as featured'}
                >
                  {item.is_featured
                    ? <Star size={14} fill="var(--peach)" style={{ color: 'var(--peach)' }} />
                    : <StarOff size={14} className="text-gray-600" />
                  }
                </button>
                {/* Delete */}
                <button
                  onClick={() => onDelete(item)}
                  className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="Delete image"
                >
                  <Trash2 size={14} className="text-white" />
                </button>
              </div>
            </div>

            {/* Category badge */}
            <div className="absolute top-2 left-2">
              <Badge label={item.category} colour="grey" />
            </div>

            {/* Featured star */}
            {item.is_featured && (
              <div className="absolute top-2 right-2">
                <Star size={14} fill="var(--peach)" style={{ color: 'var(--peach)' }} />
              </div>
            )}

            {/* Caption tooltip */}
            {item.caption && (
              <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5 bg-gradient-to-t from-black/60 to-transparent">
                <p className="font-sans text-xs text-white truncate">{item.caption}</p>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

/* ── Main Gallery Admin Page ──────────────────────────────────── */
export default function AdminGallery() {
  const qc = useQueryClient()
  const [queue, setQueue]           = useState<QueueItem[]>([])
  const [uploading, setUploading]   = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null)
  const [catFilter, setCatFilter]   = useState('all')

  const { data: images = [], isLoading } = useQuery<GalleryItem[]>({
    queryKey: ['admin-gallery'],
    queryFn: async () => { const r = await galleryApi.list(); return r.data },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => galleryApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-gallery'] })
      setDeleteTarget(null)
    },
  })

  const featureMutation = useMutation({
    mutationFn: ({ id, is_featured }: { id: string; is_featured: boolean }) =>
      galleryApi.update(id, { is_featured }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-gallery'] }),
  })

  /* Add files to upload queue */
  function handleFiles(files: File[]) {
    const newItems: QueueItem[] = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      category: 'general',
      caption: '',
      status: 'idle',
    }))
    setQueue(prev => [...prev, ...newItems])
  }

  /* Upload all queued items */
  async function uploadAll() {
    setUploading(true)
    for (let i = 0; i < queue.length; i++) {
      const item = queue[i]
      if (item.status === 'done') continue
      setQueue(prev => prev.map((q, idx) => idx === i ? { ...q, status: 'uploading' } : q))
      try {
        await galleryApi.upload(item.file, item.category, item.caption || undefined)
        setQueue(prev => prev.map((q, idx) => idx === i ? { ...q, status: 'done' } : q))
      } catch {
        setQueue(prev => prev.map((q, idx) => idx === i ? { ...q, status: 'error' } : q))
      }
    }
    setUploading(false)
    qc.invalidateQueries({ queryKey: ['admin-gallery'] })
    // Clear done items after 1.5s
    setTimeout(() => setQueue(prev => prev.filter(q => q.status !== 'done')), 1500)
  }

  const displayed = catFilter === 'all'
    ? images
    : images.filter(img => img.category === catFilter)

  return (
    <div>
      <AdminPageHeader
        title="Gallery"
        subtitle={`${images.length} images in your portfolio`}
      />

      {/* Upload zone */}
      <DropZone onFiles={handleFiles} />

      {/* Upload queue */}
      <UploadQueuePanel
        queue={queue}
        onCategoryChange={(idx, cat) => setQueue(prev => prev.map((q, i) => i === idx ? { ...q, category: cat } : q))}
        onCaptionChange={(idx, cap) => setQueue(prev => prev.map((q, i) => i === idx ? { ...q, caption: cap } : q))}
        onRemove={idx => setQueue(prev => prev.filter((_, i) => i !== idx))}
        onUploadAll={uploadAll}
        uploading={uploading}
      />

      {/* Filter + grid */}
      <div className="mt-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', ...CATEGORIES].map(c => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className="px-3.5 py-1.5 rounded-full font-sans text-xs font-medium capitalize transition-all"
              style={{
                background: c === catFilter ? 'var(--peach)' : '#FDF7F2',
                color: c === catFilter ? 'white' : 'var(--text-secondary)',
                border: `1.5px solid ${c === catFilter ? 'var(--peach)' : '#E0D0C5'}`,
              }}
            >
              {c === 'all' ? 'All Images' : c} {c === 'all' ? `(${images.length})` : `(${images.filter(i=>i.category===c).length})`}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {[1,2,3,4,5,6,7,8,10].map(i => (
              <div key={i} className="aspect-square rounded-2xl bg-[var(--cream)] animate-pulse" />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <EmptyState
            emoji="🖼️"
            title="No images yet"
            body="Drag and drop images above to start building your gallery."
          />
        ) : (
          <GalleryGrid
            items={displayed}
            onDelete={setDeleteTarget}
            onToggleFeatured={item =>
              featureMutation.mutate({ id: String(item.id), is_featured: !item.is_featured })
            }
          />
        )}
      </div>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Image"
        body="This will permanently remove the image from your gallery and Supabase Storage."
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(String(deleteTarget.id))}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}