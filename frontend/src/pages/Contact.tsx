// C:\Users\Melody\Documents\haliberrycake\frontend\src\pages\Contact.tsx
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Send, CheckCircle, Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import { inquiryApi } from '@/lib/api'
import { fadeUp, fadeLeft, fadeRight, staggerContainer } from '@/lib/animations'
import WhatsAppFloatButton from '@/components/ui/WhatsAppFloatButton'

const schema = z.object({
  name:         z.string().min(2, 'Please enter your name'),
  email:        z.string().email('Please enter a valid email address'),
  phone:        z.string().optional(),
  service_type: z.string().min(1, 'Please select a service'),
  message:      z.string().min(15, 'Please give us a little more detail (min 15 characters)'),
  event_date:   z.string().optional(),
  budget_range: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

const SERVICE_OPTIONS = [
  { value:'wedding_cake',   label:'Wedding Cake' },
  { value:'birthday_cake',  label:'Birthday Cake' },
  { value:'cupcakes',       label:'Cupcakes' },
  { value:'dessert_box',    label:'Dessert Box' },
  { value:'luxury_treats',  label:'Luxury Treats' },
  { value:'cake_class',     label:'Baking Class' },
  { value:'cic_programme',  label:'Haliberry CIC Programme' },
  { value:'general',        label:'General Enquiry' },
]
const BUDGET_OPTIONS = ['Under £100','£100–£250','£250–£500','£500–£1,000','£1,000+','Let\'s discuss']

export default function Contact() {
  const { register, handleSubmit, reset, formState:{ errors } } = useForm<FormValues>({ resolver:zodResolver(schema) })
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: FormValues) => inquiryApi.submit(data),
    onSuccess: () => reset(),
  })

  const inputBase = "w-full px-4 py-3 rounded-xl font-sans text-sm outline-none transition-colors"
  const inputStyle = { background:'white', color:'var(--text-primary)' }
  const fieldCls = (err?: {message?:string}) =>
    `${inputBase} border focus:border-[var(--peach)] ${err ? 'border-red-400' : 'border-[#E0D0C5]'}`

  return (
    <>
    <WhatsAppFloatButton />
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden bg-white">
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-4">
            <motion.span variants={fadeUp} className="font-sans text-xs tracking-[0.22em] uppercase block" style={{ color:'var(--peach)' }}>Get in Touch</motion.span>
            <motion.h1 variants={fadeUp} className="font-serif font-semibold text-black"
              style={{ fontSize:'clamp(2.5rem,6vw,4.5rem)', lineHeight:'1.08' }}>
              Let's Create Something <em className="not-italic" style={{ color:'var(--peach)' }}>Together</em>
            </motion.h1>
            <motion.p variants={fadeUp} className="font-sans font-light" style={{ color:'rgba(0,0,0,0.65)', fontSize:'1.05rem' }}>
              Whether it's a wedding cake, a class booking, or a general hello — we'd love to hear from you.
            </motion.p>
          </motion.div>
        </div>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg"
          style={{ display:'block',width:'100%',position:'absolute',bottom:0 }}>
          <path d="M0,30 C480,60 960,0 1440,30 L1440,60 L0,60 Z" fill="white"/>
        </svg>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-14">

            {/* Left — Contact info */}
            <motion.div className="lg:col-span-2 space-y-8"
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once:true }}>
              <motion.div variants={fadeLeft} className="space-y-2">
                <span className="section-eyebrow block">Contact Us</span>
                <h2 className="section-title">We'd Love to<br/><em className="not-italic" style={{ color:'var(--peach)' }}>Hear From You</em></h2>
                <p className="font-sans font-light leading-relaxed" style={{ color:'var(--text-secondary)' }}>
                  Fill in the form and we'll respond within 24 hours. For urgent enquiries, WhatsApp or call us directly.
                </p>
              </motion.div>

              {[
                { icon:<Phone size={18}/>,   label:'Phone / WhatsApp', value:'+44 (0)7XXX XXX XXX', href:'https://wa.me/447XXXXXXXXX' },
                { icon:<Mail size={18}/>,    label:'Email',            value:'Haliberry2016@gmail.com', href:'mailto:Haliberry2016@gmail.com' },
                { icon:<MapPin size={18}/>,  label:'Location',         value:'London, United Kingdom', href:undefined },
                { icon:<MessageCircle size={18}/>, label:'Instagram',  value:'@haliberrycake', href:'https://instagram.com/haliberrycake' },
              ].map(({ icon, label, value, href })=>(
                <motion.div key={label} variants={fadeLeft} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background:'var(--apricot)', color:'var(--peach)' }}>{icon}</div>
                  <div>
                    <p className="font-sans text-xs font-medium tracking-widest uppercase mb-0.5" style={{ color:'var(--text-muted)' }}>{label}</p>
                    {href ? (
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                        className="font-sans text-sm font-medium hover:text-[var(--peach)] transition-colors" style={{ color:'var(--text-primary)' }}>{value}</a>
                    ) : (
                      <p className="font-sans text-sm" style={{ color:'var(--text-primary)' }}>{value}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Google Maps embed */}
              <motion.div variants={fadeLeft} className="rounded-2xl overflow-hidden shadow-luxury-sm" style={{ height:'220px' }}>
                <iframe
                  title="Haliberry Cake London"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d317715.70559289995!2d-0.38197022952563646!3d51.52852978784506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon!5e0!3m2!1sen!2suk!4v1699999999999!5m2!1sen!2suk"
                  width="100%" height="220" style={{ border:0 }} allowFullScreen loading="lazy"/>
              </motion.div>
            </motion.div>

            {/* Right — Form */}
            <motion.div className="lg:col-span-3"
              variants={fadeRight} initial="hidden" whileInView="visible" viewport={{ once:true }}>
              <div className="rounded-[2rem] p-8 lg:p-10 shadow-luxury" style={{ background:'white', border:'1px solid var(--cream)' }}>
                {isSuccess ? (
                  <motion.div className="text-center py-12" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}>
                    <CheckCircle size={56} style={{ color:'var(--peach)' }} className="mx-auto mb-5"/>
                    <h3 className="font-serif text-2xl mb-3" style={{ color:'var(--text-primary)' }}>Message Received!</h3>
                    <p className="font-sans text-sm leading-relaxed" style={{ color:'var(--text-secondary)' }}>
                      Thank you for getting in touch. We'll respond within 24 hours.<br/>
                      In the meantime, follow us on Instagram for daily inspiration 🎂
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(d => mutate(d))} className="space-y-5" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="font-sans text-xs font-medium mb-1.5 block" style={{ color:'var(--text-secondary)' }}>Your Name *</label>
                        <input {...register('name')} placeholder="Jane Smith" className={fieldCls(errors.name)} style={inputStyle}/>
                        {errors.name && <p className="font-sans text-xs mt-1 text-red-500">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="font-sans text-xs font-medium mb-1.5 block" style={{ color:'var(--text-secondary)' }}>Email Address *</label>
                        <input {...register('email')} type="email" placeholder="jane@example.com" className={fieldCls(errors.email)} style={inputStyle}/>
                        {errors.email && <p className="font-sans text-xs mt-1 text-red-500">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="font-sans text-xs font-medium mb-1.5 block" style={{ color:'var(--text-secondary)' }}>Phone (optional)</label>
                        <input {...register('phone')} type="tel" placeholder="+44 7XXX XXX XXX" className={fieldCls()} style={inputStyle}/>
                      </div>
                      <div>
                        <label className="font-sans text-xs font-medium mb-1.5 block" style={{ color:'var(--text-secondary)' }}>Service Type *</label>
                        <select {...register('service_type')} className={fieldCls(errors.service_type)} style={inputStyle}>
                          <option value="">Select a service…</option>
                          {SERVICE_OPTIONS.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        {errors.service_type && <p className="font-sans text-xs mt-1 text-red-500">{errors.service_type.message}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="font-sans text-xs font-medium mb-1.5 block" style={{ color:'var(--text-secondary)' }}>Event Date (if applicable)</label>
                        <input {...register('event_date')} type="date" className={fieldCls()} style={inputStyle}/>
                      </div>
                      <div>
                        <label className="font-sans text-xs font-medium mb-1.5 block" style={{ color:'var(--text-secondary)' }}>Approximate Budget</label>
                        <select {...register('budget_range')} className={fieldCls()} style={inputStyle}>
                          <option value="">Select a range…</option>
                          {BUDGET_OPTIONS.map(o=><option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="font-sans text-xs font-medium mb-1.5 block" style={{ color:'var(--text-secondary)' }}>Your Message *</label>
                      <textarea {...register('message')} rows={5}
                        className={fieldCls(errors.message)}
                        style={{ ...inputStyle, resize:'none' }}
                        placeholder="Tell us about your event, cake design ideas, dietary requirements, number of portions…"/>
                      {errors.message && <p className="font-sans text-xs mt-1 text-red-500">{errors.message.message}</p>}
                    </div>

                    <button type="submit" disabled={isPending} className="btn-primary w-full justify-center text-sm py-4">
                      {isPending ? 'Sending…' : <><Send size={16}/> Send Message</>}
                    </button>

                    <p className="font-sans text-xs text-center" style={{ color:'var(--text-muted)' }}>
                      We respond within 24 hours. Your details are kept private and never shared.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  )
}