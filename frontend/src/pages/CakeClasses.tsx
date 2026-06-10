// C:\Users\Melody\Documents\haliberrycake\frontend\src\pages\CakeClasses.tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Calendar, Clock, Users, ChevronRight, X, Send, CheckCircle, BookOpen } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { classesApi, inquiryApi } from '@/lib/api'
import { fadeUp, staggerContainer, fadeLeft, fadeRight } from '@/lib/animations'
import type { CakeClass } from '@/types'
import CTABanner from '@/components/home/CTABanner'
import WhatsAppFloatButton from '@/components/ui/WhatsAppFloatButton'

const schema = z.object({
  name:    z.string().min(2, 'Please enter your name'),
  email:   z.string().email('Valid email required'),
  phone:   z.string().optional(),
  message: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

const LEVEL_COLOURS: Record<string, string> = {
  beginner:     'var(--peach)',
  intermediate: '#F2B6B8',
  advanced:     '#F6E2B5',
}
const WHY_ITEMS = [
  { emoji: '🎂', title: 'Expert-Led',   body: 'Learn directly from Halimot — a cake artist with 6+ years of professional experience.' },
  { emoji: '🌸', title: 'Small Groups',  body: 'Intimate class sizes mean personal attention and a genuinely warm, welcoming atmosphere.' },
  { emoji: '🏠', title: 'Take Home',     body: 'You leave with your creations, a recipe pack, and skills to last a lifetime.' },
  { emoji: '❤️', title: 'Empowering',   body: 'Every class supports Haliberry CIC — helping women in the community heal through creativity.' },
]

function ClassCard({ cls, onBook }: { cls: CakeClass; onBook: (c: CakeClass) => void }) {
  // Backend returns available_slots; fall back chain handles all field name variants
  const available = cls.available_slots ?? cls.slots_remaining ?? (cls.total_slots ?? 0) - (cls.booked_slots ?? 0)
  const isFull = available <= 0
  const levelColour = LEVEL_COLOURS[cls.level ?? 'beginner'] ?? 'var(--peach)'
  return (
    <motion.div variants={fadeUp} className="card-luxury flex flex-col">
      <div className="h-2 rounded-t-[1.25rem]" style={{ background: `linear-gradient(90deg, ${levelColour}, var(--apricot))` }} />
      <div className="p-6 flex flex-col flex-1">
        <span className="inline-block self-start font-sans text-xs font-medium tracking-wider uppercase px-3 py-1 rounded-full mb-4"
          style={{ background: `${levelColour}22`, color: levelColour }}>
          {cls.level ?? 'beginner'}
        </span>
        <h3 className="font-serif font-semibold mb-2" style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{cls.title}</h3>
        <p className="font-sans text-sm leading-relaxed mb-5 flex-1" style={{ color: 'var(--text-secondary)' }}>{cls.description}</p>
        <div className="space-y-2 mb-5 pt-4" style={{ borderTop: '1px solid var(--cream)' }}>
          {[
            { icon: <Calendar size={14}/>, text: new Date(cls.class_date).toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' }) },
            { icon: <Clock size={14}/>,    text: `${cls.duration_hours ?? cls.duration} hours` },
            { icon: <Users size={14}/>,    text: isFull ? 'Fully Booked' : `${available} place${available !== 1 ? 's' : ''} remaining` },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2 font-sans text-sm"
              style={{ color: isFull && text.includes('Fully') ? '#E53935' : 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--peach)' }}>{icon}</span>{text}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <p className="font-serif font-bold" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>£{cls.price}</p>
          <button onClick={() => !isFull && onBook(cls)} disabled={isFull}
            className="btn-primary text-xs py-2.5 px-5" style={isFull ? { opacity:0.45, cursor:'not-allowed' } : {}}>
            {isFull ? 'Fully Booked' : <><span>Book Now</span><ChevronRight size={14}/></>}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function BookingModal({ cls, onClose }: { cls: CakeClass | null; onClose: () => void }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) })
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: FormValues) => inquiryApi.submit({ ...data, service_type: 'cake_class', message: `Booking: ${cls?.title}. ${data.message ?? ''}`.trim() }),
    onSuccess: () => reset(),
  })
  const inputStyle = { background: '#FDF7F2', color: 'var(--text-primary)' }
  return (
    <AnimatePresence>
      {cls && (
        <>
          <motion.div key="bd" className="fixed inset-0 z-50" style={{ background: 'rgba(44,24,16,0.6)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} onClick={onClose}/>
          <motion.div key="modal" className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            <motion.div className="w-full max-w-md bg-white rounded-[2rem] overflow-hidden shadow-luxury-lg relative"
              initial={{ scale:0.92, y:28 }} animate={{ scale:1, y:0 }} exit={{ scale:0.92, y:28 }}
              transition={{ type:'spring', stiffness:260, damping:24 }} onClick={e=>e.stopPropagation()}>
              <div className="px-8 pt-8 pb-5" style={{ background:'linear-gradient(135deg, #FDF7F2, #FBD6B2)' }}>
                <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/60 transition-colors"><X size={17} style={{ color:'var(--text-secondary)' }}/></button>
                <BookOpen size={22} style={{ color:'var(--peach)' }} className="mb-2"/>
                <h2 className="font-serif font-semibold" style={{ fontSize:'1.4rem', color:'var(--text-primary)' }}>Book: {cls.title}</h2>
                <p className="font-sans text-sm mt-1" style={{ color:'var(--text-secondary)' }}>£{cls.price} · {new Date(cls.class_date).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}</p>
              </div>
              <div className="px-8 py-7">
                {isSuccess ? (
                  <motion.div className="text-center py-6" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}>
                    <CheckCircle size={44} style={{ color:'var(--peach)' }} className="mx-auto mb-3"/>
                    <p className="font-serif text-xl mb-2" style={{ color:'var(--text-primary)' }}>Booking Request Sent!</p>
                    <p className="font-sans text-sm" style={{ color:'var(--text-secondary)' }}>We'll confirm your place within 24 hours. 🎂</p>
                    <button onClick={onClose} className="btn-primary mt-5 mx-auto">Close</button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(d => mutate(d))} className="space-y-4" noValidate>
                    {[
                      { label:'Your Name *', name:'name' as const, type:'text', placeholder:'Jane Smith', err:errors.name },
                      { label:'Email Address *', name:'email' as const, type:'email', placeholder:'jane@example.com', err:errors.email },
                      { label:'Phone (optional)', name:'phone' as const, type:'tel', placeholder:'+44 7XXX XXX XXX', err:undefined },
                    ].map(({ label, name, type, placeholder, err }) => (
                      <div key={name}>
                        <label className="font-sans text-xs font-medium mb-1.5 block" style={{ color:'var(--text-secondary)' }}>{label}</label>
                        <input {...register(name)} type={type} placeholder={placeholder}
                          className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none transition-colors focus:border-[var(--peach)]"
                          style={{ ...inputStyle, border: `1.5px solid ${err ? '#E53935' : '#E0D0C5'}` }}/>
                        {err && <p className="font-sans text-xs mt-1 text-red-500">{err.message}</p>}
                      </div>
                    ))}
                    <div>
                      <label className="font-sans text-xs font-medium mb-1.5 block" style={{ color:'var(--text-secondary)' }}>Any special requirements?</label>
                      <textarea {...register('message')} rows={2}
                        className="w-full px-4 py-3 rounded-xl font-sans text-sm outline-none transition-colors"
                        style={{ ...inputStyle, border:'1.5px solid #E0D0C5', resize:'none' }}
                        placeholder="Dietary needs, allergies, accessibility…"/>
                    </div>
                    <button type="submit" disabled={isPending} className="btn-primary w-full justify-center">
                      {isPending ? 'Sending…' : <><Send size={15}/> Confirm Booking Request</>}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function CakeClasses() {
  const [booking, setBooking] = useState<CakeClass | null>(null)
  const { data: classes = [], isLoading } = useQuery<CakeClass[]>({
    queryKey: ['classes'],
    queryFn: async () => { const { data } = await classesApi.list({ upcoming_only: true }); return data },
    staleTime: 5 * 60 * 1000,
  })
  return (
    <>
    <WhatsAppFloatButton />
      <section className="pt-32 pb-20 relative overflow-hidden bg-white border-b border-black/10">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-black/5"/>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-5">
            <motion.span variants={fadeLeft} className="font-sans text-xs tracking-[0.22em] uppercase block" style={{ color:'var(--peach)' }}>Baking Classes · London</motion.span>
            <motion.h1 variants={fadeLeft} className="font-serif font-semibold text-black"
              style={{ fontSize:'clamp(2.25rem,5vw,4rem)', lineHeight:'1.1'}}>
              Learn the Art of<br/><em className="not-italic" style={{ color:'rgba(0, 0, 0, 0.65)' }}>Beautiful Baking</em>
            </motion.h1>
            <motion.p variants={fadeLeft} className="font-sans font-light" style={{ color:'rgba(0, 0, 0, 0.65)', fontSize:'1.05rem', lineHeight:'1.75' }}>
              From beginner to confident baker — intimate London classes teaching real skills in a warm, empowering space.
            </motion.p>
            <motion.div variants={fadeLeft} className="flex flex-wrap gap-3">
              <a href="#classes" className="btn-primary">Browse Classes</a>
              <a href="/contact" className="btn-primary">Private Classes Available
              </a>
            </motion.div>
          </motion.div>
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="hidden lg:grid grid-cols-2 gap-4">
            {[{v:'50+',l:'Classes Delivered'},{v:'4.9★',l:'Average Rating'},{v:'All Levels',l:'Beginner to Advanced'},{v:'CIC',l:'Community Supported'}].map(({v,l})=>(
              <motion.div key={l} variants={fadeRight} className="rounded-2xl p-6 text-center"
                style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)' }}>
                <p className="font-serif font-bold mb-1" style={{ fontSize:'2rem', color:'var(--peach)' }}>{v}</p>
                <p className="font-sans text-xs" style={{ color:'rgba(217, 171, 18, 0.5)' }}>{l}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ display:'block', width:'100%', position:'absolute', bottom:0 }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="white"/>
        </svg>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-xl mx-auto mb-14" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true }}>
            <motion.span variants={fadeUp} className="section-eyebrow block mb-3">Why Haliberry?</motion.span>
            <motion.h2 variants={fadeUp} className="section-title">More Than a Class.<br/><em className="not-italic" style={{ color:'var(--peach)' }}>An Experience.</em></motion.h2>
          </motion.div>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.1 }}>
            {WHY_ITEMS.map(({ emoji, title, body })=>(
              <motion.div key={title} variants={fadeUp} className="rounded-2xl p-7 text-center"
                style={{ background:'linear-gradient(160deg,#FDF7F2,#F2E8E1)', border:'1px solid var(--cream)' }}>
                <div className="text-4xl mb-4">{emoji}</div>
                <h3 className="font-serif font-semibold mb-2" style={{ fontSize:'1.15rem', color:'var(--text-primary)' }}>{title}</h3>
                <p className="font-sans text-sm leading-relaxed" style={{ color:'var(--text-secondary)' }}>{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="classes" className="py-20" style={{ background:'linear-gradient(180deg,#FDF7F2 0%,white 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-xl mx-auto mb-14" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true }}>
            <motion.span variants={fadeUp} className="section-eyebrow block mb-3">Upcoming Classes</motion.span>
            <motion.h2 variants={fadeUp} className="section-title">Book Your <em className="not-italic" style={{ color:'var(--peach)' }}>Place</em></motion.h2>
          </motion.div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i=>(<div key={i} className="card-luxury animate-pulse h-80" style={{ background:'var(--cream)' }}/>))}
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-5">📅</p>
              <p className="font-serif text-2xl mb-2" style={{ color:'var(--text-primary)' }}>No upcoming classes right now</p>
              <p className="font-sans text-sm mb-6" style={{ color:'var(--text-muted)' }}>New dates added regularly — contact us to be notified or book a private session.</p>
              <a href="/contact" className="btn-primary">Request a Private Class</a>
            </div>
          ) : (
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8"
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.05 }}>
              {classes.map(cls=><ClassCard key={cls.id} cls={cls} onBook={setBooking}/>)}
            </motion.div>
          )}
        </div>
      </section>

      <BookingModal cls={booking} onClose={()=>setBooking(null)}/>
      <CTABanner/>
    </>
  )
}