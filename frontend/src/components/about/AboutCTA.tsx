// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\about\AboutCTA.tsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Cake, BookOpen, Heart } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/animations'

export default function AboutCTA() {
  return (
    <section className="py-24 lg:py-32" style={{ background: 'white' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="rounded-[2.5rem] p-10 lg:p-16 text-center overflow-hidden relative bg-white"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-20 blur-2xl" style={{ background: 'white', transform: 'translate(-30%,-30%)' }} />
          <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full opacity-15 blur-2xl" style={{ background: 'white', transform: 'translate(25%,25%)' }} />

          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">
              <motion.span variants={fadeUp} className="font-sans text-xs font-medium tracking-[0.22em] uppercase text-black/80">
                Be Part of the Story
              </motion.span>
              <motion.h2 variants={fadeUp} className="font-serif font-semibold text-black" style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', lineHeight: '1.1' }}>
                Your Celebration Deserves
                <br />Something Extraordinary
              </motion.h2>
              <motion.p variants={fadeUp} className="font-sans font-light text-black/80" style={{ fontSize: '1.05rem', lineHeight: '1.75' }}>
                Whether you want a show-stopping cake or the confidence to bake your own... 
                Halimot and the Haliberry team are here for you.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-white font-sans font-medium text-sm px-7 py-3.5 rounded-full shadow-luxury transition-all hover:-translate-y-0.5"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Cake size={16} /> Order a Cake <ArrowRight size={15} />
                </Link>
                <Link
                  to="/cake-classes"
                  className="inline-flex items-center gap-2 font-sans font-medium text-sm px-7 py-3.5 rounded-full transition-all hover:-translate-y-0.5"
                  style={{ border: '2px solid rgba(0,0,0,0.7)', color: 'var(--text-secondary)' }}
                >
                  <BookOpen size={16} /> Book a Class
                </Link>
                <Link
                  to="/cic"
                  className="inline-flex items-center gap-2 font-sans font-medium text-sm px-7 py-3.5 rounded-full transition-all hover:-translate-y-0.5"
                  style={{ border: '2px solid rgba(0,0,0,0.7)', color: 'var(--text-secondary)' }}
                >
                  <Heart size={16} /> Support the CIC
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}