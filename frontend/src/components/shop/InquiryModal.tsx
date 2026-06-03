// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\shop\InquiryModal.tsx
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, CheckCircle } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { inquiryApi } from '@/lib/api'
import type { Product } from '@/types'

// ── Zod schema ────────────────────────────────────────────────────
const schema = z.object({
  name:         z.string().min(2, 'Please enter your name'),
  email:        z.string().email('Please enter a valid email'),
  phone:        z.string().optional(),
  event_date:   z.string().optional(),
  budget_range: z.string().optional(),
  message:      z.string().min(10, 'Please tell us a little more (at least 10 characters)'),
})
type FormValues = z.infer<typeof schema>

// ── Map product category → ServiceType (backend enum) ─────────────
const CATEGORY_TO_SERVICE: Record<string, string> = {
  wedding:  'wedding_cake',
  birthday: 'birthday_cake',
  cupcakes: 'cupcakes',
  desserts: 'dessert_box',
  treats:   'luxury_treats',
}

interface Props {
  product: Product | null
  onClose: () => void
}

export default function InquiryModal({ product, onClose }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  // Reset form when product changes
  useEffect(() => {
    if (product) reset()
  }, [product, reset])

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      inquiryApi.submit({
        ...values,
        service_type: product ? (CATEGORY_TO_SERVICE[product.category] ?? 'general') : 'general',
        // Prepend product name to message so admin sees context
        message: product
          ? `Re: ${product.name}\n\n${values.message}`
          : values.message,
      }),
  })

  function onSubmit(values: FormValues) {
    mutation.mutate(values)
  }

  const isOpen = !!product

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(44, 24, 16, 0.55)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal panel */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white"
              style={{ boxShadow: '0 32px 80px rgba(44,24,16,0.18)' }}
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 24 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              onClick={e => e.stopPropagation()}
            >
              {/* ── Success state ── */}
              {mutation.isSuccess ? (
                <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 22, delay: 0.1 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
                    style={{ background: 'var(--apricot)' }}
                  >
                    <CheckCircle size={30} style={{ color: 'var(--peach)' }} />
                  </motion.div>
                  <h3 className="font-serif text-2xl mb-3" style={{ color: 'var(--text-primary)' }}>
                    Enquiry Sent!
                  </h3>
                  <p className="font-sans text-sm leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
                    Thank you for reaching out about <strong>{product?.name}</strong>. Halimot will get back to you personally within 24 hours.
                  </p>
                  <button onClick={onClose} className="btn-primary">
                    Close
                  </button>
                </div>
              ) : (
                <>
                  {/* ── Header ── */}
                  <div
                    className="px-7 pt-7 pb-5"
                    style={{ borderBottom: '1px solid var(--cream)' }}
                  >
                    <button
                      onClick={onClose}
                      className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-[var(--cream)]"
                    >
                      <X size={16} style={{ color: 'var(--text-secondary)' }} />
                    </button>
                    <span className="section-eyebrow block mb-2">Make an Enquiry</span>
                    <h2 className="font-serif text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {product?.name}
                    </h2>
                    <p className="font-sans text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      Fill in the form below and Halimot will reply within 24 hours.
                    </p>
                  </div>

                  {/* ── Form ── */}
                  <form onSubmit={handleSubmit(onSubmit)} className="px-7 py-6 space-y-5">
                    {/* Name + Email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-sans text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                          Your Name <span style={{ color: 'var(--peach)' }}>*</span>
                        </label>
                        <input
                          {...register('name')}
                          placeholder="Jane Smith"
                          className="w-full px-4 py-2.5 rounded-xl font-sans text-sm outline-none transition-all"
                          style={{
                            background: '#FDF7F2',
                            border: `1.5px solid ${errors.name ? '#F2B6B8' : 'var(--cream)'}`,
                            color: 'var(--text-primary)',
                          }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'var(--peach)')}
                          onBlur={e => (e.currentTarget.style.borderColor = errors.name ? '#F2B6B8' : 'var(--cream)')}
                        />
                        {errors.name && (
                          <p className="font-sans text-xs mt-1" style={{ color: '#e06a6a' }}>{errors.name.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block font-sans text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                          Email <span style={{ color: 'var(--peach)' }}>*</span>
                        </label>
                        <input
                          {...register('email')}
                          type="email"
                          placeholder="jane@example.com"
                          className="w-full px-4 py-2.5 rounded-xl font-sans text-sm outline-none transition-all"
                          style={{
                            background: '#FDF7F2',
                            border: `1.5px solid ${errors.email ? '#F2B6B8' : 'var(--cream)'}`,
                            color: 'var(--text-primary)',
                          }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'var(--peach)')}
                          onBlur={e => (e.currentTarget.style.borderColor = errors.email ? '#F2B6B8' : 'var(--cream)')}
                        />
                        {errors.email && (
                          <p className="font-sans text-xs mt-1" style={{ color: '#e06a6a' }}>{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block font-sans text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        Phone <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
                      </label>
                      <input
                        {...register('phone')}
                        type="tel"
                        placeholder="+44 7700 000000"
                        className="w-full px-4 py-2.5 rounded-xl font-sans text-sm outline-none transition-all"
                        style={{
                          background: '#FDF7F2',
                          border: '1.5px solid var(--cream)',
                          color: 'var(--text-primary)',
                        }}
                        onFocus={e => (e.currentTarget.style.borderColor = 'var(--peach)')}
                        onBlur={e => (e.currentTarget.style.borderColor = 'var(--cream)')}
                      />
                    </div>

                    {/* Event date + Budget row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-sans text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                          Event Date <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
                        </label>
                        <input
                          {...register('event_date')}
                          type="date"
                          className="w-full px-4 py-2.5 rounded-xl font-sans text-sm outline-none transition-all"
                          style={{
                            background: '#FDF7F2',
                            border: '1.5px solid var(--cream)',
                            color: 'var(--text-primary)',
                          }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'var(--peach)')}
                          onBlur={e => (e.currentTarget.style.borderColor = 'var(--cream)')}
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                          Budget Range <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
                        </label>
                        <select
                          {...register('budget_range')}
                          className="w-full px-4 py-2.5 rounded-xl font-sans text-sm outline-none transition-all"
                          style={{
                            background: '#FDF7F2',
                            border: '1.5px solid var(--cream)',
                            color: 'var(--text-secondary)',
                          }}
                          onFocus={e => (e.currentTarget.style.borderColor = 'var(--peach)')}
                          onBlur={e => (e.currentTarget.style.borderColor = 'var(--cream)')}
                        >
                          <option value="">Select a range</option>
                          <option value="Under £100">Under £100</option>
                          <option value="£100–£250">£100–£250</option>
                          <option value="£250–£500">£250–£500</option>
                          <option value="£500–£1,000">£500–£1,000</option>
                          <option value="£1,000+">£1,000+</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block font-sans text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
                        Message <span style={{ color: 'var(--peach)' }}>*</span>
                      </label>
                      <textarea
                        {...register('message')}
                        rows={4}
                        placeholder="Tell Halimot about your event, any special requirements, flavours you love…"
                        className="w-full px-4 py-2.5 rounded-xl font-sans text-sm outline-none transition-all resize-none"
                        style={{
                          background: '#FDF7F2',
                          border: `1.5px solid ${errors.message ? '#F2B6B8' : 'var(--cream)'}`,
                          color: 'var(--text-primary)',
                        }}
                        onFocus={e => (e.currentTarget.style.borderColor = 'var(--peach)')}
                        onBlur={e => (e.currentTarget.style.borderColor = errors.message ? '#F2B6B8' : 'var(--cream)')}
                      />
                      {errors.message && (
                        <p className="font-sans text-xs mt-1" style={{ color: '#e06a6a' }}>{errors.message.message}</p>
                      )}
                    </div>

                    {/* API error */}
                    {mutation.isError && (
                      <p className="font-sans text-xs text-center px-3 py-2 rounded-xl"
                        style={{ background: '#FEE2E2', color: '#e06a6a' }}>
                        Something went wrong. Please try again or contact us via WhatsApp.
                      </p>
                    )}

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={mutation.isPending}
                      className="btn-primary w-full justify-center"
                    >
                      {mutation.isPending ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          Send Enquiry
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}