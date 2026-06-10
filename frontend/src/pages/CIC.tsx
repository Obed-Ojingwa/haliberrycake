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
      <section className="pt-32 pb-20 relative overflow-hidden bg-white border-b border-black/10"> 
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-black/5"/>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
            <motion.span variants={fadeUp} className="font-sans text-xs tracking-[0.22em] uppercase block" style={{ color:'var(--peach)' }}>Community Interest Company</motion.span>
            <motion.h1 variants={fadeUp} className="font-serif font-semibold text-black"
              style={{ fontSize:'clamp(2.5rem,6vw,4.5rem)', lineHeight:'1.08' }}>
              Haliberry CIC<br/><em className="not-italic" style={{ color:'var(--peach)' }}>From Survival to Stability</em>
            </motion.h1>
            <motion.p variants={fadeUp} className="font-sans font-light max-w-2xl mx-auto"
              style={{ color:'rgba(0,0,0,0.65)', fontSize:'1.1rem', lineHeight:'1.75' }}>
              Haliberry CIC is a women-led social enterprise based in London, dedicated to helping women rebuild confidence, develop practical skills and create new opportunities for themselves.
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
                className="text-center rounded-2xl p-8 bg-white border border-gray-200">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ background:'var(--apricot)', color:'var(--peach)' }}>{icon}</div>
                <p className="font-serif font-bold mb-1" style={{ fontSize:'2.25rem', color:'var(--text-primary)' }}>{value}</p>
                <p className="font-sans text-sm" style={{ color:'var(--text-muted)' }}>{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* HALIBERRY CIC Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true }} className="space-y-8">
            {/* Title */}
            <motion.h1 variants={fadeUp} className="font-serif font-semibold text-center" style={{ fontSize:'clamp(2.5rem,6vw,4rem)', lineHeight:'1.2' }}>
              HALIBERRY CIC<br/><span className="block font-sans font-light text-lg" style={{ color:'var(--peach)' }}>From Survival to Stability</span>
            </motion.h1>

            {/* Intro paragraph */}
            <motion.p variants={fadeUp} className="font-sans font-light text-center max-w-2xl mx-auto leading-relaxed" style={{ color:'var(--text-secondary)', fontSize:'1.05rem' }}>
              Haliberry CIC is a women-led social enterprise based in London, dedicated to helping women rebuild confidence, develop practical skills and create new opportunities for themselves.
            </motion.p>

            {/* Founded */}
            <motion.p variants={fadeUp} className="font-sans font-light max-w-2xl mx-auto leading-relaxed" style={{ color:'var(--text-primary)', fontSize:'1rem' }}>
              Founded by Halimot Ogunnaike, Haliberry CIC was created to support women who have experienced trauma, displacement, abuse, isolation, financial hardship or other life challenges. We understand that rebuilding confidence takes time, support and opportunity.
            </motion.p>

            {/* Mission */}
            <motion.p variants={fadeUp} className="font-sans font-light max-w-2xl mx-auto leading-relaxed" style={{ color:'var(--text-primary)', fontSize:'1rem', marginTop:'1rem' }}>
              Our mission is to provide safe, inclusive and empowering spaces where women can learn, grow and move forward.
            </motion.p>

            {/* Who We Support */}
            <motion.h2 variants={fadeUp} className="font-serif font-semibold text-left" style={{ fontSize:'1.5rem', marginTop:'2rem' }}>
              Who We Support
            </motion.h2>
            <motion.ul variants={fadeUp} className="list-disc pl-6 space-y-2 font-sans font-light" style={{ color:'var(--text-primary)', fontSize:'1rem' }}>
              <li>Asylum seekers and refugees</li>
              <li>Survivors of trafficking and modern slavery</li>
              <li>Survivors of FGM/C</li>
              <li>Women affected by domestic abuse</li>
              <li>Women experiencing homelessness or financial hardship</li>
              <li>Young adults and vulnerable women seeking support and opportunity</li>
            </motion.ul>

            {/* What We Do */}
            <motion.h2 variants={fadeUp} className="font-serif font-semibold text-left" style={{ fontSize:'1.5rem', marginTop:'2rem' }}>
              What We Do
            </motion.h2>
            <motion.p variants={fadeUp} className="font-sans font-light max-w-2xl mx-auto leading-relaxed" style={{ color:'var(--text-primary)', fontSize:'1rem' }}>
              Through practical training and community programmes, we help women develop valuable skills, confidence and pathways towards independence.
            </motion.p>
            <motion.ol variants={fadeUp} className="list-decimal pl-6 space-y-2 font-sans font-light" style={{ color:'var(--text-primary)', fontSize:'1rem' }}>
              <li>Baking and cake decorating training</li>
              <li>Coffee and barista skills training</li>
              <li>Confidence-building workshops</li>
              <li>Community empowerment programmes</li>
              <li>Employability and progression support</li>
              <li>Mentoring and personal development opportunities</li>
            </motion.ol>

            {/* Why We Do It */}
            <motion.h2 variants={fadeUp} className="font-serif font-semibold text-left" style={{ fontSize:'1.5rem', marginTop:'2rem' }}>
              Why We Do It
            </motion.h2>
            <motion.p variants={fadeUp} className="font-sans font-light max-w-2xl mx-auto leading-relaxed" style={{ color:'var(--text-primary)', fontSize:'1rem' }}>
              Too many women are expected to rebuild their lives without enough support, opportunity or confidence.
            </motion.p>
            <motion.p variants={fadeUp} className="font-sans font-light max-w-2xl mx-auto leading-relaxed" style={{ color:'var(--text-primary)', fontSize:'1rem', marginTop:'0.5rem' }}>
              At Haliberry CIC, we believe that lasting progress requires more than a one-off intervention. It requires safety, consistency, dignity, structure and time.
            </motion.p>
            <motion.p variants={fadeUp} className="font-sans font-light max-w-2xl mx-auto leading-relaxed" style={{ color:'var(--text-primary)', fontSize:'1rem', marginTop:'0.5rem' }}>
              We use baking, creativity and practical learning as tools for empowerment, helping women reconnect with their strengths, develop new skills and build hope for the future.
            </motion.p>

            {/* Our Vision */}
            <motion.h2 variants={fadeUp} className="font-serif font-semibold text-left" style={{ fontSize:'1.5rem', marginTop:'2rem' }}>
              Our Vision
            </motion.h2>
            <motion.p variants={fadeUp} className="font-sans font-light max-w-2xl mx-auto leading-relaxed" style={{ color:'var(--text-primary)', fontSize:'1rem' }}>
              We believe every woman deserves the opportunity to thrive, regardless of her background or circumstances.
            </motion.p>
            <motion.p variants={fadeUp} className="font-sans font-light max-w-2xl mx-auto leading-relaxed" style={{ color:'var(--text-primary)', fontSize:'1rem', marginTop:'0.5rem' }}>
              Our vision is a future where women have access to the skills, confidence, community and support they need to move from survival towards stability, independence and opportunity.
            </motion.p>
            <motion.p variants={fadeUp} className="font-sans font-light max-w-2xl mx-auto leading-relaxed" style={{ color:'var(--text-primary)', fontSize:'1rem', marginTop:'0.5rem' }}>
              At Haliberry CIC, we are building more than training programmes.
            </motion.p>
            <motion.p variants={fadeUp} className="font-sans font-light max-w-2xl mx-auto leading-relaxed" style={{ color:'var(--text-primary)', fontSize:'1rem', marginTop:'0.5rem' }}>
              We are building confidence, community and brighter futures.
            </motion.p>

            {/* Call to action */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 justify-center mt-8">
              <Link to="/contact" className="btn-ghost">Get Involved</Link>
              <a href="#programmes" className="btn-primary"><Heart size={16}/> Support Our Mission</a>
            </motion.div>
          </motion.div>
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