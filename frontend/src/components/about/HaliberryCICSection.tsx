import { motion } from 'framer-motion'
import { fadeUp, staggerContainer } from '@/lib/animations'

export default function HaliberryCICSection() {
  return (
    <section className="py-24 lg:py-32" style={{ background: 'var(--cream)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-4xl mx-auto text-center mb-16"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.span variants={fadeUp} className="section-eyebrow block">
            About Haliberry CIC
          </motion.span>
          <motion.h2 variants={fadeUp} className="section-title">
            Empowerment through baking, creativity and community.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="section-subtitle mx-auto mt-6 max-w-2xl"
            style={{ color: 'var(--text-secondary)' }}
          >
            Haliberry CIC supports women who are rebuilding their lives after trauma,
            hardship or isolation, using creative training and safe spaces to restore
            confidence, skills and hope.
          </motion.p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr] items-start">
          <motion.div
            className="space-y-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div variants={fadeUp} className="space-y-4">
              <p className="font-sans font-light leading-[1.85]" style={{ color: 'var(--text-primary)' }}>
                Haliberry CIC is a London-based social enterprise dedicated to empowering
                women through creativity, confidence-building and practical skills training.
              </p>
              <p className="font-sans font-light leading-[1.85]" style={{ color: 'var(--text-secondary)' }}>
                Founded by Halimot, Haliberry CIC was created to support women rebuilding their
                lives after trauma, hardship, displacement, isolation or loss of confidence.
                Through baking, cake decorating and coffee training, we create safe and
                supportive spaces where women can learn, grow and rediscover their potential.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-4">
              <h3 className="font-serif text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                Company Statement
              </h3>
              <p className="font-sans font-light leading-[1.85]" style={{ color: 'var(--text-secondary)' }}>
                At Haliberry CIC, our mission is to make a meaningful difference in the lives of
                vulnerable individuals across our community.
              </p>
              <p className="font-sans font-light leading-[1.85]" style={{ color: 'var(--text-secondary)' }}>
                We are committed to creating opportunities for empowerment, confidence-building and
                progression for:
              </p>
              <ul className="list-disc list-inside space-y-2 font-sans font-light leading-[1.85]" style={{ color: 'var(--text-secondary)' }}>
                <li>asylum seekers and refugees</li>
                <li>survivors of trafficking and modern slavery</li>
                <li>survivors of FGM/C and domestic abuse</li>
                <li>women facing homelessness or financial hardship</li>
                <li>young adults and vulnerable women needing support and opportunity</li>
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} className="space-y-4">
              <h3 className="font-serif text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                What We Do
              </h3>
              <p className="font-sans font-light leading-[1.85]" style={{ color: 'var(--text-secondary)' }}>
                We provide practical training programmes in:
              </p>
              <ul className="list-disc list-inside space-y-2 font-sans font-light leading-[1.85]" style={{ color: 'var(--text-secondary)' }}>
                <li>baking</li>
                <li>cake decorating</li>
                <li>coffee training</li>
                <li>confidence-building activities</li>
                <li>community empowerment initiatives</li>
              </ul>
              <p className="font-sans font-light leading-[1.85]" style={{ color: 'var(--text-secondary)' }}>
                Our programmes are designed to help women develop valuable life, creative and employability
                skills in a safe and encouraging environment.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="space-y-8 rounded-[2rem] border border-[#F6E2B5] bg-white p-10 shadow-luxury"
            variants={fadeUp}
          >
            <div className="space-y-6">
              <div className="rounded-[1.75rem] overflow-hidden bg-[var(--cream-white)]">
                <div className="aspect-[4/5] bg-[var(--cream)]" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                  How We Do It
                </h3>
                <p className="font-sans font-light mt-4 leading-[1.85]" style={{ color: 'var(--text-secondary)' }}>
                  We believe in a compassionate and holistic approach to empowerment.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="font-sans font-light leading-[1.85]" style={{ color: 'var(--text-secondary)' }}>
                Through creativity, practical learning and supportive community spaces, we help women rebuild
                confidence, develop new skills and take positive steps towards stability and opportunity.
              </p>
              <p className="font-sans font-light leading-[1.85]" style={{ color: 'var(--text-secondary)' }}>
                Our approach is rooted in:
              </p>
              <ul className="list-disc list-inside space-y-2 font-sans font-light leading-[1.85]" style={{ color: 'var(--text-secondary)' }}>
                <li>dignity</li>
                <li>compassion</li>
                <li>inclusivity</li>
                <li>creativity</li>
                <li>community connection</li>
              </ul>
            </div>

            <div className="rounded-[1.75rem] bg-[var(--peach)] p-6 text-white">
              <h3 className="font-serif text-xl font-semibold">Our Mission</h3>
              <p className="font-sans font-light mt-4 leading-[1.85]">
                More than training, we create pathways towards confidence, independence, creativity, progression
                and hope for the future.
              </p>
              <p className="font-sans font-light mt-4 leading-[1.85]">
                At Haliberry CIC, we believe every woman deserves the opportunity to grow, heal and thrive.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
