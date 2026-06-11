// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\home\CTABanner.tsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Cake, BookOpen } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/animations'

export default function CTABanner() {
  return (
    <section
      className="py-8 lg:py-16 relative overflow-hidden bg-white border-b border-black/10"
    >
      {/* Decorative shapes */}
      <div
        className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 blur-2xl"
        style={{ background: 'white', transform: 'translate(-30%, -30%)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-20 blur-2xl"
        style={{ background: 'white', transform: 'translate(30%, 30%)' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-6"
        >
          <motion.span variants={fadeUp} className="font-sans text-xs font-medium tracking-[0.22em] uppercase" style={{ color: 'rgba(0,0,0,0.8)' }}>
            Ready to Begin?
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="font-serif font-semibold text-white"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.1' }}
          >
            Let's Create Something
            <br />
            Truly Unforgettable
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="font-sans font-light mx-auto max-w-lg"
            style={{ fontSize: '1.05rem', color: 'rgba(0,0,0,0.8)', lineHeight: '1.7' }}
          >
            Whether you're planning a wedding, a birthday, or simply want to learn the art of baking —
            Haliberry Cake is here to make it magical.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-white font-sans font-medium text-sm px-7 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Cake size={16} />
              Order Your Cake
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/cake-classes"
              className="inline-flex items-center gap-2 font-sans font-medium text-sm px-7 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5"
              style={{ border: '2px solid rgba(0,0,0,0.7)', color: 'var(--text-secondary)' }}
            >
              <BookOpen size={16} />
              Book a Baking Class
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}