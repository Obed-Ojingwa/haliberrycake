// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\home\ProductShowcase.tsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Heart } from 'lucide-react'
import { fadeUp, staggerContainer } from '@/lib/animations'

const CATEGORIES = [
  {
    id: 'wedding',
    label: 'Wedding Cakes',
    description: 'Bespoke tiered masterpieces for your most cherished day.',
    emoji: '💍',
    from: '#FBD6B2',
    to: '#F8A974',
    href: '/shop#wedding',
    startingFrom: '£350',
  },
  {
    id: 'birthday',
    label: 'Birthday Cakes',
    description: 'Celebration cakes crafted with personality and panache.',
    emoji: '🎂',
    from: '#F2B6B8',
    to: '#F8A974',
    href: '/shop#birthday',
    startingFrom: '£120',
  },
  {
    id: 'cupcakes',
    label: 'Cupcakes',
    description: 'Perfectly individual bites of luxury.',
    emoji: '🧁',
    from: '#F6E2B5',
    to: '#FBD6B2',
    href: '/shop#cupcakes',
    startingFrom: '£48',
  },
  {
    id: 'desserts',
    label: 'Dessert Boxes',
    description: 'Curated boxes of joy — gifting at its finest.',
    emoji: '🍮',
    from: '#F2E8E1',
    to: '#F6E2B5',
    href: '/shop#desserts',
    startingFrom: '£35',
  },
  {
    id: 'treats',
    label: 'Luxury Treats',
    description: 'Handcrafted chocolates, petit fours, and sweet morsels.',
    emoji: '🍫',
    from: '#FBD6B2',
    to: '#F2B6B8',
    href: '/shop#treats',
    startingFrom: '£22',
  },
]

export default function ProductShowcase() {
  return (
    <section className="py-8 lg:py-16" style={{ background: 'white' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.span variants={fadeUp} className="section-eyebrow block mb-3">
            Our Creations
          </motion.span>
          <motion.h2 variants={fadeUp} className="section-title mb-4">
            Every Occasion Deserves
            <br />
            <em className="not-italic" style={{ color: 'var(--peach)' }}>Something Extraordinary</em>
          </motion.h2>
          <motion.p variants={fadeUp} className="section-subtitle">
            Each cake is a bespoke commission, crafted with premium ingredients
            and elevated artistry, delivered across London.
          </motion.p>
        </motion.div>

        {/* Category Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat.id}
              variants={fadeUp}
              className="group card-luxury cursor-pointer"
            >
              <Link to={cat.href} className="block">
                {/* Card image area */}
                <div
                  className="aspect-[4/3] flex flex-col items-center justify-center relative overflow-hidden"
                  style={{ background: 'white' }}
                >
                  <span
                    className="text-6xl transition-transform duration-500 group-hover:scale-110"
                    role="img"
                    aria-label={cat.label}
                  >
                    {cat.emoji}
                  </span>
                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ background: 'rgba(0,0,0,0.55)' }}
                  >
                    <span className="btn-ghost text-xs py-2 px-5">
                      View Collection
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif font-semibold" style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                      {cat.label}
                    </h3>
                    <Heart
                      size={18}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-0.5 flex-shrink-0"
                      style={{ color: 'var(--blush)' }}
                    />
                  </div>
                  <p className="font-sans text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                    {cat.description}
                  </p>
                  <p className="font-sans text-xs" style={{ color: 'var(--text-muted)' }}>
                    Starting from{' '}
                    <strong className="font-semibold" style={{ color: 'var(--peach)' }}>{cat.startingFrom}</strong>
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* "View all" card */}
          <motion.div variants={fadeUp} className="card-luxury group">
            <Link
              to="/shop"
              className="flex flex-col items-center justify-center text-center h-full min-h-[280px] p-8"
              style={{ background: 'white' }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'var(--peach)' }}
              >
                <ArrowRight size={22} color="white" />
              </div>
              <p className="font-serif font-semibold mb-2" style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                View Full Collection
              </p>
              <p className="font-sans text-sm" style={{ color: 'var(--text-muted)' }}>
                Browse all cakes &amp; place your bespoke enquiry
              </p>
            </Link>
          </motion.div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-sans text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
            All cakes are made to order with premium, locally sourced ingredients.
          </p>
          <Link to="/contact" className="btn-outline">
            Request a Bespoke Quote
            <ArrowRight size={16} />
          </Link>
        </motion.div>

      </div>
    </section>
  )
}