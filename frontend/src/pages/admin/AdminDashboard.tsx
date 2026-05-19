// C:\Users\Melody\Documents\haliberrycake\frontend\src\pages\admin\AdminDashboard.tsx
import { useState } from 'react'
import { Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  LayoutDashboard, Package, GalleryHorizontal, Star,
  MessageCircle, BookOpen, Heart, LogOut, Menu, X, Eye, Mail,
} from 'lucide-react'
import { api } from '@/lib/api'
import AdminProducts  from '@/components/admin/AdminProducts'
import AdminGallery   from '@/components/admin/AdminGallery'
import AdminInquiries from '@/components/admin/AdminInquiries'

// ── Sidebar nav ───────────────────────────────────────────────────
const NAV = [
  { label: 'Overview',     href: '/admin',           icon: <LayoutDashboard size={18}/> },
  { label: 'Products',     href: '/admin/products',   icon: <Package size={18}/> },
  { label: 'Classes',      href: '/admin/classes',    icon: <BookOpen size={18}/> },
  { label: 'Gallery',      href: '/admin/gallery',    icon: <GalleryHorizontal size={18}/> },
  { label: 'Testimonials', href: '/admin/reviews',    icon: <Star size={18}/> },
  { label: 'Inquiries',    href: '/admin/inquiries',  icon: <MessageCircle size={18}/> },
  { label: 'CIC',          href: '/admin/cic',        icon: <Heart size={18}/> },
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
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${colour}22`, color: colour }}>
        {icon}
      </div>
      <div>
        <p className="font-sans text-xs font-medium tracking-widest uppercase mb-1 text-[var(--text-muted)]">{label}</p>
        <p className="font-serif font-bold text-[var(--text-primary)]" style={{ fontSize: '2rem', lineHeight: 1 }}>{value}</p>
        {sub && <p className="font-sans text-xs mt-1 text-[var(--text-muted)]">{sub}</p>}
      </div>
    </motion.div>
  )
}

// ── Overview dashboard ────────────────────────────────────────────
function Overview() {
  const { data: products }  = useQuery({ queryKey: ['admin-products'],  queryFn: async () => (await api.get('/api/v1/products?page_size=1')).data })
  const { data: inquiries } = useQuery({ queryKey: ['admin-inquiries'], queryFn: async () => (await api.get('/api/v1/inquiries')).data })
  const { data: classes }   = useQuery({ queryKey: ['admin-classes'],   queryFn: async () => (await api.get('/api/v1/classes')).data })
  const { data: gallery }   = useQuery({ queryKey: ['admin-gallery'],   queryFn: async () => (await api.get('/api/v1/gallery')).data })

  const inqList = (inquiries as { id:string; name:string; email:string; service_type:string; created_at:string; is_read:boolean }[] | undefined) ?? []
  const unread  = inqList.filter(i => !i.is_read).length

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif font-semibold text-[var(--text-primary)]" style={{ fontSize: '2rem' }}>
          Good day 👋
        </h1>
        <p className="font-sans text-sm mt-1 text-[var(--text-muted)]">
          Here's your Haliberry Cake platform at a glance.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard icon={<Package size={22}/>}           label="Products"    value={(products as { total?: number } | undefined)?.total ?? '—'}   sub="In collection"         colour="var(--peach)"/>
        <StatCard icon={<Mail size={22}/>}              label="Inquiries"   value={inqList.length}                                                sub={`${unread} unread`}    colour="#E53935"/>
        <StatCard icon={<BookOpen size={22}/>}          label="Classes"     value={(classes as unknown[] | undefined)?.length ?? '—'}             sub="Upcoming"              colour="var(--blush)"/>
        <StatCard icon={<GalleryHorizontal size={22}/>} label="Gallery"     value={(gallery as unknown[] | undefined)?.length ?? '—'}             sub="Images"                colour="var(--golden)"/>
      </div>

      {/* Recent inquiries table */}
      <div className="rounded-2xl overflow-hidden bg-white border border-[var(--cream)]" style={{ boxShadow: 'var(--shadow-luxury-sm)' }}>
        <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--cream)', background: '#FDF7F2' }}>
          <h2 className="font-serif font-semibold text-[var(--text-primary)]" style={{ fontSize: '1.15rem' }}>Recent Inquiries</h2>
          <Link to="/admin/inquiries" className="font-sans text-xs hover:text-[var(--peach)] transition-colors text-[var(--text-muted)]">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#FDF7F2' }}>
                {['Name','Email','Service','Date','Status'].map(h => (
                  <th key={h} className="font-sans text-xs font-medium tracking-widest uppercase text-left px-6 py-3 text-[var(--text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inqList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center font-sans text-sm text-[var(--text-muted)]">
                    No inquiries yet
                  </td>
                </tr>
              ) : inqList.slice(0, 6).map((inq, i) => (
                <tr key={inq.id} className="hover:bg-[#FDF7F2] transition-colors"
                  style={{ borderTop: '1px solid var(--cream)', background: i % 2 === 0 ? 'white' : '#FEFCFB' }}>
                  <td className="px-6 py-4 font-sans text-sm font-medium text-[var(--text-primary)]">{inq.name}</td>
                  <td className="px-6 py-4 font-sans text-sm text-[var(--text-secondary)]">{inq.email}</td>
                  <td className="px-6 py-4">
                    <span className="font-sans text-xs px-2.5 py-1 rounded-full capitalize"
                      style={{ background: 'var(--apricot)', color: 'var(--text-secondary)' }}>
                      {inq.service_type.replace(/_/g,' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-sans text-sm text-[var(--text-muted)]">
                    {new Date(inq.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-sans text-xs px-2.5 py-1 rounded-full"
                      style={{ background: inq.is_read ? '#F0FDF4' : '#FEF2F2', color: inq.is_read ? '#16A34A' : '#DC2626' }}>
                      {inq.is_read ? 'Read' : 'Unread'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Coming soon placeholder (for Classes, Reviews, CIC) ──────────
function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <p className="text-5xl mb-5">🚧</p>
      <h2 className="font-serif text-2xl mb-2 text-[var(--text-primary)]">{title}</h2>
      <p className="font-sans text-sm text-[var(--text-muted)]">This section will be built in the next phase.</p>
    </div>
  )
}

// ── Dashboard shell ───────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate     = useNavigate()
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
        {/* Brand */}
        <div className="px-6 py-7" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="font-serif font-bold text-white" style={{ fontSize: '1.3rem' }}>Haliberry</p>
          <p className="font-sans text-xs tracking-[0.18em] uppercase mt-0.5" style={{ color: 'var(--peach)' }}>
            Admin Dashboard
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {NAV.map(({ label, href, icon }) => (
            <NavLink
              key={href} to={href} end={href === '/admin'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all ${
                  isActive ? '' : 'hover:bg-white/5'
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? 'rgba(248,169,116,0.15)' : 'transparent',
                color:      isActive ? 'var(--peach)' : 'rgba(255,255,255,0.55)',
              })}
            >
              {icon}{label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-sans text-sm transition-colors hover:bg-white/5"
            style={{ color: 'rgba(255,255,255,0.4)' }}>
            <LogOut size={16}/> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-white sticky top-0 z-20"
          style={{ boxShadow: 'var(--shadow-luxury-sm)' }}>
          <button className="lg:hidden" onClick={() => setOpen(v => !v)}>
            {open ? <X size={22} className="text-[var(--text-primary)]"/> : <Menu size={22} className="text-[var(--text-primary)]"/>}
          </button>
          <span className="hidden lg:block font-sans text-sm text-[var(--text-muted)]">
            Haliberry Cake · Admin
          </span>
          <div className="flex items-center gap-3">
            <Link to="/" target="_blank"
              className="font-sans text-xs flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-[var(--cream)] transition-colors text-[var(--text-secondary)]">
              <Eye size={14}/> View Site
            </Link>
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-sans font-semibold text-xs text-white"
              style={{ background: 'var(--peach)' }}>
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Routes>
            <Route index              element={<Overview />} />
            <Route path="products"   element={<AdminProducts />} />
            <Route path="gallery"    element={<AdminGallery />} />
            <Route path="inquiries"  element={<AdminInquiries />} />
            <Route path="classes"    element={<ComingSoon title="Cake Classes" />} />
            <Route path="reviews"    element={<ComingSoon title="Testimonials" />} />
            <Route path="cic"        element={<ComingSoon title="CIC Programmes" />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  LayoutDashboard, Package, GalleryHorizontal, Star,
  MessageCircle, BookOpen, Heart, LogOut, Menu, X,
  TrendingUp, Users, Eye, Mail,
} from 'lucide-react'
import { api } from '@/lib/api'

// ── Sidebar nav links ─────────────────────────────────────────────
const NAV = [
  { label:'Overview',     href:'/admin',          icon:<LayoutDashboard size={18}/> },
  { label:'Products',     href:'/admin/products',  icon:<Package size={18}/> },
  { label:'Classes',      href:'/admin/classes',   icon:<BookOpen size={18}/> },
  { label:'Gallery',      href:'/admin/gallery',   icon:<GalleryHorizontal size={18}/> },
  { label:'Testimonials', href:'/admin/reviews',   icon:<Star size={18}/> },
  { label:'Inquiries',    href:'/admin/inquiries', icon:<MessageCircle size={18}/> },
  { label:'CIC',          href:'/admin/cic',       icon:<Heart size={18}/> },
]

// ── Overview stats card ───────────────────────────────────────────
function StatCard({ icon, label, value, sub, colour }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; colour: string
}) {
  return (
    <motion.div
      className="rounded-2xl p-6 flex items-start gap-4"
      style={{ background:'white', border:'1px solid var(--cream)', boxShadow:'var(--shadow-luxury-sm)' }}
      initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:0.5 }}
      whileHover={{ y:-2 }}
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background:`${colour}22`, color:colour }}>{icon}</div>
      <div>
        <p className="font-sans text-xs font-medium tracking-widest uppercase mb-1" style={{ color:'var(--text-muted)' }}>{label}</p>
        <p className="font-serif font-bold" style={{ fontSize:'2rem', color:'var(--text-primary)', lineHeight:1 }}>{value}</p>
        {sub && <p className="font-sans text-xs mt-1" style={{ color:'var(--text-muted)' }}>{sub}</p>}
      </div>
    </motion.div>
  )
}

// ── Overview page ─────────────────────────────────────────────────
function Overview() {
  const { data: products }   = useQuery({ queryKey:['admin-products'],    queryFn: async()=>{ const r=await api.get('/api/v1/products'); return r.data } })
  const { data: inquiries }  = useQuery({ queryKey:['admin-inquiries'],   queryFn: async()=>{ const r=await api.get('/api/v1/inquiries'); return r.data } })
  const { data: classes }    = useQuery({ queryKey:['admin-classes'],     queryFn: async()=>{ const r=await api.get('/api/v1/classes'); return r.data } })
  const { data: gallery }    = useQuery({ queryKey:['admin-gallery'],     queryFn: async()=>{ const r=await api.get('/api/v1/gallery'); return r.data } })

  const unread = (inquiries as {is_read:boolean}[] | undefined)?.filter(i=>!i.is_read).length ?? 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif font-semibold" style={{ fontSize:'2rem', color:'var(--text-primary)' }}>
          Good morning 👋
        </h1>
        <p className="font-sans text-sm mt-1" style={{ color:'var(--text-muted)' }}>
          Here's an overview of your Haliberry Cake platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard icon={<Package size={22}/>}          label="Products"   value={(products as {total:number}|undefined)?.total ?? '—'} sub="In collection"       colour="var(--peach)"/>
        <StatCard icon={<Mail size={22}/>}             label="Inquiries"  value={(inquiries as unknown[])?.length ?? '—'} sub={`${unread} unread`} colour="#E53935"/>
        <StatCard icon={<BookOpen size={22}/>}         label="Classes"    value={(classes as unknown[])?.length ?? '—'}     sub="Upcoming"            colour="var(--blush)"/>
        <StatCard icon={<GalleryHorizontal size={22}/>} label="Gallery"   value={(gallery as unknown[])?.length ?? '—'}     sub="Images uploaded"     colour="var(--golden)"/>
      </div>

      {/* Recent inquiries table */}
      <div className="rounded-2xl overflow-hidden" style={{ background:'white', border:'1px solid var(--cream)', boxShadow:'var(--shadow-luxury-sm)' }}>
        <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom:'1px solid var(--cream)' }}>
          <h2 className="font-serif font-semibold" style={{ fontSize:'1.15rem', color:'var(--text-primary)' }}>Recent Inquiries</h2>
          <Link to="/admin/inquiries" className="font-sans text-xs hover:text-[var(--peach)] transition-colors" style={{ color:'var(--text-muted)' }}>View all →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background:'#FDF7F2' }}>
                {['Name','Email','Service','Date','Status'].map(h=>(
                  <th key={h} className="font-sans text-xs font-medium tracking-widest uppercase text-left px-6 py-3" style={{ color:'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(inquiries as {id:number,name:string,email:string,service_type:string,created_at:string,is_read:boolean}[] | undefined)?.slice(0,6).map((inq,i)=>(
                <tr key={inq.id} style={{ borderTop:'1px solid var(--cream)', background: i%2===0 ? 'white' : '#FEFCFB' }}>
                  <td className="px-6 py-4 font-sans text-sm font-medium" style={{ color:'var(--text-primary)' }}>{inq.name}</td>
                  <td className="px-6 py-4 font-sans text-sm" style={{ color:'var(--text-secondary)' }}>{inq.email}</td>
                  <td className="px-6 py-4">
                    <span className="font-sans text-xs px-2.5 py-1 rounded-full" style={{ background:'var(--apricot)', color:'var(--text-secondary)' }}>
                      {inq.service_type.replace(/_/g,' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-sans text-sm" style={{ color:'var(--text-muted)' }}>
                    {new Date(inq.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-sans text-xs px-2.5 py-1 rounded-full"
                      style={{ background: inq.is_read ? '#F0FDF4' : '#FEF2F2', color: inq.is_read ? '#16A34A' : '#DC2626' }}>
                      {inq.is_read ? 'Read' : 'Unread'}
                    </span>
                  </td>
                </tr>
              )) ?? (
                <tr><td colSpan={5} className="px-6 py-12 text-center font-sans text-sm" style={{ color:'var(--text-muted)' }}>No inquiries yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Simple placeholder section for other admin pages ─────────────
function AdminSection({ title, description }: { title:string; description:string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <p className="text-5xl mb-5">🚧</p>
      <h2 className="font-serif text-2xl mb-2" style={{ color:'var(--text-primary)' }}>{title}</h2>
      <p className="font-sans text-sm" style={{ color:'var(--text-muted)' }}>{description}</p>
    </div>
  )
}

// ── Dashboard shell ───────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('haliberry_admin_token')
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex" style={{ background:'#F8F5F2' }}>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:flex ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background:'var(--text-primary)', borderRight:'1px solid rgba(255,255,255,0.06)' }}
      >
        {/* Brand */}
        <div className="px-6 py-7" style={{ borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <p className="font-serif font-bold text-white" style={{ fontSize:'1.3rem' }}>Haliberry</p>
          <p className="font-sans text-xs tracking-[0.18em] uppercase mt-0.5" style={{ color:'var(--peach)' }}>Admin Dashboard</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {NAV.map(({ label, href, icon })=>(
            <NavLink key={href} to={href} end={href==='/admin'}
              className={({ isActive })=>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'hover:bg-white/5'
                }`
              }
              style={({ isActive })=>({
                background: isActive ? 'rgba(248,169,116,0.15)' : 'transparent',
                color: isActive ? 'var(--peach)' : 'rgba(255,255,255,0.55)',
              })}
              onClick={()=>setSidebarOpen(false)}
            >
              {icon}{label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-5" style={{ borderTop:'1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-sans text-sm transition-colors hover:bg-white/5"
            style={{ color:'rgba(255,255,255,0.4)' }}>
            <LogOut size={16}/> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={()=>setSidebarOpen(false)}/>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-6 bg-white shadow-luxury-sm sticky top-0 z-20">
          <button className="lg:hidden" onClick={()=>setSidebarOpen(v=>!v)}>
            {sidebarOpen ? <X size={22} style={{ color:'var(--text-primary)' }}/> : <Menu size={22} style={{ color:'var(--text-primary)' }}/>}
          </button>
          <div className="hidden lg:block font-sans text-sm" style={{ color:'var(--text-muted)' }}>
            Haliberry Cake · Admin
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" target="_blank" className="font-sans text-xs flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors hover:bg-[var(--cream)]"
              style={{ color:'var(--text-secondary)' }}>
              <Eye size={14}/> View Site
            </Link>
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-sans font-semibold text-xs text-white"
              style={{ background:'var(--peach)' }}>A</div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Routes>
            <Route index element={<Overview/>}/>
            <Route path="products"  element={<AdminSection title="Products" description="Full product CRUD management UI coming in next phase."/>}/>
            <Route path="classes"   element={<AdminSection title="Cake Classes" description="Class scheduling and management coming in next phase."/>}/>
            <Route path="gallery"   element={<AdminSection title="Gallery" description="Image upload and management coming in next phase."/>}/>
            <Route path="reviews"   element={<AdminSection title="Testimonials" description="Review moderation and approval coming in next phase."/>}/>
            <Route path="inquiries" element={<AdminSection title="Inquiries" description="Full inquiry management inbox coming in next phase."/>}/>
            <Route path="cic"       element={<AdminSection title="CIC Programmes" description="CIC programme management coming in next phase."/>}/>
          </Routes>
        </main>
      </div>
    </div>
  )
}





// // C:\Users\Melody\Documents\haliberrycake\frontend\src\pages\admin\AdminDashboard.tsx
// import { useState } from 'react'
// import { Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { useQuery } from '@tanstack/react-query'
// import {
//   LayoutDashboard, Package, GalleryHorizontal, Star,
//   MessageCircle, BookOpen, Heart, LogOut, Menu, X,
//   TrendingUp, Users, Eye, Mail,
// } from 'lucide-react'
// import { api } from '@/lib/api'

// // ── Sidebar nav links ─────────────────────────────────────────────
// const NAV = [
//   { label:'Overview',     href:'/admin',          icon:<LayoutDashboard size={18}/> },
//   { label:'Products',     href:'/admin/products',  icon:<Package size={18}/> },
//   { label:'Classes',      href:'/admin/classes',   icon:<BookOpen size={18}/> },
//   { label:'Gallery',      href:'/admin/gallery',   icon:<GalleryHorizontal size={18}/> },
//   { label:'Testimonials', href:'/admin/reviews',   icon:<Star size={18}/> },
//   { label:'Inquiries',    href:'/admin/inquiries', icon:<MessageCircle size={18}/> },
//   { label:'CIC',          href:'/admin/cic',       icon:<Heart size={18}/> },
// ]

// // ── Overview stats card ───────────────────────────────────────────
// function StatCard({ icon, label, value, sub, colour }: {
//   icon: React.ReactNode; label: string; value: string | number; sub?: string; colour: string
// }) {
//   return (
//     <motion.div
//       className="rounded-2xl p-6 flex items-start gap-4"
//       style={{ background:'white', border:'1px solid var(--cream)', boxShadow:'var(--shadow-luxury-sm)' }}
//       initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
//       transition={{ duration:0.5 }}
//       whileHover={{ y:-2 }}
//     >
//       <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
//         style={{ background:`${colour}22`, color:colour }}>{icon}</div>
//       <div>
//         <p className="font-sans text-xs font-medium tracking-widest uppercase mb-1" style={{ color:'var(--text-muted)' }}>{label}</p>
//         <p className="font-serif font-bold" style={{ fontSize:'2rem', color:'var(--text-primary)', lineHeight:1 }}>{value}</p>
//         {sub && <p className="font-sans text-xs mt-1" style={{ color:'var(--text-muted)' }}>{sub}</p>}
//       </div>
//     </motion.div>
//   )
// }

// // ── Overview page ─────────────────────────────────────────────────
// function Overview() {
//   const { data: products }   = useQuery({ queryKey:['admin-products'],    queryFn: async()=>{ const r=await api.get('/api/v1/products'); return r.data } })
//   const { data: inquiries }  = useQuery({ queryKey:['admin-inquiries'],   queryFn: async()=>{ const r=await api.get('/api/v1/inquiries'); return r.data } })
//   const { data: classes }    = useQuery({ queryKey:['admin-classes'],     queryFn: async()=>{ const r=await api.get('/api/v1/classes'); return r.data } })
//   const { data: gallery }    = useQuery({ queryKey:['admin-gallery'],     queryFn: async()=>{ const r=await api.get('/api/v1/gallery'); return r.data } })

//   const unread = (inquiries as {is_read:boolean}[] | undefined)?.filter(i=>!i.is_read).length ?? 0

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="font-serif font-semibold" style={{ fontSize:'2rem', color:'var(--text-primary)' }}>
//           Good morning 👋
//         </h1>
//         <p className="font-sans text-sm mt-1" style={{ color:'var(--text-muted)' }}>
//           Here's an overview of your Haliberry Cake platform.
//         </p>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
//         <StatCard icon={<Package size={22}/>}          label="Products"   value={(products as {total:number}|undefined)?.total ?? '—'} sub="In collection"       colour="var(--peach)"/>
//         <StatCard icon={<Mail size={22}/>}             label="Inquiries"  value={(inquiries as unknown[])?.length ?? '—'} sub={`${unread} unread`} colour="#E53935"/>
//         <StatCard icon={<BookOpen size={22}/>}         label="Classes"    value={(classes as unknown[])?.length ?? '—'}     sub="Upcoming"            colour="var(--blush)"/>
//         <StatCard icon={<GalleryHorizontal size={22}/>} label="Gallery"   value={(gallery as unknown[])?.length ?? '—'}     sub="Images uploaded"     colour="var(--golden)"/>
//       </div>

//       {/* Recent inquiries table */}
//       <div className="rounded-2xl overflow-hidden" style={{ background:'white', border:'1px solid var(--cream)', boxShadow:'var(--shadow-luxury-sm)' }}>
//         <div className="px-6 py-5 flex items-center justify-between" style={{ borderBottom:'1px solid var(--cream)' }}>
//           <h2 className="font-serif font-semibold" style={{ fontSize:'1.15rem', color:'var(--text-primary)' }}>Recent Inquiries</h2>
//           <Link to="/admin/inquiries" className="font-sans text-xs hover:text-[var(--peach)] transition-colors" style={{ color:'var(--text-muted)' }}>View all →</Link>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr style={{ background:'#FDF7F2' }}>
//                 {['Name','Email','Service','Date','Status'].map(h=>(
//                   <th key={h} className="font-sans text-xs font-medium tracking-widest uppercase text-left px-6 py-3" style={{ color:'var(--text-muted)' }}>{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {(inquiries as {id:number,name:string,email:string,service_type:string,created_at:string,is_read:boolean}[] | undefined)?.slice(0,6).map((inq,i)=>(
//                 <tr key={inq.id} style={{ borderTop:'1px solid var(--cream)', background: i%2===0 ? 'white' : '#FEFCFB' }}>
//                   <td className="px-6 py-4 font-sans text-sm font-medium" style={{ color:'var(--text-primary)' }}>{inq.name}</td>
//                   <td className="px-6 py-4 font-sans text-sm" style={{ color:'var(--text-secondary)' }}>{inq.email}</td>
//                   <td className="px-6 py-4">
//                     <span className="font-sans text-xs px-2.5 py-1 rounded-full" style={{ background:'var(--apricot)', color:'var(--text-secondary)' }}>
//                       {inq.service_type.replace(/_/g,' ')}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 font-sans text-sm" style={{ color:'var(--text-muted)' }}>
//                     {new Date(inq.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short'})}
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className="font-sans text-xs px-2.5 py-1 rounded-full"
//                       style={{ background: inq.is_read ? '#F0FDF4' : '#FEF2F2', color: inq.is_read ? '#16A34A' : '#DC2626' }}>
//                       {inq.is_read ? 'Read' : 'Unread'}
//                     </span>
//                   </td>
//                 </tr>
//               )) ?? (
//                 <tr><td colSpan={5} className="px-6 py-12 text-center font-sans text-sm" style={{ color:'var(--text-muted)' }}>No inquiries yet</td></tr>
//               )}
//             </tbody>
//           </table>
//         </div>
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
// export default function AdminDashboard() {
//   const navigate = useNavigate()
//   const [sidebarOpen, setSidebarOpen] = useState(false)

//   const handleLogout = () => {
//     localStorage.removeItem('haliberry_admin_token')
//     navigate('/admin/login')
//   }

//   return (
//     <div className="min-h-screen flex" style={{ background:'#F8F5F2' }}>

//       {/* Sidebar */}
//       <aside
//         className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:flex ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
//         style={{ background:'var(--text-primary)', borderRight:'1px solid rgba(255,255,255,0.06)' }}
//       >
//         {/* Brand */}
//         <div className="px-6 py-7" style={{ borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
//           <p className="font-serif font-bold text-white" style={{ fontSize:'1.3rem' }}>Haliberry</p>
//           <p className="font-sans text-xs tracking-[0.18em] uppercase mt-0.5" style={{ color:'var(--peach)' }}>Admin Dashboard</p>
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
//           {NAV.map(({ label, href, icon })=>(
//             <NavLink key={href} to={href} end={href==='/admin'}
//               className={({ isActive })=>
//                 `flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all duration-200 ${
//                   isActive
//                     ? 'text-white'
//                     : 'hover:bg-white/5'
//                 }`
//               }
//               style={({ isActive })=>({
//                 background: isActive ? 'rgba(248,169,116,0.15)' : 'transparent',
//                 color: isActive ? 'var(--peach)' : 'rgba(255,255,255,0.55)',
//               })}
//               onClick={()=>setSidebarOpen(false)}
//             >
//               {icon}{label}
//             </NavLink>
//           ))}
//         </nav>

//         {/* Logout */}
//         <div className="px-4 py-5" style={{ borderTop:'1px solid rgba(255,255,255,0.08)' }}>
//           <button onClick={handleLogout}
//             className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-sans text-sm transition-colors hover:bg-white/5"
//             style={{ color:'rgba(255,255,255,0.4)' }}>
//             <LogOut size={16}/> Sign Out
//           </button>
//         </div>
//       </aside>

//       {/* Mobile overlay */}
//       {sidebarOpen && (
//         <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={()=>setSidebarOpen(false)}/>
//       )}

//       {/* Main */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Topbar */}
//         <header className="h-16 flex items-center justify-between px-6 bg-white shadow-luxury-sm sticky top-0 z-20">
//           <button className="lg:hidden" onClick={()=>setSidebarOpen(v=>!v)}>
//             {sidebarOpen ? <X size={22} style={{ color:'var(--text-primary)' }}/> : <Menu size={22} style={{ color:'var(--text-primary)' }}/>}
//           </button>
//           <div className="hidden lg:block font-sans text-sm" style={{ color:'var(--text-muted)' }}>
//             Haliberry Cake · Admin
//           </div>
//           <div className="flex items-center gap-3">
//             <Link to="/" target="_blank" className="font-sans text-xs flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors hover:bg-[var(--cream)]"
//               style={{ color:'var(--text-secondary)' }}>
//               <Eye size={14}/> View Site
//             </Link>
//             <div className="w-8 h-8 rounded-full flex items-center justify-center font-sans font-semibold text-xs text-white"
//               style={{ background:'var(--peach)' }}>A</div>
//           </div>
//         </header>

//         {/* Page content */}
//         <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
//           <Routes>
//             <Route index element={<Overview/>}/>
//             <Route path="products"  element={<AdminSection title="Products" description="Full product CRUD management UI coming in next phase."/>}/>
//             <Route path="classes"   element={<AdminSection title="Cake Classes" description="Class scheduling and management coming in next phase."/>}/>
//             <Route path="gallery"   element={<AdminSection title="Gallery" description="Image upload and management coming in next phase."/>}/>
//             <Route path="reviews"   element={<AdminSection title="Testimonials" description="Review moderation and approval coming in next phase."/>}/>
//             <Route path="inquiries" element={<AdminSection title="Inquiries" description="Full inquiry management inbox coming in next phase."/>}/>
//             <Route path="cic"       element={<AdminSection title="CIC Programmes" description="CIC programme management coming in next phase."/>}/>
//           </Routes>
//         </main>
//       </div>
//     </div>
//   )
// }