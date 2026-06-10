// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\about\ValuesSection.tsx
import { motion } from 'framer-motion'
import { Heart, Star, Sparkles, Users, Leaf, Shield } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/animations'

const VALUES = [
  {
    icon: <Heart size={24} />,
    title: 'Made with Love',
    description: 'Every cake is crafted with genuine care and emotional investment. Baking is our love language.',
    bg: 'var(--cream)',
    color: 'var(--text-primary)',
  },
  {
    icon: <Star size={24} />,
    title: 'Uncompromising Quality',
    description: 'We use only the finest ingredients — locally sourced where possible — and never cut corners on artistry.',
    bg: 'var(--cream)',
    color: 'var(--text-secondary)',
  },
  {
    icon: <Sparkles size={24} />,
    title: 'Creativity as Medicine',
    description: 'We believe the act of creating is healing. Baking taught us this — and we pass it on through every class.',
    bg: 'var(--cream)',
    color: 'var(--text-primary)',
  },
  {
    icon: <Users size={24} />,
    title: 'Community First',
    description: 'Haliberry CIC exists because no one should be left behind. We invest in women and communities.',
    bg: 'var(--cream)',
    color: 'var(--text-secondary)',
  },
  {
    icon: <Leaf size={24} />,
    title: 'Thoughtful Sourcing',
    description: 'From free-range eggs to fairtrade chocolate — we care about where our ingredients come from.',
    bg: 'var(--cream)',
    color: 'var(--text-primary)',
  },
  {
    icon: <Shield size={24} />,
    title: 'Trust & Transparency',
    description: 'We honour every commitment. Delivery times, pricing, ingredients — always clear, always honest.',
    bg: 'var(--cream)',
    color: 'var(--text-secondary)',
  },
]

export default function ValuesSection() {
  return (
    <section
      className="py-24 lg:py-32 bg-white border-t border-black/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center max-w-xl mx-auto mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span variants={fadeUp} className="font-sans text-xs font-medium tracking-[0.22em] uppercase mb-3 block" style={{ color: 'var(--peach)' }}>
            What We Stand For
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="font-serif font-semibold text-white"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', lineHeight: '1.1' }}
          >
            Our Core
            <em className="not-italic" style={{ color: 'var(--peach)' }}> Values</em>
          </motion.h2>
        </motion.div>

        {/* Values grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {VALUES.map(({ icon, title, description, bg, color }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              whileHover={{ y: -4, transition: { duration: 0.25 } }}
              className="rounded-2xl p-7 flex flex-col gap-4"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: bg, color }}
              >
                {icon}
              </div>
              <div>
                <h3 className="font-serif font-semibold text-black mb-2" style={{ fontSize: '1.15rem' }}>
                  {title}
                </h3>
                <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(0,0,0,0.55)' }}>
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}