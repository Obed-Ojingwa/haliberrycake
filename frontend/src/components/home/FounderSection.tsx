// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\home\FounderSection.tsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { fadeLeft, fadeRight, staggerContainer } from '@/lib/animations'

interface SiteSetting { key: string; image_url: string | null }

function useSiteImage(key: string): string | null {
  const { data } = useQuery<SiteSetting[]>({
    queryKey: ['site-settings'],
    queryFn: async () => (await api.get('/api/v1/site-settings')).data,
    staleTime: 1000 * 60 * 10,
  })
  return data?.find(s => s.key === key)?.image_url ?? null
}

export default function FounderSection() {
  const portraitUrl = useSiteImage('founder_portrait')

  return (
    <section className="py-8 lg:py-16 overflow-hidden" style={{ background: 'white' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Image column */}
          <motion.div
            className="relative"
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Main image card */}
            <div
              className="relative aspect-[4/5] rounded-[2rem] overflow-hidden"
              style={{ background: 'var(--cream)' }}
            >
              {portraitUrl ? (
                <img
                  src={portraitUrl}
                  alt="Halimot — Founder of Haliberry Cake"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
              ) : (
                // Placeholder shown until admin uploads the portrait
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <span className="font-serif text-6xl mb-3" style={{ color: 'var(--peach)' }}>🎂</span>
                  <p className="font-serif italic" style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    Halimot's portrait photo
                  </p>
                  <p className="font-sans text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                    Upload via Admin → Site Images
                  </p>
                </div>
              )}
            </div>

            {/* Floating accent card */}
            <motion.div
              className="absolute -bottom-6 -right-4 lg:-right-8 bg-white rounded-2xl px-6 py-5 shadow-luxury max-w-[200px]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <p className="font-serif font-semibold mb-0.5" style={{ fontSize: '2rem', color: 'var(--peach)' }}>6+</p>
              <p className="font-sans text-xs" style={{ color: 'var(--text-secondary)' }}>Years of baking artistry in London</p>
            </motion.div>

            {/* Decorative dot pattern */}
            <div
              className="absolute -top-6 -left-6 w-28 h-28 opacity-40"
              style={{
                backgroundImage: 'radial-gradient(circle, var(--peach) 1.5px, transparent 1.5px)',
                backgroundSize: '12px 12px',
              }}
            />
          </motion.div>

          {/* Text column */}
          <motion.div
            className="space-y-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.span variants={fadeRight} className="section-eyebrow block">
              The Founder's Journey
            </motion.span>

            <motion.h2 variants={fadeRight} className="section-title">
              From Healing to{' '}
              <em className="not-italic" style={{ color: 'var(--peach)' }}>Flourishing</em>
            </motion.h2>

            <motion.p variants={fadeRight} className="section-subtitle">
              Halimot's journey began not in a kitchen, but in a moment of quiet resolve.
              Baking became her language — a way to process, to heal, to create beauty
              from the most difficult chapters of life.
            </motion.p>

            <motion.p variants={fadeRight} className="font-sans font-light leading-relaxed" style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
              Today, Haliberry Cake is more than a luxury bakery. It is a living testament to
              what happens when talent meets purpose. Every tier stacked, every flower placed,
              every box tied with ribbon carries the intention of a woman who turned her pain
              into something profoundly beautiful.
            </motion.p>

            {/* Pull quote */}
            <motion.blockquote
              variants={fadeRight}
              className="relative pl-5 py-2"
              style={{ borderLeft: '3px solid var(--peach)' }}
            >
              <p className="font-serif italic" style={{ fontSize: '1.2rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                "I didn't just bake cakes — I baked my way back to myself."
              </p>
              <cite className="font-sans text-xs tracking-wide mt-2 block not-italic" style={{ color: 'var(--text-muted)' }}>
                — Halimot, Founder of Haliberry Cake
              </cite>
            </motion.blockquote>

            <motion.div variants={fadeRight}>
              <Link to="/about" className="btn-primary inline-flex">
                Read Halimot's Story
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

// // C:\Users\Melody\Documents\haliberrycake\frontend\src\components\home\FounderSection.tsx
// import { Link } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { ArrowRight } from 'lucide-react'
// import { fadeLeft, fadeRight, staggerContainer } from '@/lib/animations'

// export default function FounderSection() {
//   return (
//     <section className="py-24 lg:py-36 overflow-hidden" style={{ background: 'white' }}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

//           {/* Image column — editorial asymmetric layout */}
//           <motion.div
//             className="relative"
//             variants={fadeLeft}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, amount: 0.2 }}
//           >
//             {/* Main image card */}
//             <div
//               className="relative aspect-[4/5] rounded-[2rem] overflow-hidden"
//               style={{ background: 'linear-gradient(135deg, var(--cream) 0%, var(--apricot) 100%)' }}
//             >
//               {/* Placeholder — replace with <img> once image assets are available */}
//               <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
//                 <span className="font-serif text-6xl mb-3" style={{ color: 'var(--peach)' }}>🎂</span>
//                 <p className="font-serif italic" style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
//                   Halimot's portrait photo here
//                 </p>
//               </div>
//             </div>

//             {/* Floating accent card */}
//             <motion.div
//               className="absolute -bottom-6 -right-4 lg:-right-8 bg-white rounded-2xl px-6 py-5 shadow-luxury max-w-[200px]"
//               animate={{ y: [0, -8, 0] }}
//               transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
//             >
//               <p className="font-serif font-semibold mb-0.5" style={{ fontSize: '2rem', color: 'var(--peach)' }}>6+</p>
//               <p className="font-sans text-xs" style={{ color: 'var(--text-secondary)' }}>Years of baking artistry in London</p>
//             </motion.div>

//             {/* Decorative dot pattern */}
//             <div
//               className="absolute -top-6 -left-6 w-28 h-28 opacity-40"
//               style={{
//                 backgroundImage: 'radial-gradient(circle, var(--peach) 1.5px, transparent 1.5px)',
//                 backgroundSize: '12px 12px',
//               }}
//             />
//           </motion.div>

//           {/* Text column */}
//           <motion.div
//             className="space-y-6"
//             variants={staggerContainer}
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, amount: 0.2 }}
//           >
//             <motion.span variants={fadeRight} className="section-eyebrow block">
//               The Founder's Journey
//             </motion.span>

//             <motion.h2 variants={fadeRight} className="section-title">
//               From Healing to{' '}
//               <em className="not-italic" style={{ color: 'var(--peach)' }}>Flourishing</em>
//             </motion.h2>

//             <motion.p variants={fadeRight} className="section-subtitle">
//               Halimot's journey began not in a kitchen, but in a moment of quiet resolve.
//               Baking became her language — a way to process, to heal, to create beauty
//               from the most difficult chapters of life.
//             </motion.p>

//             <motion.p variants={fadeRight} className="font-sans font-light leading-relaxed" style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
//               Today, Haliberry Cake is more than a luxury bakery. It is a living testament to
//               what happens when talent meets purpose. Every tier stacked, every flower placed,
//               every box tied with ribbon carries the intention of a woman who turned her pain
//               into something profoundly beautiful.
//             </motion.p>

//             {/* Pull quote */}
//             <motion.blockquote
//               variants={fadeRight}
//               className="relative pl-5 py-2"
//               style={{ borderLeft: '3px solid var(--peach)' }}
//             >
//               <p className="font-serif italic" style={{ fontSize: '1.2rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
//                 "I didn't just bake cakes — I baked my way back to myself."
//               </p>
//               <cite className="font-sans text-xs tracking-wide mt-2 block not-italic" style={{ color: 'var(--text-muted)' }}>
//                 — Halimot, Founder of Haliberry Cake
//               </cite>
//             </motion.blockquote>

//             <motion.div variants={fadeRight}>
//               <Link to="/about" className="btn-primary inline-flex">
//                 Read Halimot's Story
//                 <ArrowRight size={16} />
//               </Link>
//             </motion.div>
//           </motion.div>

//         </div>
//       </div>
//     </section>
//   )
// }