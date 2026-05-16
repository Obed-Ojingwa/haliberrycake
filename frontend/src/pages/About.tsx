// C:\Users\Melody\Documents\haliberrycake\frontend\src\pages\About.tsx
import AboutHero        from '@/components/about/AboutHero'
import BiographySection from '@/components/about/BiographySection'
import TimelineSection  from '@/components/about/TimelineSection'
import ValuesSection    from '@/components/about/ValuesSection'
import AboutCTA         from '@/components/about/AboutCTA'

export default function About() {
  return (
    <>
      <AboutHero />
      <BiographySection />
      <TimelineSection />
      <ValuesSection />
      <AboutCTA />
    </>
  )
}