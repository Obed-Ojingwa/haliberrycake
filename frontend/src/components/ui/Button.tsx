// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\ui\Button.tsx
import { forwardRef, ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

type Variant = 'primary' | 'outline' | 'ghost' | 'dark'
type Size    = 'sm' | 'md' | 'lg'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

const variantStyles: Record<Variant, string> = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  ghost:   'btn-ghost',
  dark:    'inline-flex items-center gap-2 rounded-full font-sans font-medium tracking-wide bg-[var(--text-primary)] text-white hover:bg-[var(--text-secondary)] transition-all',
}

const sizeStyles: Record<Size, string> = {
  sm: 'text-xs px-5 py-2',
  md: 'text-sm px-7 py-3.5',
  lg: 'text-base px-9 py-4',
}

const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = 'primary', size = 'md', loading = false, fullWidth = false, children, className = '', disabled, ...rest }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={`${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full justify-center' : ''} ${className}`}
        disabled={disabled || loading}
        {...(rest as object)}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            Loading…
          </span>
        ) : children}
      </motion.button>
    )
  }
)
Button.displayName = 'Button'
export default Button