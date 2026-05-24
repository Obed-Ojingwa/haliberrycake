import HeroSection from '@/components/home/HeroSection'
import FounderSection from '@/components/home/FounderSection'
import ProductShowcase from '@/components/home/ProductShowcase'
import CICImpactSection from '@/components/home/CICImpactSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import GalleryPreview from '@/components/home/GalleryPreview'
import CTABanner from '@/components/home/CTABanner'
import WhatsAppFloatButton from '@/components/ui/WhatsAppFloatButton'

export default function Home() {
  return (
    <>
      <HeroSection />
      <FounderSection />
      <ProductShowcase />
      <CICImpactSection />
      <TestimonialsSection />
      <GalleryPreview />
      <CTABanner />
      <WhatsAppFloatButton />
    </>
  )
}