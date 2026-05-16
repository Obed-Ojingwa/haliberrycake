// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\layout\Footer.tsx
import { Link } from 'react-router-dom'
import { Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react'

const FOOTER_NAV = [
  { group: 'Explore',    links: [
    { label: 'Home',        href: '/' },
    { label: 'About Halimot', href: '/about' },
    { label: 'Shop Cakes',  href: '/shop' },
    { label: 'Gallery',     href: '/gallery' },
    { label: 'Testimonials', href: '/testimonials' },
  ]},
  { group: 'Services',   links: [
    { label: 'Wedding Cakes',   href: '/shop#wedding' },
    { label: 'Birthday Cakes',  href: '/shop#birthday' },
    { label: 'Cake Classes',    href: '/cake-classes' },
    { label: 'Cupcakes',        href: '/shop#cupcakes' },
    { label: 'Dessert Boxes',   href: '/shop#desserts' },
  ]},
  { group: 'Community',  links: [
    { label: 'Haliberry CIC',   href: '/cic' },
    { label: 'Our Story',       href: '/about' },
    { label: 'Contact Us',      href: '/contact' },
    { label: 'Book a Class',    href: '/cake-classes' },
  ]},
]

export default function Footer() {
  return (
    <footer style={{ background: 'var(--text-primary)' }} className="text-white">

      {/* Top band */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <p className="font-serif font-bold" style={{ fontSize: 'clamp(1.5rem,3vw,2rem)' }}>
                Haliberry Cake
              </p>
              <p className="font-sans text-xs tracking-[0.2em] uppercase mt-1" style={{ color: 'var(--peach)' }}>
                London · Est. 2020
              </p>
            </div>
            <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              More than cake — a story of strength, healing, and creativity.
              Luxury celebration cakes, dessert boxes, baking classes, and community empowerment in London.
            </p>

            {/* Contact */}
            <div className="space-y-2.5">
              {[
                { icon: <Phone size={14}/>, text: '+44 (0)7XXX XXX XXX' },
                { icon: <Mail size={14}/>,  text: 'hello@haliberrycake.co.uk' },
                { icon: <MapPin size={14}/>, text: 'London, United Kingdom' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 font-sans text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  <span style={{ color: 'var(--peach)' }}>{icon}</span>
                  {text}
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Instagram, href: 'https://instagram.com/haliberrycake', label: 'Instagram' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
                >
                  <Icon size={16} style={{ color: 'var(--peach)' }} />
                </a>
              ))}
              {/* TikTok icon via SVG */}
              <a
                href="https://tiktok.com/@haliberrycake"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ color: 'var(--peach)' }}>
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.07a8.14 8.14 0 004.78 1.52V7.15a4.85 4.85 0 01-1.01-.46z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Nav columns */}
          {FOOTER_NAV.map(({ group, links }) => (
            <div key={group}>
              <p className="font-sans text-xs font-semibold tracking-[0.18em] uppercase mb-5" style={{ color: 'var(--peach)' }}>
                {group}
              </p>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="font-sans text-sm transition-colors duration-200 hover:text-white"
                      style={{ color: 'rgba(255,255,255,0.55)' }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            © {new Date().getFullYear()} Haliberry Cake Ltd. All rights reserved. Registered in England & Wales.
          </p>
          <p className="font-sans text-xs flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Made with <Heart size={11} fill="var(--peach)" style={{ color: 'var(--peach)' }} /> in London
          </p>
        </div>
      </div>

    </footer>
  )
}