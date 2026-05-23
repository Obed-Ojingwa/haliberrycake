// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\shop\CategoryFilter.tsx
import { motion } from 'framer-motion'
import type { ProductCategory } from '@/types'

const CATEGORIES: { value: ProductCategory | 'all'; label: string; emoji: string }[] = [
  { value: 'all',      label: 'All Cakes',     emoji: '🎂' },
  { value: 'wedding',  label: 'Wedding',        emoji: '💍' },
  { value: 'birthday', label: 'Birthday',       emoji: '🎉' },
  { value: 'cupcakes', label: 'Cupcakes',       emoji: '🧁' },
  { value: 'desserts', label: 'Dessert Boxes',  emoji: '🎁' },   // was 'dessert_boxes'
  { value: 'treats',   label: 'Luxury Treats',  emoji: '✨' },   // was 'luxury_treats'
]

interface Props {
  active: ProductCategory | 'all'
  onChange: (cat: ProductCategory | 'all') => void
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map(({ value, label, emoji }) => {
        const isActive = active === value
        return (
          <motion.button
            key={value}
            onClick={() => onChange(value)}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full font-sans text-xs font-medium transition-all duration-200"
            style={{
              background: isActive ? 'var(--peach)'  : '#FDF7F2',
              color:      isActive ? 'white'          : 'var(--text-secondary)',
              border:     `1.5px solid ${isActive ? 'var(--peach)' : '#E0D0C5'}`,
              boxShadow:  isActive ? '0 4px 14px rgba(248,169,116,0.35)' : 'none',
            }}
          >
            <span aria-hidden>{emoji}</span>
            {label}
          </motion.button>
        )
      })}
    </div>
  )
}

