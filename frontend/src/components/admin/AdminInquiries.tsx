// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\admin\AdminInquiries.tsx
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Mail, MailOpen, Trash2, Phone, Calendar, Tag, ExternalLink } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { inquiryApi } from '@/lib/api'
import { AdminPageHeader, ConfirmDialog, EmptyState, Badge, AdminDrawer } from './AdminUI'
import type { Inquiry } from '@/types'

const SERVICE_LABELS: Record<string, string> = {
  wedding_cake:   'Wedding Cake',
  birthday_cake:  'Birthday Cake',
  cupcakes:       'Cupcakes',
  dessert_box:    'Dessert Box',
  luxury_treats:  'Luxury Treats',
  cake_class:     'Cake Class',
  cic_programme:  'CIC Programme',
  general:        'General',
}

const FILTER_TABS = [
  { value: 'all',    label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'read',   label: 'Read' },
]

/* ── Inquiry detail drawer ────────────────────────────────────── */
function InquiryDetail({ inquiry }: { inquiry: Inquiry }) {
  return (
    <div className="space-y-6">
      {/* Contact info */}
      <div className="rounded-2xl p-5 space-y-3" style={{ background: '#FDF7F2', border: '1px solid var(--cream)' }}>
        <h3 className="font-sans text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
          Contact Details
        </h3>
        {[
          { icon: <Mail size={14}/>,     label: 'Email',   value: inquiry.email,    href: `mailto:${inquiry.email}` },
          { icon: <Phone size={14}/>,    label: 'Phone',   value: inquiry.phone ?? 'Not provided', href: inquiry.phone ? `tel:${inquiry.phone}` : undefined },
          { icon: <Tag size={14}/>,      label: 'Service', value: SERVICE_LABELS[inquiry.service_type] ?? inquiry.service_type, href: undefined },
          { icon: <Calendar size={14}/>, label: 'Received',value: new Date(inquiry.created_at).toLocaleString('en-GB', { dateStyle:'full', timeStyle:'short' }), href: undefined },
        ].map(({ icon, label, value, href }) => (
          <div key={label} className="flex items-start gap-3">
            <span style={{ color: 'var(--peach)' }} className="mt-0.5 flex-shrink-0">{icon}</span>
            <div className="min-w-0">
              <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
              {href ? (
                <a href={href} className="font-sans text-sm font-medium hover:text-[var(--peach)] transition-colors flex items-center gap-1 break-all"
                  style={{ color: 'var(--text-primary)' }}>
                  {value} <ExternalLink size={11}/>
                </a>
              ) : (
                <p className="font-sans text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Optional fields */}
      {(inquiry.event_date || inquiry.budget_range) && (
        <div className="rounded-2xl p-5 space-y-3" style={{ background: '#FDF7F2', border: '1px solid var(--cream)' }}>
          <h3 className="font-sans text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
            Event Details
          </h3>
          {inquiry.event_date && (
            <div>
              <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>Event Date</p>
              <p className="font-sans text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {new Date(inquiry.event_date).toLocaleDateString('en-GB', { dateStyle: 'full' })}
              </p>
            </div>
          )}
          {inquiry.budget_range && (
            <div>
              <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>Budget Range</p>
              <p className="font-sans text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{inquiry.budget_range}</p>
            </div>
          )}
        </div>
      )}

      {/* Message */}
      <div>
        <h3 className="font-sans text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: 'var(--text-muted)' }}>
          Message
        </h3>
        <div className="rounded-2xl p-5 font-sans text-sm leading-relaxed whitespace-pre-wrap"
          style={{ background: 'white', border: '1px solid var(--cream)', color: 'var(--text-primary)' }}>
          {inquiry.message}
        </div>
      </div>

      {/* Reply button */}
      <a
        href={`mailto:${inquiry.email}?subject=Re: Your Haliberry Cake Enquiry&body=Hi ${inquiry.name.split(' ')[0]},%0D%0A%0D%0AThank you for getting in touch with Haliberry Cake.%0D%0A%0D%0A`}
        className="btn-primary w-full justify-center block text-center"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Mail size={15} />
        Reply via Email
      </a>
    </div>
  )
}

/* ── Inquiry row ──────────────────────────────────────────────── */
function InquiryRow({
  inquiry,
  onOpen,
  onDelete,
}: {
  inquiry: Inquiry
  onOpen: (i: Inquiry) => void
  onDelete: (i: Inquiry) => void
}) {
  const preview = inquiry.message.length > 80 ? inquiry.message.slice(0, 80) + '…' : inquiry.message

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-start gap-4 p-5 cursor-pointer hover:bg-[rgba(0,0,0,0.02)] transition-colors group rounded-2xl"
      style={{
        border: '1px solid var(--cream)',
        background: inquiry.is_read ? 'white' : 'rgba(0,0,0,0.02)',
      }}
      onClick={() => onOpen(inquiry)}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: inquiry.is_read ? 'var(--cream)' : 'rgba(0,0,0,0.02)' }}
      >
        {inquiry.is_read
          ? <MailOpen size={16} style={{ color: 'var(--text-muted)' }} />
          : <Mail size={16} style={{ color: 'var(--peach)' }} />
        }
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <p className="font-sans text-sm font-semibold" style={{ color: inquiry.is_read ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
            {inquiry.name}
          </p>
          <Badge label={SERVICE_LABELS[inquiry.service_type] ?? inquiry.service_type} colour="peach" />
          {!inquiry.is_read && (
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'var(--peach)' }} />
          )}
        </div>
        <p className="font-sans text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{inquiry.email}</p>
        <p className="font-sans text-sm" style={{ color: 'var(--text-secondary)' }}>{preview}</p>
      </div>

      {/* Right — date + actions */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>
          {new Date(inquiry.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </p>
        <button
          onClick={e => { e.stopPropagation(); onDelete(inquiry) }}
          className="w-7 h-7 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
          title="Delete"
        >
          <Trash2 size={13} className="text-red-400" />
        </button>
      </div>
    </motion.div>
  )
}

/* ── Main Inquiries Page ──────────────────────────────────────── */
export default function AdminInquiries() {
  const qc = useQueryClient()
  const [filter, setFilter]         = useState<'all' | 'unread' | 'read'>('all')
  const [selected, setSelected]     = useState<Inquiry | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null)

  const { data: inquiries = [], isLoading } = useQuery<Inquiry[]>({
    queryKey: ['admin-inquiries-full'],
    queryFn: async () => { const r = await inquiryApi.list(); return r.data },
    refetchInterval: 60_000, // auto-refresh every minute
  })

  const markRead = useMutation({
    mutationFn: (id: string) => inquiryApi.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-inquiries-full'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => inquiryApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-inquiries-full'] })
      setDeleteTarget(null)
      if (selected?.id === deleteTarget?.id) setSelected(null)
    },
  })

  function openInquiry(inquiry: Inquiry) {
    setSelected(inquiry)
    if (!inquiry.is_read) markRead.mutate(String(inquiry.id))
  }

  const unreadCount = inquiries.filter(i => !i.is_read).length

  const displayed = inquiries.filter(i => {
    if (filter === 'unread') return !i.is_read
    if (filter === 'read')   return i.is_read
    return true
  })

  return (
    <div>
      <AdminPageHeader
        title="Inquiries"
        subtitle={`${inquiries.length} total · ${unreadCount} unread`}
      />

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTER_TABS.map(tab => {
          const count = tab.value === 'all' ? inquiries.length
            : tab.value === 'unread' ? unreadCount
            : inquiries.length - unreadCount
          return (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as typeof filter)}
              className="px-4 py-2 rounded-full font-sans text-sm font-medium transition-all"
              style={{
                background: filter === tab.value ? 'var(--peach)' : '#FDF7F2',
                color:      filter === tab.value ? 'white' : 'var(--text-secondary)',
                border:     `1.5px solid ${filter === tab.value ? 'var(--peach)' : '#E0D0C5'}`,
              }}
            >
              {tab.label}
              <span className="ml-1.5 font-sans text-xs opacity-75">({count})</span>
            </button>
          )
        })}
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'var(--cream)' }} />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <EmptyState
          emoji="📭"
          title={filter === 'unread' ? 'No unread messages' : 'No inquiries yet'}
          body="When customers submit the contact form, their messages appear here."
        />
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {displayed.map(inquiry => (
              <InquiryRow
                key={inquiry.id}
                inquiry={inquiry}
                onOpen={openInquiry}
                onDelete={setDeleteTarget}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Detail drawer */}
      <AdminDrawer
        open={!!selected}
        title={selected ? `${selected.name} — ${SERVICE_LABELS[selected.service_type] ?? selected.service_type}` : ''}
        onClose={() => setSelected(null)}
      >
        {selected && <InquiryDetail inquiry={selected} />}
      </AdminDrawer>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Inquiry"
        body={`Permanently delete the inquiry from ${deleteTarget?.name}? This cannot be undone.`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(String(deleteTarget.id))}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}