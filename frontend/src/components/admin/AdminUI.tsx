// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\admin\AdminUI.tsx
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

/* ── Shared input / label styles exported as constants ────────── */
export const inputCls =
  'w-full px-4 py-2.5 rounded-xl font-sans text-sm outline-none transition-colors ' +
  'border border-[#E0D0C5] bg-[#FDF7F2] text-[var(--text-primary)] ' +
  'focus:border-[var(--peach)] focus:ring-2 focus:ring-[var(--peach)]/20'

export const labelCls =
  'block font-sans text-xs font-medium mb-1.5 text-[var(--text-secondary)]'

export const selectCls = inputCls + ' cursor-pointer'

/* ── Confirm / delete dialog ───────────────────────────────────── */
interface ConfirmProps {
  open: boolean
  title: string
  body: string
  confirmLabel?: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open, title, body, confirmLabel = 'Delete', loading, onConfirm, onCancel,
}: ConfirmProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-luxury-lg"
              initial={{ scale: 0.9, y: 16 }} animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 16 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-red-50">
                  <AlertTriangle size={18} className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-lg text-[var(--text-primary)]">{title}</h3>
                  <p className="font-sans text-sm mt-1 text-[var(--text-secondary)]">{body}</p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={onCancel}
                  className="px-5 py-2.5 rounded-xl font-sans text-sm border border-[#E0D0C5] text-[var(--text-secondary)] hover:bg-[var(--cream)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl font-sans text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Deleting…' : confirmLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ── Empty state placeholder ───────────────────────────────────── */
export function EmptyState({ emoji = '📭', title, body, action }: {
  emoji?: string; title: string; body?: string; action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-5xl mb-4">{emoji}</p>
      <p className="font-serif text-xl mb-2 text-[var(--text-primary)]">{title}</p>
      {body && <p className="font-sans text-sm text-[var(--text-muted)] mb-5 max-w-xs">{body}</p>}
      {action}
    </div>
  )
}

/* ── Section page header with title + action button ───────────── */
export function AdminPageHeader({ title, subtitle, action }: {
  title: string; subtitle?: string; action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="font-serif font-semibold text-[var(--text-primary)]" style={{ fontSize: '1.75rem' }}>
          {title}
        </h1>
        {subtitle && (
          <p className="font-sans text-sm mt-1 text-[var(--text-muted)]">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  )
}

/* ── Slide-in drawer / modal ───────────────────────────────────── */
export function AdminDrawer({ open, title, onClose, children }: {
  open: boolean; title: string; onClose: () => void; children: React.ReactNode
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-white shadow-luxury-lg flex flex-col"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          >
            {/* Drawer header */}
            <div
              className="flex items-center justify-between px-6 py-5 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--cream)', background: 'white' }}
            >
              <h2 className="font-serif font-semibold text-[var(--text-primary)]" style={{ fontSize: '1.25rem' }}>
                {title}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/60 transition-colors"
              >
                <X size={17} className="text-[var(--text-secondary)]" />
              </button>
            </div>
            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {children}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

/* ── Badge ─────────────────────────────────────────────────────── */
export function Badge({ label, colour = 'peach' }: { label: string; colour?: 'peach' | 'green' | 'red' | 'grey' }) {
  const map = {
    peach: { bg: 'var(--apricot)',  text: 'var(--text-secondary)' },
    green: { bg: '#F0FDF4',         text: '#16A34A' },
    red:   { bg: '#FEF2F2',         text: '#DC2626' },
    grey:  { bg: 'var(--cream)',    text: 'var(--text-muted)' },
  }
  const { bg, text } = map[colour]
  return (
    <span
      className="inline-block font-sans text-xs font-medium px-2.5 py-1 rounded-full capitalize"
      style={{ background: bg, color: text }}
    >
      {label}
    </span>
  )
}