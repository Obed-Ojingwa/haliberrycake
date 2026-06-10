// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\about\AboutHero.tsx
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { heroTextReveal } from '@/lib/animations'

interface SiteSetting { key: string; image_url: string | null }

export default function AboutHero() {
  const { data: settings } = useQuery<SiteSetting[]>({
    queryKey: ['site-settings'],
    queryFn: async () => (await api.get('/api/v1/site-settings')).data,
    staleTime: 1000 * 60 * 10,
  })

  const portraitUrl = settings?.find(s => s.key === 'founder_portrait')?.image_url ?? null

  return (
    <section
  className="relative min-h-[70vh] flex items-end overflow-hidden bg-white bg-[url('/img/dot-pattern.png')] bg-[size:20px_20px]"
>

      {/* Real portrait image fills the section when available */}
      {portraitUrl && (
        <div className="absolute inset-0">
          <img
            src={portraitUrl}
            alt="Halimot — Founder of Haliberry Cake"
            className="w-full h-full object-cover object-top"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          {/* Dark gradient overlay so text stays readable */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }}
          />
        </div>
      )}

      {/* Ambient orbs — shown whether or not image is present */}
      <div
        className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.02), transparent 70%)', transform: 'translate(30%,-30%)' }}
      />
      <div
        className="absolute bottom-0 left-1/3 w-[360px] h-[360px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,0,0,0.02), transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
        <motion.span
          custom={0} variants={heroTextReveal} initial="hidden" animate="visible"
          className="inline-flex items-center gap-2 mb-5"
        >
          <span className="w-8 h-px" style={{ background: 'var(--peach)' }} />
          <span className="font-sans text-xs font-medium tracking-[0.22em] uppercase" style={{ color: 'var(--peach)' }}>
            The Founder
          </span>
        </motion.span>
        <motion.h1
          custom={1} variants={heroTextReveal} initial="hidden" animate="visible"
          className="font-serif font-semibold text-black mb-6"
          style={{ fontSize: 'clamp(2.75rem, 7vw, 5.5rem)', lineHeight: '1.05' }}
        >
          Meet{' '}
          <em className="not-italic" style={{ color: 'var(--peach)' }}>Halimot</em>
        </motion.h1>
        <motion.p
          custom={2} variants={heroTextReveal} initial="hidden" animate="visible"
          className="font-sans font-light max-w-xl"
          style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: 'rgba(0,0,0,0.65)', lineHeight: '1.75' }}
        >
          Baker. Entrepreneur. Community champion. A woman who turned the hardest
          chapters of her life into the most beautiful creations, and built a luxury
          brand rooted in healing, love, and artistry.
        </motion.p>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display:'block', width:'100%' }}>
          <path d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}

// // C:\Users\Melody\Documents\haliberrycake\frontend\src\components\about\AboutHero.tsx
// import { motion } from 'framer-motion'
// import { heroTextReveal } from '@/lib/animations'

// export default function AboutHero() {
//   return (
//     <section
//       className="relative min-h-[70vh] flex items-end overflow-hidden"
//       style={{ background: 'linear-gradient(145deg, #7B3F56 0%, #DCA6C0 50%, #F4E6EA 100%)' }}
//     >
//       {/* Ambient top-right orb */}
//       <div
//         className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl pointer-events-none"
//         style={{ background: 'radial-gradient(circle, #F8A974, transparent 70%)', transform: 'translate(30%,-30%)' }}
//       />
//       {/* Blush bottom-left glow */}
//       <div
//         className="absolute bottom-0 left-1/3 w-[360px] h-[360px] rounded-full opacity-10 blur-3xl pointer-events-none"
//         style={{ background: 'radial-gradient(circle, #F2B6B8, transparent 70%)' }}
//       />

//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full">
//         <motion.span
//           custom={0} variants={heroTextReveal} initial="hidden" animate="visible"
//           className="inline-flex items-center gap-2 mb-5"
//         >
//           <span className="w-8 h-px" style={{ background: 'var(--peach)' }} />
//           <span className="font-sans text-xs font-medium tracking-[0.22em] uppercase" style={{ color: 'var(--peach)' }}>
//             The Founder
//           </span>
//         </motion.span>

//         <motion.h1
//           custom={1} variants={heroTextReveal} initial="hidden" animate="visible"
//           className="font-serif font-semibold text-white mb-6"
//           style={{ fontSize: 'clamp(2.75rem, 7vw, 5.5rem)', lineHeight: '1.05' }}
//         >
//           Meet{' '}
//           <em className="not-italic" style={{ color: 'var(--peach)' }}>Halimot</em>
//         </motion.h1>

//         <motion.p
//           custom={2} variants={heroTextReveal} initial="hidden" animate="visible"
//           className="font-sans font-light max-w-xl"
//           style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: 'rgba(255,255,255,0.65)', lineHeight: '1.75' }}
//         >
//           Baker. Entrepreneur. Community champion. A woman who turned the hardest
//           chapters of her life into the most beautiful creations, and built a luxury
//           brand rooted in healing, love, and artistry.
//         </motion.p>
//       </div>

//       {/* Wave bottom */}
//       <div className="absolute bottom-0 left-0 right-0">
//         <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display:'block', width:'100%' }}>
//           <path d="M0,40 C480,80 960,0 1440,40 L1440,80 L0,80 Z" fill="white"/>
//         </svg>
//       </div>
//     </section>
//   )
// }