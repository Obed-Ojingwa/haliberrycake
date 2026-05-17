// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\ui\SectionHeader.tsx
import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '@/lib/animations'

interface Props {
  eyebrow?: string
  title: React.ReactNode
  subtitle?: string
  centered?: boolean
  light?: boolean   // white text for dark backgrounds
}

export default function SectionHeader({ eyebrow, title, subtitle, centered = true, light = false }: Props) {
  return (
    <motion.div
      className={`mb-14 ${centered ? 'text-center mx-auto max-w-2xl' : ''}`}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {eyebrow && (
        <motion.span
          variants={fadeUp}
          className="section-eyebrow block mb-3"
          style={{ color: 'var(--peach)' }}
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        variants={fadeUp}
        className="section-title"
        style={{ color: light ? 'white' : 'var(--text-primary)' }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          variants={fadeUp}
          className="section-subtitle mt-4"
          style={{ color: light ? 'rgba(255,255,255,0.65)' : 'var(--text-secondary)' }}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}