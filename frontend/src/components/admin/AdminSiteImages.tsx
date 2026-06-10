// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\admin\AdminSiteImages.tsx
import { useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload, Image as ImageIcon, CheckCircle, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { AdminPageHeader } from './AdminUI'

// ── Typing ────────────────────────────────────────────────────────
interface SiteSetting {
  id: string
  key: string
  image_url: string | null
  caption: string | null
  updated_at: string
}

// ── Human-readable labels for each setting key ───────────────────
const SETTING_META: Record<string, { label: string; description: string; emoji: string }> = {
  hero_background: {
    label: 'Homepage Hero Background',
    description: 'Full-width background image shown behind the main heading on the homepage.',
    emoji: '🏠',
  },
  founder_portrait: {
    label: "Founder Portrait (Halimot's Photo)",
    description: 'Portrait photo shown in the "From Healing to Flourishing" section on the homepage and About page.',
    emoji: '👩‍🍳',
  },
  about_image_1: {
    label: 'About Page — Image 1',
    description: 'First supporting image on the About page.',
    emoji: '🎂',
  },
  about_image_2: {
    label: 'About Page — Image 2 / CIC Section',
    description: 'Second about page image, also used in the CIC section.',
    emoji: '❤️',
  },
}

// ── Single image card ─────────────────────────────────────────────
function SiteImageCard({ setting }: { setting: SiteSetting }) {
  const qc = useQueryClient()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const meta = SETTING_META[setting.key] ?? {
    label: setting.key,
    description: '',
    emoji: '🖼️',
  }

  const upload = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData()
      fd.append('file', file)
      return api.post(`/api/v1/site-settings/${setting.key}/image`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['site-settings'] })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    },
  })

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    // Show local preview immediately
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target?.result as string)
    reader.readAsDataURL(file)
    upload.mutate(file)
    // Reset input so same file can be re-selected if needed
    e.target.value = ''
  }

  const displayUrl = preview ?? setting.image_url

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden"
      style={{ border: '1px solid var(--cream)', boxShadow: 'var(--shadow-luxury-sm)' }}
    >
      {/* Image preview area */}
      <div
        className="relative aspect-video overflow-hidden cursor-pointer group"
        style={{
          background: displayUrl
            ? 'black'
            : 'var(--cream)',
        }}
        onClick={() => inputRef.current?.click()}
      >
        {displayUrl ? (
          <img
            src={displayUrl}
            alt={meta.label}
            className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-70"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="text-4xl">{meta.emoji}</span>
            <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>
              No image uploaded yet
            </p>
          </div>
        )}

        {/* Hover upload overlay */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: 'rgba(0,0,0,0.55)' }}
        >
          {upload.isPending ? (
            <Loader2 size={28} className="text-white animate-spin" />
          ) : (
            <>
              <Upload size={24} className="text-white" />
              <p className="font-sans text-xs text-white font-medium">
                {displayUrl ? 'Replace image' : 'Upload image'}
              </p>
            </>
          )}
        </div>

        {/* Success badge */}
        {success && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-white"
            style={{ background: '#16A34A' }}>
            <CheckCircle size={13} />
            Saved
          </div>
        )}

        {/* Upload spinner overlay */}
        {upload.isPending && (
          <div className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.4)' }}>
            <Loader2 size={32} className="text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="font-sans text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {meta.label}
          </h3>
          {setting.image_url && (
            <span
              className="flex-shrink-0 font-sans text-xs px-2 py-0.5 rounded-full"
              style={{ background: '#F0FDF4', color: '#16A34A' }}
            >
              Uploaded
            </span>
          )}
        </div>
        <p className="font-sans text-xs leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
          {meta.description}
        </p>

        {setting.image_url && (
          <p className="font-sans text-xs mb-4 truncate" style={{ color: 'var(--text-muted)' }}>
            Last updated: {new Date(setting.updated_at).toLocaleDateString('en-GB', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </p>
        )}

        {/* Upload error */}
        {upload.isError && (
          <p className="font-sans text-xs mb-3 px-3 py-2 rounded-lg"
            style={{ background: '#FEF2F2', color: '#DC2626' }}>
            Upload failed — please try again.
          </p>
        )}

        <button
          onClick={() => inputRef.current?.click()}
          disabled={upload.isPending}
          className="btn-primary w-full justify-center text-xs py-2.5"
        >
          {upload.isPending ? (
            <><Loader2 size={13} className="animate-spin" /> Uploading…</>
          ) : (
            <><ImageIcon size={13} /> {setting.image_url ? 'Replace Image' : 'Upload Image'}</>
          )}
        </button>

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────
export default function AdminSiteImages() {
  const { data: settings = [], isLoading } = useQuery<SiteSetting[]>({
    queryKey: ['site-settings'],
    queryFn: async () => (await api.get('/api/v1/site-settings')).data,
  })

  // Ensure we always show all 4 cards, even before data loads
  const ORDERED_KEYS = ['hero_background', 'founder_portrait', 'about_image_1', 'about_image_2']

  const settingMap = Object.fromEntries(settings.map(s => [s.key, s]))

  return (
    <div>
      <AdminPageHeader
        title="Site Images"
        subtitle="Upload the hero, portrait and about page photos shown on the public website"
      />

      <div
        className="rounded-2xl p-5 mb-8 flex items-start gap-3"
        style={{ background: 'linear-gradient(135deg,#FDF7F2,#FFF8F4)', border: '1px solid var(--apricot)' }}
      >
        <span className="text-xl flex-shrink-0 mt-0.5">💡</span>
        <div>
          <p className="font-sans text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
            Images go live immediately
          </p>
          <p className="font-sans text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Click any card or the Upload button to replace an image. Recommended formats: JPEG or WebP.
            For best results use high-resolution photos (at least 1200px wide for hero, square crop for portrait).
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="rounded-2xl overflow-hidden animate-pulse"
              style={{ border: '1px solid var(--cream)' }}>
              <div className="aspect-video" style={{ background: 'var(--cream)' }} />
              <div className="p-5 space-y-2">
                <div className="h-4 w-2/3 rounded-full" style={{ background: 'var(--apricot)' }} />
                <div className="h-3 w-full rounded-full" style={{ background: 'var(--cream)' }} />
                <div className="h-8 w-full rounded-xl mt-3" style={{ background: 'var(--cream)' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {ORDERED_KEYS.map(key => {
            const setting = settingMap[key]
            if (!setting) return null
            return <SiteImageCard key={key} setting={setting} />
          })}
        </div>
      )}
    </div>
  )
}