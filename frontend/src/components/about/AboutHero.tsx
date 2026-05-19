// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\about\AboutHero.tsx
import { motion } from 'framer-motion'
import { heroTextReveal } from '@/lib/animations'

export default function AboutHero() {
  return (
    <section
      className="relative min-h-[70vh] flex items-end overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #2C1810 0%, #52200E 50%, #7A3618 100%)' }}
    >
      {/* Ambient top-right orb */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F8A974, transparent 70%)', transform: 'translate(30%,-30%)' }}
      />
      {/* Blush bottom-left glow */}
      <div
        className="absolute bottom-0 left-1/3 w-[360px] h-[360px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F2B6B8, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
        <motion.span
          custom={0} variants={heroTextReveal} initial="hidden" animate="visible"
          className="inline-flex items-center gap-2 mb-5"
        >
          <span className="w-8 h-px" style={{ background: 'var(--peach)' }} />
          <span className="font-sans text-xs font-medium tracking-[0.22em] uppercase" style={{ color: 'var(--peach)' }}>
            The Founder
          </span>
        </motion.span>

        <motion.h1
          custom={1} variants={heroTextReveal} initial="hidden" animate="visible"
          className="font-serif font-semibold text-white mb-6"
          style={{ fontSize: 'clamp(2.75rem, 7vw, 5.5rem)', lineHeight: '1.05' }}
        >
          Meet{' '}
          <em className="not-italic" style={{ color: 'var(--peach)' }}>Halimot</em>
        </motion.h1>

        <motion.p
          custom={2} variants={heroTextReveal} initial="hidden" animate="visible"
          className="font-sans font-light max-w-xl"
          style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: 'rgba(255,255,255,0.65)', lineHeight: '1.75' }}
        >
          Baker. Entrepreneur. Community champion. A woman who turned the hardest
          chapters of her life into the most beautiful creations — and built a luxury
          brand rooted in healing, love, and artistry.
        </motion.p>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display:'block', width:'100%' }}>
          <path d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}