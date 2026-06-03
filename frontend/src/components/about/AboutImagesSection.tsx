// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\about\AboutImagesSection.tsx
import { motion } from 'framer-motion'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { fadeUp, staggerContainer } from '@/lib/animations'

export default function AboutImagesSection() {
  const { data: siteSettings = [] } = useSiteSettings()
  // Filter for about image settings (keys like 'about_image_1', 'about_image_2', etc.)
  const aboutImages = siteSettings.filter(setting =>
    setting.key.startsWith('about_image') && setting.image_url
  )

  if (aboutImages.length === 0) {
    return null
  }

  return (
    <section className="py-20 lg:py-24" style={{ background: '#FDF7F2' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.span variants={fadeUp} className="section-eyebrow block mb-3">
            From the Gallery
          </motion.span>
          <motion.h2 variants={fadeUp} className="section-title">
            Glimpses of
            <em className="not-italic" style={{ color: 'var(--peach)' }}> Our Journey</em>
          </motion.h2>
        </motion.div>

        {/* Images grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {aboutImages.map((image) => (
            <motion.div
              key={image.id}
              variants={fadeUp}
              className="group relative rounded-2xl overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.35 }}
            >
              {image.image_url && (
                <img
                  src={image.image_url}
                  alt={image.caption ?? 'Haliberry Cake'}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
              )}
              {/* Fallback gradient if image fails to load */}
              {!image.image_url && (
                <div className="absolute inset-0 w-full h-full"
                  style={{ background: 'linear-gradient(135deg, #F8A974, #FBD6B2)' }}
                />
              )}
              {/* Caption overlay */}
              {image.caption && (
                <div
                  className="absolute bottom-3 left-3 font-sans text-xs font-medium px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'rgba(255,255,255,0.9)', color: 'var(--text-secondary)' }}
                >
                  {image.caption}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}