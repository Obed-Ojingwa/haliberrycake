// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\home\CICImpactSection.tsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Users, Heart, Sparkles, BookOpen } from 'lucide-react'
import { fadeLeft, fadeRight, fadeUp, staggerContainer } from '@/lib/animations'

const STATS = [
  { icon: <Users size={22}/>, value: '200+', label: 'Women Supported' },
  { icon: <BookOpen size={22}/>, value: '50+', label: 'Classes Delivered' },
  { icon: <Heart size={22}/>, value: '12',   label: 'Partner Charities' },
  { icon: <Sparkles size={22}/>, value: '6',  label: 'Years of Impact' },
]

export default function CICImpactSection() {
  return (
    <section
      className="py-24 lg:py-36 overflow-hidden relative"
      style={{ background:'linear-gradient(145deg,#F9C490 0%,#FBD6B2 55%,#FEF2E7 100%)' }}
    >
      {/* Ambient orb */}
      <div
        className="absolute top-1/2 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F8A974, transparent 70%)', transform: 'translate(40%, -50%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-6"
          >
            <motion.span variants={fadeLeft} className="font-sans text-xs font-medium tracking-[0.22em] uppercase" style={{ color: 'var(--peach)' }}>
              Community Impact
            </motion.span>

            <motion.h2
              variants={fadeLeft}
              className="font-serif font-semibold text-white"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', lineHeight: '1.1' }}
            >
              Baking as a Path to
              <br />
              <em className="not-italic" style={{ color: 'var(--peach)' }}>Healing & Empowerment</em>
            </motion.h2>

            <motion.p variants={fadeLeft} className="font-sans font-light leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem' }}>
              Haliberry CIC is our Community Interest Company — a sister organisation born from
              the belief that creativity and baking can be transformative tools for healing,
              confidence-building, and economic independence for women facing adversity in London.
            </motion.p>

            <motion.p variants={fadeLeft} className="font-sans font-light leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem' }}>
              Through subsidised baking classes, mentorship, and community programmes, we work
              with domestic abuse survivors, women in recovery, and marginalised communities — 
              helping them find their voice, their confidence, and sometimes, their livelihood.
            </motion.p>

            <motion.div variants={fadeLeft}>
              <Link to="/cic" className="btn-primary inline-flex">
                Learn About Haliberry CIC
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-2 gap-5"
          >
            {STATS.map(({ icon, value, label }) => (
              <motion.div
                key={label}
                variants={fadeRight}
                className="flex flex-col p-7 rounded-2xl"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(248,169,116,0.15)' }}
                >
                  <span style={{ color: 'var(--peach)' }}>{icon}</span>
                </div>
                <p
                  className="font-serif font-bold mb-1"
                  style={{ fontSize: '2.5rem', color: 'white', lineHeight: '1' }}
                >
                  {value}
                </p>
                <p className="font-sans text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {label}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}