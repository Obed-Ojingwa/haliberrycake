import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/animations'

const TESTIMONIALS = [
  {
    id: '1',
    quote: 'Haliberry Cake made our wedding cake unforgettable—the design and flavor were perfect.',
    name: 'Avery M.',
    role: 'Bride',
  },
  {
    id: '2',
    quote: 'The baking class was fun, informative, and full of delicious samples.',
    name: 'Jordan L.',
    role: 'Home Baker',
  },
  {
    id: '3',
    quote: 'Such warm customer service and incredible attention to every detail.',
    name: 'Sofie P.',
    role: 'Event Planner',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-8 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span variants={fadeUp} className="section-eyebrow block mb-3">
            What Clients Say
          </motion.span>
          <motion.h2 variants={fadeUp} className="section-title">
            Trusted feedback from families and partners
          </motion.h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <motion.div
              key={item.id}
              className="rounded-3xl border border-[var(--peach)]/10 p-8 bg-[var(--cream)]"
              variants={fadeUp}
            >
              <div className="mb-4 text-[var(--peach)]">
                <Star size={20} />
              </div>
              <p className="font-serif text-lg leading-8 text-[var(--text-primary)] mb-6">
                “{item.quote}”
              </p>
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-[var(--text-muted)]">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
