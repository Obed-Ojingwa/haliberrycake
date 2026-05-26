// C:\Users\Melody\Documents\haliberrycake\frontend\src\pages\About.tsx
import { Helmet } from 'react-helmet-async'
import AboutHero            from '@/components/about/AboutHero'
import HaliberryCICSection   from '@/components/about/HaliberryCICSection'
import BiographySection      from '@/components/about/BiographySection'
import TimelineSection       from '@/components/about/TimelineSection'
import ValuesSection         from '@/components/about/ValuesSection'
import AboutCTA              from '@/components/about/AboutCTA'
import WhatsAppFloatButton   from '@/components/ui/WhatsAppFloatButton'

export default function About() {
  return (
    <>
      <WhatsAppFloatButton />
      <Helmet>
        <title>About Halimot — Founder of Haliberry Cake London</title>
        <meta name="description" content="Meet Halimot, the visionary founder of Haliberry Cake. A story of strength, healing and creativity baked into every luxury cake in London." />
        <meta property="og:title" content="About Halimot — Haliberry Cake Founder" />
        <meta property="og:description" content="A story of strength, healing and creativity from London's luxury cake artist." />
        <link rel="canonical" href="https://haliberrycake.co.uk/about" /> {/* Check on this --- I will change this later*/}  
      </Helmet>
      <AboutHero />
      <HaliberryCICSection />
      <BiographySection />
      <TimelineSection />
      <ValuesSection />
      <AboutCTA />
    </>
  )
}

// // C:\Users\Melody\Documents\haliberrycake\frontend\src\pages\About.tsx
// import AboutHero        from '@/components/about/AboutHero'
// import BiographySection from '@/components/about/BiographySection'
// import TimelineSection  from '@/components/about/TimelineSection'
// import ValuesSection    from '@/components/about/ValuesSection'
// import AboutCTA         from '@/components/about/AboutCTA'

// export default function About() {
//   return (
//     <>
//       <AboutHero />
//       <BiographySection />
//       <TimelineSection />
//       <ValuesSection />
//       <AboutCTA />
//     </>
//   )
// }