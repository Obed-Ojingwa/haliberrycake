// C:\Users\Melody\Documents\haliberrycake\frontend\src\pages\Testimonials.tsx
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Star } from 'lucide-react'
import { testimonialsApi } from '@/lib/api'
import { fadeUp, staggerContainer } from '@/lib/animations'
import type { Testimonial } from '@/types'
import CTABanner from '@/components/home/CTABanner'

const ACCENT_COLOURS = ['var(--peach)','var(--blush)','var(--golden)','var(--apricot)']

const STATIC_REVIEWS: Testimonial[] = [
  { id:1, customer_name:'Amara Johnson',  message:'The most breathtaking wedding cake. Every guest was stunned before they even tasted it — and the taste was pure perfection.', image_url:null, rating:5, created_at:'' },
  { id:2, customer_name:'Priya Sharma',   message:'I ordered a custom 60th birthday cake and Haliberry absolutely delivered. The artistry and flavour were first class.', image_url:null, rating:5, created_at:'' },
  { id:3, customer_name:'Rachel Thompson',message:'We\'ve used Haliberry for three corporate events. Consistently stunning, always on time. Our guests are always wowed.', image_url:null, rating:5, created_at:'' },
  { id:4, customer_name:'Fatima Al-Hassan',message:'The baking class changed my life. Halimot teaches with patience, warmth and expertise. I went from knowing nothing to decorating cakes I\'m proud of.', image_url:null, rating:5, created_at:'' },
  { id:5, customer_name:'Claire Williams', message:'Ordered a dessert box for my daughter\'s baby shower and it was the talk of the party. Absolutely gorgeous and delicious.', image_url:null, rating:5, created_at:'' },
  { id:6, customer_name:'Kezia Osei',      message:'Haliberry made my wedding cupcake tower and it was perfection. So beautiful I almost didn\'t want to eat them. Almost!', image_url:null, rating:5, created_at:'' },
]

export default function Testimonials() {
  const { data: apiReviews } = useQuery<Testimonial[]>({
    queryKey:['testimonials'],
    queryFn: async()=>{ const { data }=await testimonialsApi.list(); return data },
    staleTime: 10*60*1000,
  })
  const reviews = (apiReviews && apiReviews.length > 0) ? apiReviews : STATIC_REVIEWS

  return (
    <>
      <section className="pt-32 pb-16 relative overflow-hidden"
        style={{ background:'linear-gradient(145deg,#2C1810 0%,#52200E 55%,#7A3618 100%)' }}>
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
            <motion.span variants={fadeUp} className="font-sans text-xs tracking-[0.22em] uppercase block" style={{ color:'var(--peach)' }}>Kind Words</motion.span>
            <motion.h1 variants={fadeUp} className="font-serif font-semibold text-white"
              style={{ fontSize:'clamp(2.5rem,6vw,4.5rem)', lineHeight:'1.08' }}>
              What Our Clients <em className="not-italic" style={{ color:'var(--peach)' }}>Say</em>
            </motion.h1>
            <motion.p variants={fadeUp} className="font-sans font-light" style={{ color:'rgba(255,255,255,0.65)', fontSize:'1.05rem' }}>
              Every review is a story. These are the moments that matter most to us.
            </motion.p>
          </motion.div>
        </div>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ display:'block',width:'100%',position:'absolute',bottom:0 }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="white"/>
        </svg>
      </section>

      {/* Overall rating strip */}
      <section className="py-10 bg-white">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-8">
          {[{v:'4.9 / 5',l:'Average Rating'},{v:`${reviews.length}+`,l:'Happy Clients'},{v:'100%',l:'Would Recommend'}].map(({v,l})=>(
            <div key={l} className="text-center">
              <p className="font-serif font-bold mb-0.5" style={{ fontSize:'2rem', color:'var(--peach)' }}>{v}</p>
              <p className="font-sans text-sm" style={{ color:'var(--text-muted)' }}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="py-16" style={{ background:'linear-gradient(180deg,white 0%,#FDF7F2 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true, amount:0.05 }}>
            {reviews.map((r, idx)=>(
              <motion.div key={r.id} variants={fadeUp}
                className="relative rounded-2xl p-7 shadow-luxury-sm flex flex-col"
                style={{ background:'white', border:'1px solid var(--cream)' }}>
                {/* Quote decoration */}
                <div className="absolute top-4 right-6 font-serif opacity-[0.08] select-none"
                  style={{ fontSize:'6rem', color:'var(--peach)', lineHeight:1 }}>"</div>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({length:r.rating}).map((_,i)=>(
                    <Star key={i} size={15} fill="var(--peach)" style={{ color:'var(--peach)' }}/>
                  ))}
                </div>
                <p className="font-serif italic flex-1 mb-6" style={{ fontSize:'1.05rem', color:'var(--text-primary)', lineHeight:'1.65' }}>
                  "{r.message}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-sans font-semibold text-xs flex-shrink-0 text-white"
                    style={{ background: ACCENT_COLOURS[idx % ACCENT_COLOURS.length] }}>
                    {r.customer_name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                  </div>
                  <div>
                    <p className="font-sans font-semibold text-sm" style={{ color:'var(--text-primary)' }}>{r.customer_name}</p>
                    {r.created_at && <p className="font-sans text-xs" style={{ color:'var(--text-muted)' }}>{new Date(r.created_at).toLocaleDateString('en-GB',{month:'long',year:'numeric'})}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <CTABanner/>
    </>
  )
}