// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\layout\Navbar.tsx
import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingBag } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home',       href: '/' },
  { label: 'About',      href: '/about' },
  { label: 'Shop',       href: '/shop' },
  { label: 'Classes',    href: '/cake-classes' },
  { label: 'Haliberry CIC', href: '/cic' },
  { label: 'Gallery',    href: '/gallery' },
  { label: 'Contact',    href: '/contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled]  = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location])

  const navBg = scrolled || !isHome
    ? 'bg-white/95 backdrop-blur-md shadow-luxury-sm'
    : 'bg-transparent'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex flex-col leading-none">
          <span
            className="font-serif font-bold tracking-tight"
            style={{
              fontSize: 'clamp(1.25rem, 3vw, 1.6rem)',
              color: scrolled || !isHome ? 'var(--text-primary)' : 'white',
            }}
          >
            Haliberry
          </span>
          <span
            className="font-sans tracking-[0.18em] uppercase"
            style={{
              fontSize: '0.55rem',
              color: scrolled || !isHome ? 'var(--peach)' : 'rgba(255,255,255,0.8)',
            }}
          >
            Cake · London
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <NavLink
                to={href}
                className={({ isActive }) =>
                  `font-sans text-sm font-medium tracking-wide transition-colors duration-200 ${
                    isActive
                      ? 'text-[var(--peach)]'
                      : scrolled || !isHome
                        ? 'text-[var(--text-secondary)] hover:text-[var(--peach)]'
                        : 'text-white/90 hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/shop"
            className="btn-primary text-xs py-2.5 px-5"
          >
            <ShoppingBag size={15} />
            Order Now
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="lg:hidden p-2 rounded-lg transition-colors"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          style={{ color: scrolled || !isHome ? 'var(--text-primary)' : 'white' }}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Slide-down Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white/98 backdrop-blur-md shadow-luxury-lg border-t border-cream"
          >
            <ul className="px-6 py-6 flex flex-col gap-4">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <NavLink
                    to={href}
                    className={({ isActive }) =>
                      `block font-sans text-base font-medium py-1 border-b border-cream transition-colors ${
                        isActive ? 'text-[var(--peach)]' : 'text-[var(--text-primary)]'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
              <li className="pt-2">
                <Link to="/shop" className="btn-primary w-full justify-center">
                  <ShoppingBag size={16} />
                  Order a Cake
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}