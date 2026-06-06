// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\home\HeroSection.tsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Cake, Star, BookOpen } from 'lucide-react'
import { heroTextReveal, imageFloat } from '@/lib/animations'

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background:'linear-gradient(145deg,#F9C490 0%,#FBD6B2 55%,#FEF2E7 100%)' }}
    >
      {/* Ambient orb blobs */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F8A974, transparent 70%)', transform: 'translate(30%, -30%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #F2B6B8, transparent 70%)', transform: 'translate(-30%, 30%)' }}
      />

      {/* Floating decorative cake silhouette shapes */}
      <motion.div
        className="absolute top-1/4 right-8 lg:right-20 w-[340px] h-[420px] rounded-3xl overflow-hidden opacity-30 hidden md:block"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        variants={imageFloat}
        initial="rest"
        animate="float"
      />
      <motion.div
        className="absolute top-1/3 right-12 lg:right-24 w-[280px] h-[340px] rounded-3xl overflow-hidden hidden lg:block"
        style={{ background: 'rgba(248,169,116,0.06)', border: '1px solid rgba(248,169,116,0.12)' }}
        variants={imageFloat}
        initial="rest"
        animate="float"
        transition={{ delay: 1.5 }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[1rem] pb-20 lg:pt-[2rem]">
        <div className="max-w-3xl">

          {/* Eyebrow */}
          <motion.div
            custom={0}
            variants={heroTextReveal}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 mb-6"
          >
            <span className="w-8 h-px bg-[var(--peach)]" />
            <span className="font-sans text-xs font-medium tracking-[0.22em] uppercase" style={{ color: 'var(--peach)' }}>
              London's Luxury Bakery
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            custom={1}
            variants={heroTextReveal}
            initial="hidden"
            animate="visible"
            className="font-serif text-white mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)', lineHeight: '1.05', fontWeight: 600 }}
          >
            More Than Cake —{' '}
            <em
              className="not-italic block"
              style={{ color: 'var(--peach)' }}
            >
              A Story of Strength,
            </em>
            Healing &amp; Creativity
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            custom={2}
            variants={heroTextReveal}
            initial="hidden"
            animate="visible"
            className="font-sans font-light mb-10 max-w-xl"
            style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7' }}
          >
            Luxury cakes, desserts, baking classes &amp; empowerment programmes in London.
            Every creation carries intention, warmth, and artistry.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            custom={3}
            variants={heroTextReveal}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap gap-3"
          >
            <Link to="/shop" className="btn-primary">
              <Cake size={16} />
              Order Now
              <ArrowRight size={15} />
            </Link>
            <Link to="/cake-classes" className="btn-ghost">
              <BookOpen size={16} />
              Book a Class
            </Link>
            <Link to="/cic" className="btn-ghost">
              <Star size={16} />
              Support Haliberry CIC
            </Link>
          </motion.div>

          {/* Social proof strip */}
          <motion.div
            custom={4}
            variants={heroTextReveal}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center gap-6 mt-14 pt-8"
            style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
          >
            {[
              { value: '500+', label: 'Cakes Delivered' },
              { value: '4.9★', label: 'Customer Rating' },
              { value: '6yrs', label: 'Of Artistry' },
              { value: 'CIC', label: 'Community Impact' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-serif font-semibold" style={{ fontSize: '1.5rem', color: 'var(--peach)' }}>{value}</p>
                <p className="font-sans text-xs tracking-wide" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: 'block', width: '100%' }}>
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}