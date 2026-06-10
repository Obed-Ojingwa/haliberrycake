// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\about\TimelineSection.tsx
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'

const TIMELINE = [
  {
    year: '2018',
    title: 'The First Bake',
    description: 'Halimot bakes her first cake for a friend\'s birthday. The response is overwhelming — and something shifts inside her.',
    accent: 'var(--peach)',
  },
  {
    year: '2019',
    title: 'Learning the Craft',
    description: 'She immerses herself in the art of cake decorating — practising fondant work, sugar flowers, and tiered structures with fierce dedication.',
    accent: 'var(--blush)',
  },
  {
    year: '2020',
    title: 'Haliberry Cake is Born',
    description: 'During the pandemic, Halimot launches Haliberry Cake from her London kitchen. The first ten orders come from Instagram within two weeks.',
    accent: 'var(--golden)',
  },
  {
    year: '2021',
    title: 'First Wedding Commission',
    description: 'Haliberry Cake delivers its first three-tier wedding cake. The bride cries. The reviews pour in. The waitlist begins.',
    accent: 'var(--peach)',
  },
  {
    year: '2022',
    title: 'Classes Launch',
    description: 'Halimot begins hosting intimate baking workshops in London, teaching women the skills that changed her own life.',
    accent: 'var(--blush)',
  },
  {
    year: '2023',
    title: 'Haliberry CIC Founded',
    description: 'The Community Interest Company is registered — formalising the mission to use baking as a vehicle for empowerment, healing, and economic independence.',
    accent: 'var(--golden)',
  },
  {
    year: '2024+',
    title: 'Still Rising',
    description: 'Haliberry Cake continues to grow — expanding classes, growing the CIC, and delivering luxury creations across London and beyond.',
    accent: 'var(--peach)',
  },
]

export default function TimelineSection() {
  return (
    <section className="py-24 lg:py-32 bg-white border-t border-black/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span variants={fadeUp} className="section-eyebrow block mb-3">The Journey</motion.span>
          <motion.h2 variants={fadeUp} className="section-title">
            Milestones in
            <em className="not-italic" style={{ color: 'var(--peach)' }}> Her Story</em>
          </motion.h2>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-5 lg:left-1/2 top-0 bottom-0 w-px"
            style={{ background: 'rgba(0,0,0,0.03)', transform: 'translateX(-50%)' }}
          />

          <div className="space-y-10">
            {TIMELINE.map((item, i) => {
              const isRight = i % 2 === 0
              return (
                <motion.div
                  key={item.year}
                  className={`relative flex items-start gap-6 lg:gap-0 ${isRight ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                  initial={{ opacity: 0, x: isRight ? -24 : 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {/* Card */}
                  <div className={`pl-14 lg:pl-0 lg:w-5/12 ${isRight ? 'lg:pr-12 lg:text-right' : 'lg:pl-12 lg:text-left'}`}>
                    <div
                      className="rounded-2xl p-6 shadow-luxury-sm"
                      style={{ background: 'white', border: '1px solid var(--cream)' }}
                    >
                      <span
                        className="font-serif font-bold block mb-1"
                        style={{ fontSize: '1.5rem', color: item.accent }}
                      >
                        {item.year}
                      </span>
                      <h3 className="font-serif font-semibold mb-2" style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                        {item.title}
                      </h3>
                      <p className="font-sans text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Centre dot — desktop */}
                  <div className="hidden lg:flex lg:w-2/12 justify-center">
                    <div
                      className="w-4 h-4 rounded-full border-4 border-white mt-6 flex-shrink-0"
                      style={{ background: item.accent, boxShadow: `0 0 0 3px ${item.accent}33` }}
                    />
                  </div>

                  {/* Mobile dot */}
                  <div
                    className="absolute left-5 top-6 w-3 h-3 rounded-full border-2 border-white flex-shrink-0 lg:hidden"
                    style={{ background: item.accent, transform: 'translateX(-50%)' }}
                  />

                  {/* Empty spacer for opposite side */}
                  <div className="hidden lg:block lg:w-5/12" />
                </motion.div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}