// C:\Users\Melody\Documents\haliberrycake\frontend\src\pages\Shop.tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { productsApi } from '@/lib/api'
import { fadeUp, staggerContainer } from '@/lib/animations'
import CategoryFilter from '@/components/shop/CategoryFilter'
import ProductGrid from '@/components/shop/ProductGrid'
import InquiryModal from '@/components/shop/InquiryModal'
import WhatsAppFloat from '@/components/ui/WhatsAppFloatButton'
import type { Product, ProductCategory } from '@/types'

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Fetch all in-stock products (no auth → public endpoint)
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', activeCategory],
    queryFn: async () => {
      const params: Record<string, unknown> = { page_size: 50 }
      if (activeCategory !== 'all') params.category = activeCategory
      const res = await productsApi.list(params)
      // Backend returns { items, total, page, page_size }
      return (res.data?.items ?? res.data) as Product[]
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
  })

  const products = Array.isArray(data) ? data : []

  return (
    <>
      <Helmet>
        <title>Shop — Haliberry Cake | London Luxury Cakes</title>
        <meta name="description" content="Browse Haliberry Cake's bespoke creations — wedding cakes, birthday cakes, cupcakes, dessert boxes and luxury treats, handcrafted in London." />
      </Helmet>

      {/* ── Page Hero ─────────────────────────────────────────── */}
      <section
        className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 text-center overflow-hidden bg-white border-b border-black/10"
      >
        {/* Decorative orb */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.02) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        <motion.div
          className="relative max-w-3xl mx-auto px-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.span variants={fadeUp} className="section-eyebrow block mb-4">
            Our Collection
          </motion.span>
          <motion.h1 variants={fadeUp} className="section-title mb-5">
            Handcrafted with
            <em className="not-italic" style={{ color: 'var(--peach)' }}> Heart</em>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="font-sans text-base leading-relaxed max-w-xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Every cake is made to order. Browse our creations below and send an enquiry — Halimot will personally reply within 24 hours.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Main Shop Content ─────────────────────────────────── */}
      <section className="py-14 lg:py-20" style={{ background: 'white' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Category filter */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
          </motion.div>

          {/* Product grid */}
          <ProductGrid
            products={products}
            isLoading={isLoading}
            isError={isError}
            activeCategory={activeCategory}
            onInquire={setSelectedProduct}
          />
        </div>
      </section>

      {/* ── Enquiry modal ─────────────────────────────────────── */}
      <InquiryModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <WhatsAppFloat />
    </>
  )
}


// // C:\Users\Melody\Documents\haliberrycake\frontend\src\pages\Shop.tsx
// import WhatsAppFloatButton from "@/components/ui/WhatsAppFloatButton";

// export default function Shop() {
//   return (
//     <>
//       <WhatsAppFloatButton />
//       <div className="container mx-auto px-4 py-8">
//         <h1 className="text-2xl font-bold mb-6">Shop</h1>
//         <p className="text-muted-foreground">Shop page content coming soon.</p>
//       </div>
//     </>
//   )
  
// }