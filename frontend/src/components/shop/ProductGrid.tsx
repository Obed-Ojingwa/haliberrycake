// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\shop\ProductGrid.tsx
import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { staggerContainer, fadeUp } from '@/lib/animations'
import ProductCard from './ProductCard'
import type { Product } from '@/types'
import type { ProductCategory } from '@/types'

interface Props {
  products: Product[]
  isLoading: boolean
  isError: boolean
  activeCategory: ProductCategory | 'all'
  onInquire: (p: Product) => void
}

function SkeletonCard() {
  return (
    <div className="card-luxury flex flex-col animate-pulse">
      <div className="aspect-[4/3] rounded-t-[1.25rem]" style={{ background: 'var(--cream)' }} />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 rounded-full" style={{ background: 'var(--apricot)' }} />
        <div className="h-5 w-3/4 rounded-full" style={{ background: 'var(--cream)' }} />
        <div className="h-3 w-full rounded-full" style={{ background: 'var(--cream)' }} />
        <div className="h-3 w-2/3 rounded-full" style={{ background: 'var(--cream)' }} />
        <div className="h-px w-full" style={{ background: 'var(--cream)' }} />
        <div className="flex justify-between items-center pt-1">
          <div className="h-6 w-16 rounded-full" style={{ background: 'var(--apricot)' }} />
          <div className="h-8 w-24 rounded-full" style={{ background: 'var(--cream)' }} />
        </div>
      </div>
    </div>
  )
}

export default function ProductGrid({ products, isLoading, isError, activeCategory, onInquire }: Props) {
  // Loading state — 6 skeleton cards
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-center rounded-3xl"
        style={{ background: '#FDF7F2', border: '1.5px dashed var(--apricot)' }}
      >
        <span className="text-4xl mb-4">🍰</span>
        <h3 className="font-serif text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
          Something went wrong
        </h3>
        <p className="font-sans text-sm max-w-xs" style={{ color: 'var(--text-secondary)' }}>
          We couldn't load our cakes right now. Please refresh the page or try again shortly.
        </p>
      </div>
    )
  }

  // Empty state — no products in this category
  if (products.length === 0) {
    const isFiltered = activeCategory !== 'all'
    return (
      <div
        className="flex flex-col items-center justify-center py-20 text-center rounded-3xl"
        style={{ background: '#FDF7F2', border: '1.5px dashed var(--apricot)' }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
          style={{ background: 'var(--apricot)' }}
        >
          <ShoppingBag size={28} style={{ color: 'var(--peach)' }} />
        </div>
        <h3 className="font-serif text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
          {isFiltered ? 'Nothing here yet' : 'Collection coming soon'}
        </h3>
        <p className="font-sans text-sm max-w-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {isFiltered
            ? 'No cakes in this category yet — check back soon or browse all our creations.'
            : 'Halimot is baking up something special. Our full collection will be available here very soon.'}
        </p>
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      key={activeCategory} // re-animate on category switch
    >
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onInquire={onInquire}
        />
      ))}
    </motion.div>
  )
}