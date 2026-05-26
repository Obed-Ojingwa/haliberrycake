// C:\Users\Melody\Documents\haliberrycake\frontend\src\pages\CIC.tsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Heart, Users, BookOpen, Sparkles } from 'lucide-react'
import { fadeUp, fadeLeft, fadeRight, staggerContainer } from '@/lib/animations'
import { api } from '@/lib/api'
import type { CICProgram } from '@/types'
import CTABanner from '@/components/home/CTABanner'
import WhatsAppFloatButton from '@/components/ui/WhatsAppFloatButton'

const IMPACT = [
  { icon:<Users size={22}/>,   value:'200+', label:'Women Supported' },
  { icon:<BookOpen size={22}/>,value:'50+',  label:'Classes Delivered' },
  { icon:<Heart size={22}/>,   value:'12',   label:'Partner Charities' },
  { icon:<Sparkles size={22}/>,value:'6yrs', label:'Years of Impact' },
]

export default function CIC() {
  const { data: programs = [] } = useQuery<CICProgram[]>({
    queryKey:['cic'],
    queryFn: async()=>{ const { data }= await api.get('/api/v1/cic'); return data },
    staleTime: 10*60*1000,
  })

  return (
    <>
    <WhatsAppFloatButton />
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden"
        style={{ background:'linear-gradient(145deg,#2C1810 0%,#52200E 55%,#7A3618 100%)' }}>
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage:'radial-gradient(circle at 70% 40%, #F8A974, transparent 55%)' }}/>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.span variants={fadeUp} className="font-sans text-xs tracking-[0.22em] uppercase block" style={{ color:'var(--peach)' }}>Community Interest Company</motion.span>
            <motion.h1 variants={fadeUp} className="font-serif font-semibold text-white"
              style={{ fontSize:'clamp(2.5rem,6vw,4.5rem)', lineHeight:'1.08' }}>
              Baking as a Path to<br/><em className="not-italic" style={{ color:'var(--peach)' }}>Healing &amp; Empowerment</em>
            </motion.h1>
            <motion.p variants={fadeUp} className="font-sans font-light max-w-2xl mx-auto"
              style={{ color:'rgba(255,255,255,0.65)', fontSize:'1.1rem', lineHeight:'1.75' }}>
              Haliberry CIC uses the transformative power of baking to support women facing adversity in London —
              building confidence, community, and independence one class at a time.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 justify-center">
              <a href="#programmes" className="btn-primary"><Heart size={16}/> Support Our Mission</a>
              <Link to="/contact" className="btn-ghost">Get Involved</Link>
            </motion.div>
          </motion.div>
        </div>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ display:'block',width:'100%',position:'absolute',bottom:0 }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="white"/>
        </svg>
      </section>

      {/* Impact stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true }}>
            {IMPACT.map(({ icon, value, label })=>(
              <motion.div key={label} variants={fadeUp}
                className="text-center rounded-2xl p-8"
                style={{ background:'linear-gradient(160deg,#FDF7F2,#F2E8E1)', border:'1px solid var(--cream)' }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ background:'var(--apricot)', color:'var(--peach)' }}>{icon}</div>
                <p className="font-serif font-bold mb-1" style={{ fontSize:'2.25rem', color:'var(--text-primary)' }}>{value}</p>
                <p className="font-sans text-sm" style={{ color:'var(--text-muted)' }}>{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our story */}
      <section className="py-20" style={{ background:'linear-gradient(180deg,white 0%,#FDF7F2 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true }} className="space-y-5">
              <motion.span variants={fadeLeft} className="section-eyebrow block">Our Mission</motion.span>
              <motion.h2 variants={fadeLeft} className="section-title">
                Why We Started<br/><em className="not-italic" style={{ color:'var(--peach)' }}>Haliberry CIC</em>
              </motion.h2>
              {['Haliberry CIC was founded on the belief that creativity is medicine. Baking gave Halimot her own path back to confidence and joy — and she knew other women deserved that same experience.',
                'We partner with domestic abuse shelters, women\'s refuges, mental health charities, and community centres across London — bringing free and subsidised baking workshops to women who need them most.',
                'Our programmes are designed to build confidence, develop marketable skills, and create pathways toward financial independence and wellbeing. Every cake baked in our classes is a step forward.'
              ].map((p,i)=>(
                <motion.p key={i} variants={fadeLeft} className="font-sans font-light leading-relaxed"
                  style={{ color: i===0 ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize:'1.02rem' }}>{p}</motion.p>
              ))}
              <motion.div variants={fadeLeft}>
                <Link to="/contact" className="btn-primary inline-flex">Get Involved <ArrowRight size={16}/></Link>
              </motion.div>
            </motion.div>
            <motion.div variants={fadeRight} initial="hidden" whileInView="visible" viewport={{ once:true }}
              className="aspect-[4/5] rounded-[2rem] flex items-center justify-center"
              style={{ background:'linear-gradient(135deg,var(--cream),var(--apricot),var(--blush))' }}>
              <div className="text-center p-10">
                <span className="text-8xl">🤝</span>
                <p className="font-serif italic mt-4" style={{ color:'var(--text-muted)' }}>CIC photo / impact imagery</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Programmes */}
      {programs.length > 0 && (
        <section id="programmes" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center max-w-xl mx-auto mb-14"
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true }}>
              <motion.span variants={fadeUp} className="section-eyebrow block mb-3">Our Programmes</motion.span>
              <motion.h2 variants={fadeUp} className="section-title">How We <em className="not-italic" style={{ color:'var(--peach)' }}>Help</em></motion.h2>
            </motion.div>
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.05 }}>
              {programs.map(p=>(
                <motion.div key={p.id} variants={fadeUp} className="card-luxury p-7 space-y-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background:'var(--apricot)' }}>
                    <Heart size={22} style={{ color:'var(--peach)' }}/>
                  </div>
                  <h3 className="font-serif font-semibold" style={{ fontSize:'1.15rem', color:'var(--text-primary)' }}>{p.title}</h3>
                  <p className="font-sans text-sm leading-relaxed" style={{ color:'var(--text-secondary)' }}>{p.description}</p>
                  {p.impact_stats && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {Object.entries(p.impact_stats).map(([k,v])=>(
                        <span key={k} className="font-sans text-xs px-3 py-1 rounded-full"
                          style={{ background:'var(--cream)', color:'var(--text-secondary)' }}>
                          {v} {k.replace(/_/g,' ')}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      <CTABanner/>
    </>
  )
}