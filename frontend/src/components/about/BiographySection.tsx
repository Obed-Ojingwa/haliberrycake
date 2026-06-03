// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\about\BiographySection.tsx
import { motion } from 'framer-motion'
import { fadeLeft, fadeRight, staggerContainer } from '@/lib/animations'

export default function BiographySection() {
  return (
    <section className="py-24 lg:py-36 overflow-hidden" style={{ background: 'white' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-start">

          {/* Sticky image column */}
          <motion.div
            className="relative lg:sticky lg:top-28"
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Primary photo card */}
            <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-[var(--cream)]">
              <img
                src="/haliberry_founder.jpeg"
                alt="Portrait of Halimot"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Floating quote card */}
            <motion.div
              className="absolute -bottom-8 -right-4 lg:-right-10 bg-white rounded-2xl p-6 shadow-luxury max-w-[230px]"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <p className="font-serif italic mb-3" style={{ fontSize: '1rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                "Every cake tells a story. Mine started with healing."
              </p>
              <span className="font-sans text-xs tracking-wide" style={{ color: 'var(--peach)' }}>— Halimot</span>
            </motion.div>

            {/* Dot decoration */}
            <div
              className="absolute -top-8 -left-8 w-32 h-32 opacity-30"
              style={{
                backgroundImage: 'radial-gradient(circle, var(--blush) 1.5px, transparent 1.5px)',
                backgroundSize: '14px 14px',
              }}
            />
          </motion.div>

          {/* Text column */}
          <motion.div
            className="space-y-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <motion.span variants={fadeRight} className="section-eyebrow block">
              Her Story
            </motion.span>

            <motion.h2 variants={fadeRight} className="section-title">
              Born from Adversity,
              <br />
              <em className="not-italic" style={{ color: 'var(--peach)' }}>Raised in Creativity</em>
            </motion.h2>

            {[
              `Halimot's journey into baking was not the kind found in glossy cookbooks or
              culinary school brochures. It began quietly, in a kitchen that became her sanctuary —
              a place where she could breathe when the world felt too heavy. What started as
              a way to cope became a calling.`,

              `Growing up, Halimot had always been drawn to making things beautiful. But it
              was through the alchemy of flour, butter, and sugar that she found her truest
              form of expression. She taught herself to bake from scratch — watching tutorials
              late at night, practising on weekend mornings, gifting cakes to neighbours who
              soon became her first loyal customers.`,

              `In 2020, she took the leap, launching Haliberry Cake from her home kitchen
              in London with nothing but her talent, her resolve, and an Instagram page.
              Within months, enquiries were flooding in. Wedding commissions. Birthday
              masterpieces. Corporate events. The brand grew not through advertising, but
              through word of mouth, because every cake Halimot made carried something
              intangible: intention.`,

              `Today, Haliberry Cake is a celebrated luxury bakery brand serving clients
              across London and beyond. But Halimot has never forgotten where it all began.
              That's why she founded Haliberry CIC — to bring the healing power of baking
              to women who need it most. Her story is far from over. It is, in every sense,
              still rising.`,
            ].map((para, i) => (
              <motion.p
                key={i}
                variants={fadeRight}
                className="font-sans font-light leading-[1.85]"
                style={{ fontSize: '1.05rem', color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}
              >
                {para}
              </motion.p>
            ))}

            {/* Credentials strip */}
            <motion.div
              variants={fadeRight}
              className="grid grid-cols-2 gap-4 pt-4"
            >
              {[
                { label: 'Founded', value: '2020' },
                { label: 'Based in', value: 'London, UK' },
                { label: 'Speciality', value: 'Luxury Cakes' },
                { label: 'Community', value: 'Haliberry CIC' },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="rounded-xl p-4"
                  style={{ background: 'var(--cream)', border: '1px solid var(--apricot)' }}
                >
                  <p className="font-sans text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
                  <p className="font-serif font-semibold" style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{value}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}