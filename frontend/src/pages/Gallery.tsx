import { motion } from 'framer-motion'
import { Image as LucideImage, Camera, Heart } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fadeUp, staggerContainer } from '@/lib/animations'
import { galleryApi } from '@/lib/api'
import type { GalleryImage } from '@/lib/api'
import CTABanner from '@/components/home/CTABanner'
import WhatsAppFloatButton from '@/components/ui/WhatsAppFloatButton'

export default function Gallery() {
  const { data: images = [], isLoading } = useQuery<GalleryImage[]>({
    queryKey: ['gallery'],
    queryFn: async () => { const { data } = await galleryApi.list(); return data },
    staleTime: 10 * 60 * 1000,
  })

  return (
    <>
    <WhatsAppFloatButton />
      <section className="pt-32 pb-20 relative overflow-hidden bg-white border-b border-black/10">
        <div className="absolute inset-0 opacity-10 pointer-events-none"
        // Changed background gradient colors here, keeping the same general style
          style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.05), transparent 65%)' }}/>
        <div className="relative min-h-[2vh] flex items-center overflow-hidden bg-white shadow-lg">
          <motion.div initial="hidden" animate="visible" className="space-y-4">
            <motion.span className="font-sans text-xs tracking-[0.22em] uppercase block" style={{ color: 'var(--peach)' }}>Our Work</motion.span>
            <motion.h1 className="font-serif font-semibold text-black"
              style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', lineHeight: '1.08' }}>
              Gallery<br/><em className="not-italic" style={{ color: 'var(--peach)' }}>Of Creations</em>
            </motion.h1>
            <motion.p className="font-sans font-light" style={{ color: 'rgba(0,0,0,0.65)', fontSize: '1.05rem' }}>
              A showcase of our custom cakes, baking classes, and community moments.
            </motion.p>
          </motion.div>
        </div>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block', width: '100%', position: 'absolute', bottom: 0 }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="white"/>
        </svg>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center max-w-xl mx-auto mb-14" initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.span className="section-eyebrow block mb-3">Featured</motion.span>
            <motion.h2 className="section-title">Recent <em className="not-italic" style={{ color: 'var(--peach)' }}>Work</em></motion.h2>
          </motion.div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-[4/3] bg-[var(--cream)] animate-pulse rounded-xl" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-5">📸</p>
              <p className="font-serif text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>No gallery items yet</p>
              <p className="font-sans text-sm mb-6" style={{ color: 'var(--text-muted)' }}>New additions coming soon!</p>
            </div>
          ) : (
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8"
              initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }}>
              {images.map((image) => (
                <motion.div key={image.id} className="relative grouped">
                  <div className="aspect-[4/3] w-full rounded-xl overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.title || 'Haliberry Cake Creation'}
                      className="w-full h-full object-cover transition-transform duration-500"
                      onMouseEnter={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        img.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        const img = e.currentTarget as HTMLImageElement;
                        img.style.transform = 'scale(1)';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-center">
                        <Heart size={24} className="mb-2" style={{ color: 'var(--peach)' }}/>
                        <h3 className="font-serif font-semibold text-white mb-1" style={{ fontSize: '1.15rem' }}>
                          {image.title || 'Creation'}
                        </h3>
                        <p className="font-sans text-sm text-white/80">{image.category || ''}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center" initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.span className="section-eyebrow block">Categories</motion.span>
            <motion.h2 className="section-title">Explore <em className="not-italic" style={{ color: 'var(--peach)' }}>Our Specialties</em></motion.h2>
          </motion.div>
          <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            {[
              { icon: <LucideImage className="w-8 h-8"/>, label: 'Wedding Cakes', count: 24 },
              { icon: <LucideImage className="w-8 h-8"/>, label: 'Birthday Cakes', count: 31 },
              { icon: <LucideImage className="w-8 h-8"/>, label: 'Cupcakes & Treats', count: 18 },
              { icon: <LucideImage className="w-8 h-8"/>, label: 'Baking Classes', count: 12 },
              { icon: <LucideImage className="w-8 h-8"/>, label: 'CIC Workshops', count: 15 },
              { icon: <LucideImage className="w-8 h-8"/>, label: 'Corporate Events', count: 8 }
            ].map(({ icon, label, count }) => (
              <motion.div key={label} className="flex items-center gap-3 p-6 rounded-xl border"
                style={{ background: 'var(--cream)', border: '1px solid rgba(0,0,0,0.1)' }}>
                <div className="flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <h3 className="font-serif font-semibold" style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>{label}</h3>
                  <p className="font-sans text-sm text-muted-foreground">{count} items</p>
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