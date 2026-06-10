// C:\Users\Melody\Documents\haliberrycake\frontend\src\pages\admin\AdminDashboard.tsx
import { useState } from 'react'
import { Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  LayoutDashboard, Package, GalleryHorizontal, Star,
  MessageCircle, BookOpen, Heart, LogOut, Menu, X, Eye, Mail,
  Plus, Pencil, Trash2, CheckCircle, XCircle, Calendar, Clock, Users,
  ImageIcon,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { api, classesApi, testimonialsApi } from '@/lib/api'
import AdminProducts    from '@/components/admin/AdminProducts'
import AdminGallery     from '@/components/admin/AdminGallery'
import AdminInquiries   from '@/components/admin/AdminInquiries'
import AdminSiteImages  from '@/components/admin/AdminSiteImages'
import {
  AdminPageHeader, AdminDrawer, ConfirmDialog,
  EmptyState, Badge, inputCls, labelCls, selectCls,
} from '@/components/admin/AdminUI'
import type { CakeClass, Testimonial } from '@/types'

// ── Sidebar nav ───────────────────────────────────────────────────
const NAV = [
  { label: 'Overview',     href: '/admin',              icon: <LayoutDashboard size={18}/> },
  { label: 'Products',     href: '/admin/products',     icon: <Package size={18}/> },
  { label: 'Classes',      href: '/admin/classes',      icon: <BookOpen size={18}/> },
  { label: 'Gallery',      href: '/admin/gallery',      icon: <GalleryHorizontal size={18}/> },
  { label: 'Site Images',  href: '/admin/site-images',  icon: <ImageIcon size={18}/> },
  { label: 'Testimonials', href: '/admin/reviews',      icon: <Star size={18}/> },
  { label: 'Inquiries',    href: '/admin/inquiries',    icon: <MessageCircle size={18}/> },
  { label: 'CIC',          href: '/admin/cic',          icon: <Heart size={18}/> },
]

// ── Stat card ─────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, colour }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; colour: string
}) {
  return (
    <motion.div
      className="rounded-2xl p-6 flex items-start gap-4 bg-white border border-[var(--cream)]"
      style={{ boxShadow: 'var(--shadow-luxury-sm)' }}
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${colour}22`, color: colour }}>{icon}</div>
      <div>
        <p className="font-sans text-xs font-medium tracking-widest uppercase mb-1 text-[var(--text-muted)]">{label}</p>
        <p className="font-serif font-bold text-[var(--text-primary)]" style={{ fontSize: '2rem', lineHeight: 1 }}>{value}</p>
        {sub && <p className="font-sans text-xs mt-1 text-[var(--text-muted)]">{sub}</p>}
      </div>
    </motion.div>
  )
}

// ── Overview ──────────────────────────────────────────────────────
function Overview() {
  const { data: products }  = useQuery({ queryKey: ['admin-products-count'],  queryFn: async () => (await api.get('/api/v1/products?page_size=1')).data })
  const { data: inquiries } = useQuery({ queryKey: ['admin-inquiries-count'], queryFn: async () => (await api.get('/api/v1/inquiries')).data })
  const { data: classes }   = useQuery({ queryKey: ['admin-classes-count'],   queryFn: async () => (await api.get('/api/v1/classes')).data })
  const { data: gallery }   = useQuery({ queryKey: ['admin-gallery-count'],   queryFn: async () => (await api.get('/api/v1/gallery')).data })

  const inqList = (inquiries as { id:string; name:string; email:string; service_type:string; created_at:string; is_read:boolean }[] | undefined) ?? []
  const unread  = inqList.filter(i => !i.is_read).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif font-semibold text-[var(--text-primary)]" style={{ fontSize: '2rem' }}>Good day 👋</h1>
        <p className="font-sans text-sm mt-1 text-[var(--text-muted)]">Here's your Haliberry Cake platform at a glance.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard icon={<Package size={22}/>}           label="Products"  value={(products as {total?:number}|undefined)?.total ?? '—'} sub="In collection"     colour="var(--peach)"/>
        <StatCard icon={<Mail size={22}/>}              label="Inquiries" value={inqList.length}                                        sub={`${unread} unread`} colour="#E53935"/>
        <StatCard icon={<BookOpen size={22}/>}          label="Classes"   value={(classes as unknown[])?.length ?? '—'}                 sub="Upcoming"           colour="var(--blush)"/>
        <StatCard icon={<GalleryHorizontal size={22}/>} label="Gallery"   value={(gallery as unknown[])?.length ?? '—'}                 sub="Images"             colour="var(--golden)"/>
      </div>
      {/* Recent inquiries */}
      <div className="rounded-2xl overflow-hidden bg-white border border-[var(--cream)]" style={{ boxShadow: 'var(--shadow-luxury-sm)' }}>
        <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--cream)', background: '#FDF7F2' }}>
          <h2 className="font-serif font-semibold text-[var(--text-primary)]" style={{ fontSize: '1.15rem' }}>Recent Inquiries</h2>
          <Link to="/admin/inquiries" className="font-sans text-xs text-[var(--text-muted)] hover:text-[var(--peach)] transition-colors">View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr style={{ background: '#FDF7F2' }}>
              {['Name','Email','Service','Date','Status'].map(h => (
                <th key={h} className="font-sans text-xs font-medium tracking-widest uppercase text-left px-6 py-3 text-[var(--text-muted)]">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {inqList.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center font-sans text-sm text-[var(--text-muted)]">No inquiries yet</td></tr>
              ) : inqList.slice(0,6).map((inq, i) => (
                <tr key={inq.id} className="hover:bg-[#FDF7F2] transition-colors" style={{ borderTop:'1px solid var(--cream)', background: i%2===0?'white':'#FEFCFB' }}>
                  <td className="px-6 py-4 font-sans text-sm font-medium text-[var(--text-primary)]">{inq.name}</td>
                  <td className="px-6 py-4 font-sans text-sm text-[var(--text-secondary)]">{inq.email}</td>
                  <td className="px-6 py-4"><span className="font-sans text-xs px-2.5 py-1 rounded-full capitalize" style={{ background:'var(--apricot)', color:'var(--text-secondary)' }}>{inq.service_type.replace(/_/g,' ')}</span></td>
                  <td className="px-6 py-4 font-sans text-sm text-[var(--text-muted)]">{new Date(inq.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</td>
                  <td className="px-6 py-4"><span className="font-sans text-xs px-2.5 py-1 rounded-full" style={{ background:inq.is_read?'#F0FDF4':'#FEF2F2', color:inq.is_read?'#16A34A':'#DC2626' }}>{inq.is_read?'Read':'Unread'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Admin Cake Classes ────────────────────────────────────────────
function AdminClasses() {
  const qc = useQueryClient()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing]       = useState<CakeClass | null>(null)
  const [delTarget, setDelTarget]   = useState<CakeClass | null>(null)

  const { data: classes = [], isLoading } = useQuery<CakeClass[]>({
    queryKey: ['admin-classes-full'],
    queryFn: async () => (await classesApi.list({ upcoming_only: false })).data,
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Record<string,unknown>>()

  const save = useMutation({
    mutationFn: (data: Record<string,unknown>) =>
      editing ? classesApi.update(String(editing.id), data) : classesApi.create(data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-classes-full'] }); setDrawerOpen(false); reset() },
  })

  const del = useMutation({
    mutationFn: (id: string) => classesApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-classes-full'] }); setDelTarget(null) },
  })

  const openCreate = () => { setEditing(null); reset({}); setDrawerOpen(true) }
  const openEdit   = (c: CakeClass) => {
    setEditing(c)
    reset({
      title: c.title, description: c.description ?? '',
      class_date: c.class_date, duration_hours: c.duration_hours ?? c.duration,
      price: c.price, total_slots: c.total_slots, location: c.location ?? '',
      level: c.level ?? 'beginner',
    })
    setDrawerOpen(true)
  }

  return (
    <div>
      <AdminPageHeader
        title="Cake Classes"
        subtitle={`${classes.length} classes`}
        action={<button onClick={openCreate} className="btn-primary text-sm py-2.5"><Plus size={16}/> Add Class</button>}
      />

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-20 rounded-2xl animate-pulse bg-[var(--cream)]"/>)}</div>
      ) : classes.length === 0 ? (
        <EmptyState emoji="📅" title="No classes yet" body="Add your first baking class." action={<button onClick={openCreate} className="btn-primary text-sm">Add Class</button>}/>
      ) : (
        <div className="space-y-4">
          {classes.map(cls => (
            <div key={String(cls.id)} className="bg-white border border-[var(--cream)] rounded-2xl p-5 flex flex-wrap items-start justify-between gap-4 group" style={{ boxShadow:'var(--shadow-luxury-sm)' }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge label={cls.level ?? 'beginner'} colour="peach"/>
                  <Badge label={cls.is_active ? 'Active' : 'Inactive'} colour={cls.is_active ? 'green' : 'grey'}/>
                </div>
                <h3 className="font-serif font-semibold text-[var(--text-primary)] text-lg mb-1">{cls.title}</h3>
                <div className="flex flex-wrap gap-4 mt-2">
                  {[
                    { icon:<Calendar size={13}/>, text: new Date(cls.class_date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}) },
                    { icon:<Clock size={13}/>,    text: `${cls.duration_hours ?? cls.duration}h` },
                    { icon:<Users size={13}/>,    text: `${cls.booked_slots ?? 0}/${cls.total_slots} booked` },
                  ].map(({ icon, text }) => (
                    <span key={text} className="flex items-center gap-1 font-sans text-xs text-[var(--text-muted)]">
                      <span className="text-[var(--peach)]">{icon}</span>{text}
                    </span>
                  ))}
                  <span className="font-sans text-xs font-semibold text-[var(--peach)]">£{cls.price}</span>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(cls)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--cream)] transition-colors"><Pencil size={14} className="text-[var(--text-secondary)]"/></button>
                <button onClick={() => setDelTarget(cls)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"><Trash2 size={14} className="text-red-400"/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminDrawer open={drawerOpen} title={editing ? 'Edit Class' : 'Add New Class'} onClose={() => setDrawerOpen(false)}>
        <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-4">
          <div><label className={labelCls}>Title *</label><input {...register('title', {required:true})} className={inputCls} placeholder="e.g. Beginner Buttercream Workshop"/>{errors.title && <p className="text-red-500 text-xs mt-1">Required</p>}</div>
          <div><label className={labelCls}>Description</label><textarea {...register('description')} rows={3} className={inputCls} style={{resize:'none'}}/></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Date *</label><input {...register('class_date',{required:true})} type="date" className={inputCls}/></div>
            <div><label className={labelCls}>Duration (hours) *</label><input {...register('duration_hours',{required:true})} type="number" step="0.5" className={inputCls} placeholder="3"/></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Price (£) *</label><input {...register('price',{required:true})} type="number" step="0.01" className={inputCls}/></div>
            <div><label className={labelCls}>Total Slots *</label><input {...register('total_slots',{required:true})} type="number" className={inputCls}/></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className={labelCls}>Level</label>
              <select {...register('level')} className={selectCls}>
                {['beginner','intermediate','advanced'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Location</label><input {...register('location')} className={inputCls} placeholder="London"/></div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input {...register('is_active')} type="checkbox" defaultChecked className="w-4 h-4 accent-[var(--peach)]"/>
            <span className="font-sans text-sm text-[var(--text-secondary)]">Active (visible to public)</span>
          </label>
          <button type="submit" disabled={save.isPending} className="btn-primary w-full justify-center">
            {save.isPending ? 'Saving…' : editing ? 'Update Class' : 'Create Class'}
          </button>
        </form>
      </AdminDrawer>

      <ConfirmDialog
        open={!!delTarget} title="Delete Class"
        body={`Delete "${delTarget?.title}"? This cannot be undone.`}
        loading={del.isPending}
        onConfirm={() => delTarget && del.mutate(String(delTarget.id))}
        onCancel={() => setDelTarget(null)}
      />
    </div>
  )
}

// ── Admin Testimonials ────────────────────────────────────────────
function AdminTestimonials() {
  const qc = useQueryClient()
  const [filter, setFilter] = useState<'all'|'pending'|'approved'>('all')
  const [delTarget, setDelTarget] = useState<Testimonial | null>(null)

  const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
    queryKey: ['admin-testimonials'],
    queryFn: async () => (await testimonialsApi.list()).data,
  })

  const approve = useMutation({
    mutationFn: (id: string) => testimonialsApi.update(id, { is_approved: true }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-testimonials'] }),
  })

  const feature = useMutation({
    mutationFn: ({ id, is_featured }: { id: string; is_featured: boolean }) =>
      testimonialsApi.update(id, { is_featured }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-testimonials'] }),
  })

  const del = useMutation({
    mutationFn: (id: string) => testimonialsApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-testimonials'] }); setDelTarget(null) },
  })

  const displayed = testimonials.filter(t => {
    if (filter === 'pending')  return !t.is_approved
    if (filter === 'approved') return t.is_approved
    return true
  })

  const pending = testimonials.filter(t => !t.is_approved).length

  return (
    <div>
      <AdminPageHeader title="Testimonials" subtitle={`${testimonials.length} total · ${pending} pending approval`}/>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { v:'all', l:'All', count: testimonials.length },
          { v:'pending', l:'Pending', count: pending },
          { v:'approved', l:'Approved', count: testimonials.length - pending },
        ].map(({ v, l, count }) => (
          <button key={v} onClick={() => setFilter(v as typeof filter)}
            className="px-4 py-2 rounded-full font-sans text-sm font-medium transition-all"
            style={{ background: filter===v?'var(--peach)':'#FDF7F2', color: filter===v?'white':'var(--text-secondary)', border:`1.5px solid ${filter===v?'var(--peach)':'#E0D0C5'}` }}>
            {l} ({count})
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-32 rounded-2xl animate-pulse bg-[var(--cream)]"/>)}</div>
      ) : displayed.length === 0 ? (
        <EmptyState emoji="⭐" title="No testimonials yet" body="Customer reviews submitted through the website will appear here."/>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {displayed.map(t => (
            <div key={String(t.id)} className="bg-white border border-[var(--cream)] rounded-2xl p-6 group" style={{ boxShadow:'var(--shadow-luxury-sm)' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-sans font-semibold text-sm text-[var(--text-primary)]">{t.customer_name}</p>
                  {t.customer_role && <p className="font-sans text-xs text-[var(--text-muted)]">{t.customer_role}</p>}
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge label={t.is_approved ? 'Approved' : 'Pending'} colour={t.is_approved ? 'green' : 'red'}/>
                  {t.is_featured && <Badge label="Featured" colour="peach"/>}
                </div>
              </div>
              <p className="font-sans text-sm text-[var(--text-secondary)] leading-relaxed mb-4 italic">"{t.message}"</p>
              <div className="flex items-center gap-2 flex-wrap">
                {!t.is_approved && (
                  <button onClick={() => approve.mutate(String(t.id))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                    <CheckCircle size={13}/> Approve
                  </button>
                )}
                <button
                  onClick={() => feature.mutate({ id: String(t.id), is_featured: !t.is_featured })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[var(--cream)] transition-colors"
                  style={{ background:'#FDF7F2', color:'var(--text-secondary)' }}>
                  <Star size={13}/> {t.is_featured ? 'Unfeature' : 'Feature'}
                </button>
                <button onClick={() => setDelTarget(t)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors ml-auto">
                  <XCircle size={13}/> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!delTarget} title="Delete Testimonial"
        body={`Delete review from "${delTarget?.customer_name}"?`}
        loading={del.isPending}
        onConfirm={() => delTarget && del.mutate(String(delTarget.id))}
        onCancel={() => setDelTarget(null)}
      />
    </div>
  )
}

// ── Admin CIC ─────────────────────────────────────────────────────
function AdminCIC() {
  const qc = useQueryClient()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editing, setEditing]       = useState<{id?:string;title?:string;description?:string;is_active?:boolean} | null>(null)
  const [delTarget, setDelTarget]   = useState<{id:string;title:string} | null>(null)

  const { data: programs = [], isLoading } = useQuery({
    queryKey: ['admin-cic'],
    queryFn: async () => (await api.get('/api/v1/cic')).data,
  })

  const { register, handleSubmit, reset } = useForm<Record<string,unknown>>()

  const save = useMutation({
    mutationFn: (data: Record<string,unknown>) =>
      editing?.id ? api.patch(`/api/v1/cic/${editing.id}`, data) : api.post('/api/v1/cic', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-cic'] }); setDrawerOpen(false); reset() },
  })

  const del = useMutation({
    mutationFn: (id: string) => api.delete(`/api/v1/cic/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-cic'] }); setDelTarget(null) },
  })

  const openCreate = () => { setEditing(null); reset({}); setDrawerOpen(true) }
  const openEdit = (p: {id?:string;title?:string;description?:string;is_active?:boolean}) => {
    setEditing(p); reset({ title: p.title, description: p.description, is_active: p.is_active }); setDrawerOpen(true)
  }

  return (
    <div>
      <AdminPageHeader
        title="CIC Programmes"
        subtitle="Manage your community impact programmes"
        action={<button onClick={openCreate} className="btn-primary text-sm py-2.5"><Plus size={16}/> Add Programme</button>}
      />

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-24 rounded-2xl animate-pulse bg-[var(--cream)]"/>)}</div>
      ) : (programs as {id:string;title:string;description?:string;is_active?:boolean}[]).length === 0 ? (
        <EmptyState emoji="❤️" title="No programmes yet" body="Add your first CIC programme." action={<button onClick={openCreate} className="btn-primary text-sm">Add Programme</button>}/>
      ) : (
        <div className="space-y-4">
          {(programs as {id:string;title:string;description?:string;is_active?:boolean}[]).map(p => (
            <div key={p.id} className="bg-white border border-[var(--cream)] rounded-2xl p-6 flex items-start justify-between gap-4 group" style={{ boxShadow:'var(--shadow-luxury-sm)' }}>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge label={p.is_active ? 'Active' : 'Inactive'} colour={p.is_active ? 'green' : 'grey'}/>
                </div>
                <h3 className="font-serif font-semibold text-[var(--text-primary)] text-lg">{p.title}</h3>
                {p.description && <p className="font-sans text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">{p.description}</p>}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--cream)] transition-colors"><Pencil size={14} className="text-[var(--text-secondary)]"/></button>
                <button onClick={() => setDelTarget(p)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"><Trash2 size={14} className="text-red-400"/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AdminDrawer open={drawerOpen} title={editing?.id ? 'Edit Programme' : 'Add Programme'} onClose={() => setDrawerOpen(false)}>
        <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-4">
          <div><label className={labelCls}>Title *</label><input {...register('title',{required:true})} className={inputCls} placeholder="e.g. Healing Through Baking"/></div>
          <div><label className={labelCls}>Description</label><textarea {...register('description')} rows={4} className={inputCls} style={{resize:'none'}} placeholder="Describe this programme and its impact…"/></div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input {...register('is_active')} type="checkbox" defaultChecked className="w-4 h-4 accent-[var(--peach)]"/>
            <span className="font-sans text-sm text-[var(--text-secondary)]">Active (visible on website)</span>
          </label>
          <button type="submit" disabled={save.isPending} className="btn-primary w-full justify-center">
            {save.isPending ? 'Saving…' : editing?.id ? 'Update Programme' : 'Create Programme'}
          </button>
        </form>
      </AdminDrawer>

      <ConfirmDialog
        open={!!delTarget} title="Delete Programme"
        body={`Delete "${delTarget?.title}"?`}
        loading={del.isPending}
        onConfirm={() => delTarget && del.mutate(delTarget.id)}
        onCancel={() => setDelTarget(null)}
      />
    </div>
  )
}

// ── Dashboard shell ───────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate        = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('haliberry_admin_token')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#F8F5F2' }}>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'var(--text-primary)' }}
      >
        <div className="px-6 py-7" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="font-serif font-bold text-white" style={{ fontSize: '1.3rem' }}>Haliberry</p>
          <p className="font-sans text-xs tracking-[0.18em] uppercase mt-0.5" style={{ color: 'var(--peach)' }}>Admin Dashboard</p>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {NAV.map(({ label, href, icon }) => (
            <NavLink key={href} to={href} end={href === '/admin'} onClick={() => setOpen(false)}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all ${isActive ? '' : 'hover:bg-white/5'}`}
              style={({ isActive }) => ({ background: isActive?'rgba(248,169,116,0.15)':'transparent', color: isActive?'var(--peach)':'rgba(255,255,255,0.55)' })}>
              {icon}{label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-sans text-sm hover:bg-white/5 transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <LogOut size={16}/> Sign Out
          </button>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)}/>}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-6 bg-white sticky top-0 z-20" style={{ boxShadow: 'var(--shadow-luxury-sm)' }}>
          <button className="lg:hidden" onClick={() => setOpen(v => !v)}>
            {open ? <X size={22} className="text-[var(--text-primary)]"/> : <Menu size={22} className="text-[var(--text-primary)]"/>}
          </button>
          <span className="hidden lg:block font-sans text-sm text-[var(--text-muted)]">Haliberry Cake · Admin</span>
          <div className="flex items-center gap-3">
            <Link to="/" target="_blank" className="font-sans text-xs flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-[var(--cream)] transition-colors text-[var(--text-secondary)]">
              <Eye size={14}/> View Site
            </Link>
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-sans font-semibold text-xs text-white" style={{ background: 'var(--peach)' }}>A</div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Routes>
            <Route index              element={<Overview />} />
            <Route path="products"    element={<AdminProducts />} />
            <Route path="classes"     element={<AdminClasses />} />
            <Route path="gallery"     element={<AdminGallery />} />
            <Route path="site-images" element={<AdminSiteImages />} />
            <Route path="reviews"     element={<AdminTestimonials />} />
            <Route path="inquiries"   element={<AdminInquiries />} />
            <Route path="cic"         element={<AdminCIC />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

// Latest

// // C:\Users\Melody\Documents\haliberrycake\frontend\src\pages\admin\AdminDashboard.tsx
// import { useState } from 'react'
// import { Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import {
//   LayoutDashboard, Package, GalleryHorizontal, Star,
//   MessageCircle, BookOpen, Heart, LogOut, Menu, X, Eye, Mail,
//   Plus, Pencil, Trash2, CheckCircle, XCircle, Calendar, Clock, Users,
// } from 'lucide-react'
// import { useForm } from 'react-hook-form'
// import { api, classesApi, testimonialsApi } from '@/lib/api'
// import AdminProducts  from '@/components/admin/AdminProducts'
// import AdminGallery   from '@/components/admin/AdminGallery'
// import AdminInquiries from '@/components/admin/AdminInquiries'
// import {
//   AdminPageHeader, AdminDrawer, ConfirmDialog,
//   EmptyState, Badge, inputCls, labelCls, selectCls,
// } from '@/components/admin/AdminUI'
// import type { CakeClass, Testimonial } from '@/types'

// // ── Sidebar nav ───────────────────────────────────────────────────
// const NAV = [
//   { label: 'Overview',     href: '/admin',           icon: <LayoutDashboard size={18}/> },
//   { label: 'Products',     href: '/admin/products',   icon: <Package size={18}/> },
//   { label: 'Classes',      href: '/admin/classes',    icon: <BookOpen size={18}/> },
//   { label: 'Gallery',      href: '/admin/gallery',    icon: <GalleryHorizontal size={18}/> },
//   { label: 'Testimonials', href: '/admin/reviews',    icon: <Star size={18}/> },
//   { label: 'Inquiries',    href: '/admin/inquiries',  icon: <MessageCircle size={18}/> },
//   { label: 'CIC',          href: '/admin/cic',        icon: <Heart size={18}/> },
// ]

// // ── Stat card ─────────────────────────────────────────────────────
// function StatCard({ icon, label, value, sub, colour }: {
//   icon: React.ReactNode; label: string; value: string | number; sub?: string; colour: string
// }) {
//   return (
//     <motion.div
//       className="rounded-2xl p-6 flex items-start gap-4 bg-white border border-[var(--cream)]"
//       style={{ boxShadow: 'var(--shadow-luxury-sm)' }}
//       initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
//       whileHover={{ y: -2 }}
//     >
//       <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
//         style={{ background: `${colour}22`, color: colour }}>{icon}</div>
//       <div>
//         <p className="font-sans text-xs font-medium tracking-widest uppercase mb-1 text-[var(--text-muted)]">{label}</p>
//         <p className="font-serif font-bold text-[var(--text-primary)]" style={{ fontSize: '2rem', lineHeight: 1 }}>{value}</p>
//         {sub && <p className="font-sans text-xs mt-1 text-[var(--text-muted)]">{sub}</p>}
//       </div>
//     </motion.div>
//   )
// }

// // ── Overview ──────────────────────────────────────────────────────
// function Overview() {
//   const { data: products }  = useQuery({ queryKey: ['admin-products-count'],  queryFn: async () => (await api.get('/api/v1/products?page_size=1')).data })
//   const { data: inquiries } = useQuery({ queryKey: ['admin-inquiries-count'], queryFn: async () => (await api.get('/api/v1/inquiries')).data })
//   const { data: classes }   = useQuery({ queryKey: ['admin-classes-count'],   queryFn: async () => (await api.get('/api/v1/classes')).data })
//   const { data: gallery }   = useQuery({ queryKey: ['admin-gallery-count'],   queryFn: async () => (await api.get('/api/v1/gallery')).data })

//   const inqList = (inquiries as { id:string; name:string; email:string; service_type:string; created_at:string; is_read:boolean }[] | undefined) ?? []
//   const unread  = inqList.filter(i => !i.is_read).length

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="font-serif font-semibold text-[var(--text-primary)]" style={{ fontSize: '2rem' }}>Good day 👋</h1>
//         <p className="font-sans text-sm mt-1 text-[var(--text-muted)]">Here's your Haliberry Cake platform at a glance.</p>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
//         <StatCard icon={<Package size={22}/>}           label="Products"  value={(products as {total?:number}|undefined)?.total ?? '—'} sub="In collection"     colour="var(--peach)"/>
//         <StatCard icon={<Mail size={22}/>}              label="Inquiries" value={inqList.length}                                        sub={`${unread} unread`} colour="#E53935"/>
//         <StatCard icon={<BookOpen size={22}/>}          label="Classes"   value={(classes as unknown[])?.length ?? '—'}                 sub="Upcoming"           colour="var(--blush)"/>
//         <StatCard icon={<GalleryHorizontal size={22}/>} label="Gallery"   value={(gallery as unknown[])?.length ?? '—'}                 sub="Images"             colour="var(--golden)"/>
//       </div>
//       {/* Recent inquiries */}
//       <div className="rounded-2xl overflow-hidden bg-white border border-[var(--cream)]" style={{ boxShadow: 'var(--shadow-luxury-sm)' }}>
//         <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--cream)', background: '#FDF7F2' }}>
//           <h2 className="font-serif font-semibold text-[var(--text-primary)]" style={{ fontSize: '1.15rem' }}>Recent Inquiries</h2>
//           <Link to="/admin/inquiries" className="font-sans text-xs text-[var(--text-muted)] hover:text-[var(--peach)] transition-colors">View all →</Link>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead><tr style={{ background: '#FDF7F2' }}>
//               {['Name','Email','Service','Date','Status'].map(h => (
//                 <th key={h} className="font-sans text-xs font-medium tracking-widest uppercase text-left px-6 py-3 text-[var(--text-muted)]">{h}</th>
//               ))}
//             </tr></thead>
//             <tbody>
//               {inqList.length === 0 ? (
//                 <tr><td colSpan={5} className="px-6 py-12 text-center font-sans text-sm text-[var(--text-muted)]">No inquiries yet</td></tr>
//               ) : inqList.slice(0,6).map((inq, i) => (
//                 <tr key={inq.id} className="hover:bg-[#FDF7F2] transition-colors" style={{ borderTop:'1px solid var(--cream)', background: i%2===0?'white':'#FEFCFB' }}>
//                   <td className="px-6 py-4 font-sans text-sm font-medium text-[var(--text-primary)]">{inq.name}</td>
//                   <td className="px-6 py-4 font-sans text-sm text-[var(--text-secondary)]">{inq.email}</td>
//                   <td className="px-6 py-4"><span className="font-sans text-xs px-2.5 py-1 rounded-full capitalize" style={{ background:'var(--apricot)', color:'var(--text-secondary)' }}>{inq.service_type.replace(/_/g,' ')}</span></td>
//                   <td className="px-6 py-4 font-sans text-sm text-[var(--text-muted)]">{new Date(inq.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}</td>
//                   <td className="px-6 py-4"><span className="font-sans text-xs px-2.5 py-1 rounded-full" style={{ background:inq.is_read?'#F0FDF4':'#FEF2F2', color:inq.is_read?'#16A34A':'#DC2626' }}>{inq.is_read?'Read':'Unread'}</span></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }

// // ── Admin Cake Classes ────────────────────────────────────────────
// function AdminClasses() {
//   const qc = useQueryClient()
//   const [drawerOpen, setDrawerOpen] = useState(false)
//   const [editing, setEditing]       = useState<CakeClass | null>(null)
//   const [delTarget, setDelTarget]   = useState<CakeClass | null>(null)

//   const { data: classes = [], isLoading } = useQuery<CakeClass[]>({
//     queryKey: ['admin-classes-full'],
//     queryFn: async () => (await classesApi.list({ upcoming_only: false })).data,
//   })

//   const { register, handleSubmit, reset, formState: { errors } } = useForm<Record<string,unknown>>()

//   const save = useMutation({
//     mutationFn: (data: Record<string,unknown>) =>
//       editing ? classesApi.update(String(editing.id), data) : classesApi.create(data),
//     onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-classes-full'] }); setDrawerOpen(false); reset() },
//   })

//   const del = useMutation({
//     mutationFn: (id: string) => classesApi.delete(id),
//     onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-classes-full'] }); setDelTarget(null) },
//   })

//   const openCreate = () => { setEditing(null); reset({}); setDrawerOpen(true) }
//   const openEdit   = (c: CakeClass) => {
//     setEditing(c)
//     reset({
//       title: c.title, description: c.description ?? '',
//       class_date: c.class_date, duration_hours: c.duration_hours ?? c.duration,
//       price: c.price, total_slots: c.total_slots, location: c.location ?? '',
//       level: c.level ?? 'beginner',
//     })
//     setDrawerOpen(true)
//   }

//   return (
//     <div>
//       <AdminPageHeader
//         title="Cake Classes"
//         subtitle={`${classes.length} classes`}
//         action={<button onClick={openCreate} className="btn-primary text-sm py-2.5"><Plus size={16}/> Add Class</button>}
//       />

//       {isLoading ? (
//         <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-20 rounded-2xl animate-pulse bg-[var(--cream)]"/>)}</div>
//       ) : classes.length === 0 ? (
//         <EmptyState emoji="📅" title="No classes yet" body="Add your first baking class." action={<button onClick={openCreate} className="btn-primary text-sm">Add Class</button>}/>
//       ) : (
//         <div className="space-y-4">
//           {classes.map(cls => (
//             <div key={String(cls.id)} className="bg-white border border-[var(--cream)] rounded-2xl p-5 flex flex-wrap items-start justify-between gap-4 group" style={{ boxShadow:'var(--shadow-luxury-sm)' }}>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 mb-2 flex-wrap">
//                   <Badge label={cls.level ?? 'beginner'} colour="peach"/>
//                   <Badge label={cls.is_active ? 'Active' : 'Inactive'} colour={cls.is_active ? 'green' : 'grey'}/>
//                 </div>
//                 <h3 className="font-serif font-semibold text-[var(--text-primary)] text-lg mb-1">{cls.title}</h3>
//                 <div className="flex flex-wrap gap-4 mt-2">
//                   {[
//                     { icon:<Calendar size={13}/>, text: new Date(cls.class_date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}) },
//                     { icon:<Clock size={13}/>,    text: `${cls.duration_hours ?? cls.duration}h` },
//                     { icon:<Users size={13}/>,    text: `${cls.booked_slots ?? 0}/${cls.total_slots} booked` },
//                   ].map(({ icon, text }) => (
//                     <span key={text} className="flex items-center gap-1 font-sans text-xs text-[var(--text-muted)]">
//                       <span className="text-[var(--peach)]">{icon}</span>{text}
//                     </span>
//                   ))}
//                   <span className="font-sans text-xs font-semibold text-[var(--peach)]">£{cls.price}</span>
//                 </div>
//               </div>
//               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <button onClick={() => openEdit(cls)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--cream)] transition-colors"><Pencil size={14} className="text-[var(--text-secondary)]"/></button>
//                 <button onClick={() => setDelTarget(cls)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"><Trash2 size={14} className="text-red-400"/></button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <AdminDrawer open={drawerOpen} title={editing ? 'Edit Class' : 'Add New Class'} onClose={() => setDrawerOpen(false)}>
//         <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-4">
//           <div><label className={labelCls}>Title *</label><input {...register('title', {required:true})} className={inputCls} placeholder="e.g. Beginner Buttercream Workshop"/>{errors.title && <p className="text-red-500 text-xs mt-1">Required</p>}</div>
//           <div><label className={labelCls}>Description</label><textarea {...register('description')} rows={3} className={inputCls} style={{resize:'none'}}/></div>
//           <div className="grid grid-cols-2 gap-4">
//             <div><label className={labelCls}>Date *</label><input {...register('class_date',{required:true})} type="date" className={inputCls}/></div>
//             <div><label className={labelCls}>Duration (hours) *</label><input {...register('duration_hours',{required:true})} type="number" step="0.5" className={inputCls} placeholder="3"/></div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div><label className={labelCls}>Price (£) *</label><input {...register('price',{required:true})} type="number" step="0.01" className={inputCls}/></div>
//             <div><label className={labelCls}>Total Slots *</label><input {...register('total_slots',{required:true})} type="number" className={inputCls}/></div>
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div><label className={labelCls}>Level</label>
//               <select {...register('level')} className={selectCls}>
//                 {['beginner','intermediate','advanced'].map(l => <option key={l} value={l}>{l}</option>)}
//               </select>
//             </div>
//             <div><label className={labelCls}>Location</label><input {...register('location')} className={inputCls} placeholder="London"/></div>
//           </div>
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input {...register('is_active')} type="checkbox" defaultChecked className="w-4 h-4 accent-[var(--peach)]"/>
//             <span className="font-sans text-sm text-[var(--text-secondary)]">Active (visible to public)</span>
//           </label>
//           <button type="submit" disabled={save.isPending} className="btn-primary w-full justify-center">
//             {save.isPending ? 'Saving…' : editing ? 'Update Class' : 'Create Class'}
//           </button>
//         </form>
//       </AdminDrawer>

//       <ConfirmDialog
//         open={!!delTarget} title="Delete Class"
//         body={`Delete "${delTarget?.title}"? This cannot be undone.`}
//         loading={del.isPending}
//         onConfirm={() => delTarget && del.mutate(String(delTarget.id))}
//         onCancel={() => setDelTarget(null)}
//       />
//     </div>
//   )
// }

// // ── Admin Testimonials ────────────────────────────────────────────
// function AdminTestimonials() {
//   const qc = useQueryClient()
//   const [filter, setFilter] = useState<'all'|'pending'|'approved'>('all')
//   const [delTarget, setDelTarget] = useState<Testimonial | null>(null)

//   const { data: testimonials = [], isLoading } = useQuery<Testimonial[]>({
//     queryKey: ['admin-testimonials'],
//     queryFn: async () => (await testimonialsApi.list()).data,
//   })

//   const approve = useMutation({
//     mutationFn: (id: string) => testimonialsApi.update(id, { is_approved: true }),
//     onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-testimonials'] }),
//   })

//   const feature = useMutation({
//     mutationFn: ({ id, is_featured }: { id: string; is_featured: boolean }) =>
//       testimonialsApi.update(id, { is_featured }),
//     onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-testimonials'] }),
//   })

//   const del = useMutation({
//     mutationFn: (id: string) => testimonialsApi.delete(id),
//     onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-testimonials'] }); setDelTarget(null) },
//   })

//   const displayed = testimonials.filter(t => {
//     if (filter === 'pending')  return !t.is_approved
//     if (filter === 'approved') return t.is_approved
//     return true
//   })

//   const pending = testimonials.filter(t => !t.is_approved).length

//   return (
//     <div>
//       <AdminPageHeader title="Testimonials" subtitle={`${testimonials.length} total · ${pending} pending approval`}/>

//       <div className="flex gap-2 mb-6 flex-wrap">
//         {[
//           { v:'all', l:'All', count: testimonials.length },
//           { v:'pending', l:'Pending', count: pending },
//           { v:'approved', l:'Approved', count: testimonials.length - pending },
//         ].map(({ v, l, count }) => (
//           <button key={v} onClick={() => setFilter(v as typeof filter)}
//             className="px-4 py-2 rounded-full font-sans text-sm font-medium transition-all"
//             style={{ background: filter===v?'var(--peach)':'#FDF7F2', color: filter===v?'white':'var(--text-secondary)', border:`1.5px solid ${filter===v?'var(--peach)':'#E0D0C5'}` }}>
//             {l} ({count})
//           </button>
//         ))}
//       </div>

//       {isLoading ? (
//         <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-32 rounded-2xl animate-pulse bg-[var(--cream)]"/>)}</div>
//       ) : displayed.length === 0 ? (
//         <EmptyState emoji="⭐" title="No testimonials yet" body="Customer reviews submitted through the website will appear here."/>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//           {displayed.map(t => (
//             <div key={String(t.id)} className="bg-white border border-[var(--cream)] rounded-2xl p-6 group" style={{ boxShadow:'var(--shadow-luxury-sm)' }}>
//               <div className="flex items-start justify-between mb-3">
//                 <div>
//                   <p className="font-sans font-semibold text-sm text-[var(--text-primary)]">{t.customer_name}</p>
//                   {t.customer_role && <p className="font-sans text-xs text-[var(--text-muted)]">{t.customer_role}</p>}
//                 </div>
//                 <div className="flex items-center gap-1.5">
//                   <Badge label={t.is_approved ? 'Approved' : 'Pending'} colour={t.is_approved ? 'green' : 'red'}/>
//                   {t.is_featured && <Badge label="Featured" colour="peach"/>}
//                 </div>
//               </div>
//               <p className="font-sans text-sm text-[var(--text-secondary)] leading-relaxed mb-4 italic">"{t.message}"</p>
//               <div className="flex items-center gap-2 flex-wrap">
//                 {!t.is_approved && (
//                   <button onClick={() => approve.mutate(String(t.id))}
//                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
//                     <CheckCircle size={13}/> Approve
//                   </button>
//                 )}
//                 <button
//                   onClick={() => feature.mutate({ id: String(t.id), is_featured: !t.is_featured })}
//                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-[var(--cream)] transition-colors"
//                   style={{ background:'#FDF7F2', color:'var(--text-secondary)' }}>
//                   <Star size={13}/> {t.is_featured ? 'Unfeature' : 'Feature'}
//                 </button>
//                 <button onClick={() => setDelTarget(t)}
//                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors ml-auto">
//                   <XCircle size={13}/> Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <ConfirmDialog
//         open={!!delTarget} title="Delete Testimonial"
//         body={`Delete review from "${delTarget?.customer_name}"?`}
//         loading={del.isPending}
//         onConfirm={() => delTarget && del.mutate(String(delTarget.id))}
//         onCancel={() => setDelTarget(null)}
//       />
//     </div>
//   )
// }

// // ── Admin CIC ─────────────────────────────────────────────────────
// function AdminCIC() {
//   const qc = useQueryClient()
//   const [drawerOpen, setDrawerOpen] = useState(false)
//   const [editing, setEditing]       = useState<{id?:string;title?:string;description?:string;is_active?:boolean} | null>(null)
//   const [delTarget, setDelTarget]   = useState<{id:string;title:string} | null>(null)

//   const { data: programs = [], isLoading } = useQuery({
//     queryKey: ['admin-cic'],
//     queryFn: async () => (await api.get('/api/v1/cic')).data,
//   })

//   const { register, handleSubmit, reset } = useForm<Record<string,unknown>>()

//   const save = useMutation({
//     mutationFn: (data: Record<string,unknown>) =>
//       editing?.id ? api.patch(`/api/v1/cic/${editing.id}`, data) : api.post('/api/v1/cic', data),
//     onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-cic'] }); setDrawerOpen(false); reset() },
//   })

//   const del = useMutation({
//     mutationFn: (id: string) => api.delete(`/api/v1/cic/${id}`),
//     onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-cic'] }); setDelTarget(null) },
//   })

//   const openCreate = () => { setEditing(null); reset({}); setDrawerOpen(true) }
//   const openEdit = (p: {id?:string;title?:string;description?:string;is_active?:boolean}) => {
//     setEditing(p); reset({ title: p.title, description: p.description, is_active: p.is_active }); setDrawerOpen(true)
//   }

//   return (
//     <div>
//       <AdminPageHeader
//         title="CIC Programmes"
//         subtitle="Manage your community impact programmes"
//         action={<button onClick={openCreate} className="btn-primary text-sm py-2.5"><Plus size={16}/> Add Programme</button>}
//       />

//       {isLoading ? (
//         <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="h-24 rounded-2xl animate-pulse bg-[var(--cream)]"/>)}</div>
//       ) : (programs as {id:string;title:string;description?:string;is_active?:boolean}[]).length === 0 ? (
//         <EmptyState emoji="❤️" title="No programmes yet" body="Add your first CIC programme." action={<button onClick={openCreate} className="btn-primary text-sm">Add Programme</button>}/>
//       ) : (
//         <div className="space-y-4">
//           {(programs as {id:string;title:string;description?:string;is_active?:boolean}[]).map(p => (
//             <div key={p.id} className="bg-white border border-[var(--cream)] rounded-2xl p-6 flex items-start justify-between gap-4 group" style={{ boxShadow:'var(--shadow-luxury-sm)' }}>
//               <div className="flex-1">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Badge label={p.is_active ? 'Active' : 'Inactive'} colour={p.is_active ? 'green' : 'grey'}/>
//                 </div>
//                 <h3 className="font-serif font-semibold text-[var(--text-primary)] text-lg">{p.title}</h3>
//                 {p.description && <p className="font-sans text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">{p.description}</p>}
//               </div>
//               <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--cream)] transition-colors"><Pencil size={14} className="text-[var(--text-secondary)]"/></button>
//                 <button onClick={() => setDelTarget(p)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"><Trash2 size={14} className="text-red-400"/></button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <AdminDrawer open={drawerOpen} title={editing?.id ? 'Edit Programme' : 'Add Programme'} onClose={() => setDrawerOpen(false)}>
//         <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-4">
//           <div><label className={labelCls}>Title *</label><input {...register('title',{required:true})} className={inputCls} placeholder="e.g. Healing Through Baking"/></div>
//           <div><label className={labelCls}>Description</label><textarea {...register('description')} rows={4} className={inputCls} style={{resize:'none'}} placeholder="Describe this programme and its impact…"/></div>
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input {...register('is_active')} type="checkbox" defaultChecked className="w-4 h-4 accent-[var(--peach)]"/>
//             <span className="font-sans text-sm text-[var(--text-secondary)]">Active (visible on website)</span>
//           </label>
//           <button type="submit" disabled={save.isPending} className="btn-primary w-full justify-center">
//             {save.isPending ? 'Saving…' : editing?.id ? 'Update Programme' : 'Create Programme'}
//           </button>
//         </form>
//       </AdminDrawer>

//       <ConfirmDialog
//         open={!!delTarget} title="Delete Programme"
//         body={`Delete "${delTarget?.title}"?`}
//         loading={del.isPending}
//         onConfirm={() => delTarget && del.mutate(delTarget.id)}
//         onCancel={() => setDelTarget(null)}
//       />
//     </div>
//   )
// }

// // ── Dashboard shell ───────────────────────────────────────────────
// export default function AdminDashboard() {
//   const navigate     = useNavigate()
//   const [open, setOpen] = useState(false)

//   const handleLogout = () => {
//     localStorage.removeItem('haliberry_admin_token')
//     navigate('/admin/login')
//   }

//   return (
//     <div className="min-h-screen flex" style={{ background: '#F8F5F2' }}>

//       {/* Sidebar */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
//         style={{ background: 'var(--text-primary)' }}
//       >
//         <div className="px-6 py-7" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
//           <p className="font-serif font-bold text-white" style={{ fontSize: '1.3rem' }}>Haliberry</p>
//           <p className="font-sans text-xs tracking-[0.18em] uppercase mt-0.5" style={{ color: 'var(--peach)' }}>Admin Dashboard</p>
//         </div>
//         <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
//           {NAV.map(({ label, href, icon }) => (
//             <NavLink key={href} to={href} end={href === '/admin'} onClick={() => setOpen(false)}
//               className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all ${isActive ? '' : 'hover:bg-white/5'}`}
//               style={({ isActive }) => ({ background: isActive?'rgba(248,169,116,0.15)':'transparent', color: isActive?'var(--peach)':'rgba(255,255,255,0.55)' })}>
//               {icon}{label}
//             </NavLink>
//           ))}
//         </nav>
//         <div className="px-4 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
//           <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-sans text-sm hover:bg-white/5 transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>
//             <LogOut size={16}/> Sign Out
//           </button>
//         </div>
//       </aside>

//       {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)}/>}

//       {/* Main */}
//       <div className="flex-1 flex flex-col min-w-0">
//         <header className="h-16 flex items-center justify-between px-6 bg-white sticky top-0 z-20" style={{ boxShadow: 'var(--shadow-luxury-sm)' }}>
//           <button className="lg:hidden" onClick={() => setOpen(v => !v)}>
//             {open ? <X size={22} className="text-[var(--text-primary)]"/> : <Menu size={22} className="text-[var(--text-primary)]"/>}
//           </button>
//           <span className="hidden lg:block font-sans text-sm text-[var(--text-muted)]">Haliberry Cake · Admin</span>
//           <div className="flex items-center gap-3">
//             <Link to="/" target="_blank" className="font-sans text-xs flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-[var(--cream)] transition-colors text-[var(--text-secondary)]">
//               <Eye size={14}/> View Site
//             </Link>
//             <div className="w-8 h-8 rounded-full flex items-center justify-center font-sans font-semibold text-xs text-white" style={{ background: 'var(--peach)' }}>A</div>
//           </div>
//         </header>

//         <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
//           <Routes>
//             <Route index             element={<Overview />} />
//             <Route path="products"   element={<AdminProducts />} />
//             <Route path="classes"    element={<AdminClasses />} />
//             <Route path="gallery"    element={<AdminGallery />} />
//             <Route path="reviews"    element={<AdminTestimonials />} />
//             <Route path="inquiries"  element={<AdminInquiries />} />
//             <Route path="cic"        element={<AdminCIC />} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   )
// }


// // C:\Users\Melody\Documents\haliberrycake\frontend\src\pages\admin\AdminDashboard.tsx
// import { useState } from 'react'
// import { Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { useQuery } from '@tanstack/react-query'
// import {
//   LayoutDashboard, Package, GalleryHorizontal, Star,
//   MessageCircle, BookOpen, Heart, LogOut, Menu, X, Eye, Mail,
// } from 'lucide-react'
// import { api } from '@/lib/api'
// import AdminProducts  from '@/components/admin/AdminProducts'
// import AdminGallery   from '@/components/admin/AdminGallery'
// import AdminInquiries from '@/components/admin/AdminInquiries'

// // ── Sidebar nav ───────────────────────────────────────────────────
// const NAV = [
//   { label: 'Overview',     href: '/admin',           icon: <LayoutDashboard size={18}/> },
//   { label: 'Products',     href: '/admin/products',   icon: <Package size={18}/> },
//   { label: 'Classes',      href: '/admin/classes',    icon: <BookOpen size={18}/> },
//   { label: 'Gallery',      href: '/admin/gallery',    icon: <GalleryHorizontal size={18}/> },
//   { label: 'Testimonials', href: '/admin/reviews',    icon: <Star size={18}/> },
//   { label: 'Inquiries',    href: '/admin/inquiries',  icon: <MessageCircle size={18}/> },
//   { label: 'CIC',          href: '/admin/cic',        icon: <Heart size={18}/> },
// ]

// // ── Stat card ─────────────────────────────────────────────────────
// function StatCard({ icon, label, value, sub, colour }: {
//   icon: React.ReactNode; label: string; value: string | number; sub?: string; colour: string
// }) {
//   return (
//     <motion.div
//       className="rounded-2xl p-6 flex items-start gap-4 bg-white border border-[var(--cream)]"
//       style={{ boxShadow: 'var(--shadow-luxury-sm)' }}
//       initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       whileHover={{ y: -2 }}
//     >
//       <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
//         style={{ background: `${colour}22`, color: colour }}>
//         {icon}
//       </div>
//       <div>
//         <p className="font-sans text-xs font-medium tracking-widest uppercase mb-1 text-[var(--text-muted)]">{label}</p>
//         <p className="font-serif font-bold text-[var(--text-primary)]" style={{ fontSize: '2rem', lineHeight: 1 }}>{value}</p>
//         {sub && <p className="font-sans text-xs mt-1 text-[var(--text-muted)]">{sub}</p>}
//       </div>
//     </motion.div>
//   )
// }

// // ── Overview dashboard ────────────────────────────────────────────
// function Overview() {
//   const { data: products }  = useQuery({ queryKey: ['admin-products'],  queryFn: async () => (await api.get('/api/v1/products?page_size=1')).data })
//   const { data: inquiries } = useQuery({ queryKey: ['admin-inquiries'], queryFn: async () => (await api.get('/api/v1/inquiries')).data })
//   const { data: classes }   = useQuery({ queryKey: ['admin-classes'],   queryFn: async () => (await api.get('/api/v1/classes')).data })
//   const { data: gallery }   = useQuery({ queryKey: ['admin-gallery'],   queryFn: async () => (await api.get('/api/v1/gallery')).data })

//   const inqList = (inquiries as { id:string; name:string; email:string; service_type:string; created_at:string; is_read:boolean }[] | undefined) ?? []
//   const unread  = inqList.filter(i => !i.is_read).length

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="font-serif font-semibold text-[var(--text-primary)]" style={{ fontSize: '2rem' }}>
//           Good day 👋
//         </h1>
//         <p className="font-sans text-sm mt-1 text-[var(--text-muted)]">
//           Here's your Haliberry Cake platform at a glance.
//         </p>
//       </div>

//       {/* Stat cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
//         <StatCard icon={<Package size={22}/>}           label="Products"    value={(products as { total?: number } | undefined)?.total ?? '—'}   sub="In collection"         colour="var(--peach)"/>
//         <StatCard icon={<Mail size={22}/>}              label="Inquiries"   value={inqList.length}                                                sub={`${unread} unread`}    colour="#E53935"/>
//         <StatCard icon={<BookOpen size={22}/>}          label="Classes"     value={(classes as unknown[] | undefined)?.length ?? '—'}             sub="Upcoming"              colour="var(--blush)"/>
//         <StatCard icon={<GalleryHorizontal size={22}/>} label="Gallery"     value={(gallery as unknown[] | undefined)?.length ?? '—'}             sub="Images"                colour="var(--golden)"/>
//       </div>

//       {/* Recent inquiries table */}
//       <div className="rounded-2xl overflow-hidden bg-white border border-[var(--cream)]" style={{ boxShadow: 'var(--shadow-luxury-sm)' }}>
//         <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--cream)', background: '#FDF7F2' }}>
//           <h2 className="font-serif font-semibold text-[var(--text-primary)]" style={{ fontSize: '1.15rem' }}>Recent Inquiries</h2>
//           <Link to="/admin/inquiries" className="font-sans text-xs hover:text-[var(--peach)] transition-colors text-[var(--text-muted)]">
//             View all →
//           </Link>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr style={{ background: '#FDF7F2' }}>
//                 {['Name','Email','Service','Date','Status'].map(h => (
//                   <th key={h} className="font-sans text-xs font-medium tracking-widest uppercase text-left px-6 py-3 text-[var(--text-muted)]">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {inqList.length === 0 ? (
//                 <tr>
//                   <td colSpan={5} className="px-6 py-12 text-center font-sans text-sm text-[var(--text-muted)]">
//                     No inquiries yet
//                   </td>
//                 </tr>
//               ) : inqList.slice(0, 6).map((inq, i) => (
//                 <tr key={inq.id} className="hover:bg-[#FDF7F2] transition-colors"
//                   style={{ borderTop: '1px solid var(--cream)', background: i % 2 === 0 ? 'white' : '#FEFCFB' }}>
//                   <td className="px-6 py-4 font-sans text-sm font-medium text-[var(--text-primary)]">{inq.name}</td>
//                   <td className="px-6 py-4 font-sans text-sm text-[var(--text-secondary)]">{inq.email}</td>
//                   <td className="px-6 py-4">
//                     <span className="font-sans text-xs px-2.5 py-1 rounded-full capitalize"
//                       style={{ background: 'var(--apricot)', color: 'var(--text-secondary)' }}>
//                       {inq.service_type.replace(/_/g,' ')}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 font-sans text-sm text-[var(--text-muted)]">
//                     {new Date(inq.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className="font-sans text-xs px-2.5 py-1 rounded-full"
//                       style={{ background: inq.is_read ? '#F0FDF4' : '#FEF2F2', color: inq.is_read ? '#16A34A' : '#DC2626' }}>
//                       {inq.is_read ? 'Read' : 'Unread'}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }

// // ── Coming soon placeholder (for Classes, Reviews, CIC) ──────────
// function ComingSoon({ title }: { title: string }) {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
//       <p className="text-5xl mb-5">🚧</p>
//       <h2 className="font-serif text-2xl mb-2 text-[var(--text-primary)]">{title}</h2>
//       <p className="font-sans text-sm text-[var(--text-muted)]">This section will be built in the next phase.</p>
//     </div>
//   )
// }

// // ── Dashboard shell ───────────────────────────────────────────────
// export default function AdminDashboard() {
//   const navigate     = useNavigate()
//   const [open, setOpen] = useState(false)

//   const handleLogout = () => {
//     localStorage.removeItem('haliberry_admin_token')
//     navigate('/admin/login')
//   }

//   return (
//     <div className="min-h-screen flex" style={{ background: '#F8F5F2' }}>

//       {/* Sidebar */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
//         style={{ background: 'var(--text-primary)' }}
//       >
//         {/* Brand */}
//         <div className="px-6 py-7" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
//           <p className="font-serif font-bold text-white" style={{ fontSize: '1.3rem' }}>Haliberry</p>
//           <p className="font-sans text-xs tracking-[0.18em] uppercase mt-0.5" style={{ color: 'var(--peach)' }}>
//             Admin Dashboard
//           </p>
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
//           {NAV.map(({ label, href, icon }) => (
//             <NavLink
//               key={href} to={href} end={href === '/admin'}
//               onClick={() => setOpen(false)}
//               className={({ isActive }) =>
//                 `flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all ${
//                   isActive ? '' : 'hover:bg-white/5'
//                 }`
//               }
//               style={({ isActive }) => ({
//                 background: isActive ? 'rgba(248,169,116,0.15)' : 'transparent',
//                 color:      isActive ? 'var(--peach)' : 'rgba(255,255,255,0.55)',
//               })}
//             >
//               {icon}{label}
//             </NavLink>
//           ))}
//         </nav>

//         {/* Logout */}
//         <div className="px-4 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
//           <button onClick={handleLogout}
//             className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-sans text-sm transition-colors hover:bg-white/5"
//             style={{ color: 'rgba(255,255,255,0.4)' }}>
//             <LogOut size={16}/> Sign Out
//           </button>
//         </div>
//       </aside>

//       {/* Mobile overlay */}
//       {open && (
//         <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
//       )}

//       {/* Main */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Topbar */}
//         <header className="h-16 flex items-center justify-between px-6 bg-white sticky top-0 z-20"
//           style={{ boxShadow: 'var(--shadow-luxury-sm)' }}>
//           <button className="lg:hidden" onClick={() => setOpen(v => !v)}>
//             {open ? <X size={22} className="text-[var(--text-primary)]"/> : <Menu size={22} className="text-[var(--text-primary)]"/>}
//           </button>
//           <span className="hidden lg:block font-sans text-sm text-[var(--text-muted)]">
//             Haliberry Cake · Admin
//           </span>
//           <div className="flex items-center gap-3">
//             <Link to="/" target="_blank"
//               className="font-sans text-xs flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-[var(--cream)] transition-colors text-[var(--text-secondary)]">
//               <Eye size={14}/> View Site
//             </Link>
//             <div className="w-8 h-8 rounded-full flex items-center justify-center font-sans font-semibold text-xs text-white"
//               style={{ background: 'var(--peach)' }}>
//               A
//             </div>
//           </div>
//         </header>

//         {/* Page content */}
//         <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
//           <Routes>
//             <Route index              element={<Overview />} />
//             <Route path="products"   element={<AdminProducts />} />
//             <Route path="gallery"    element={<AdminGallery />} />
//             <Route path="inquiries"  element={<AdminInquiries />} />
//             <Route path="classes"    element={<ComingSoon title="Cake Classes" />} />
//             <Route path="reviews"    element={<ComingSoon title="Testimonials" />} />
//             <Route path="cic"        element={<ComingSoon title="CIC Programmes" />} />
//           </Routes>
//         </main>
//       </div>
//     </div>
//   )
// }

// // ── Simple placeholder section for other admin pages ─────────────
// function AdminSection({ title, description }: { title:string; description:string }) {
//   return (
//     <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
//       <p className="text-5xl mb-5">🚧</p>
//       <h2 className="font-serif text-2xl mb-2" style={{ color:'var(--text-primary)' }}>{title}</h2>
//       <p className="font-sans text-sm" style={{ color:'var(--text-muted)' }}>{description}</p>
//     </div>
//   )
// }

// // ── Dashboard shell ───────────────────────────────────────────────

