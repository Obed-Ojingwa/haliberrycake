// C:\Users\Melody\Documents\haliberrycake\frontend\src\App.tsx
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import PageLoader from '@/components/ui/PageLoader'
import ProtectedRoute from '@/components/admin/ProtectedRoute'

// Lazy-loaded pages for performance
const Home        = lazy(() => import('@/pages/Home'))
const About       = lazy(() => import('@/pages/About'))
const Shop        = lazy(() => import('@/pages/Shop'))
const CakeClasses = lazy(() => import('@/pages/CakeClasses'))
const CIC         = lazy(() => import('@/pages/CIC'))
const Gallery     = lazy(() => import('@/pages/Gallery'))
const Testimonials= lazy(() => import('@/pages/Testimonials'))
const Contact     = lazy(() => import('@/pages/Contact'))
const AdminLogin  = lazy(() => import('@/pages/admin/AdminLogin'))
const AdminDash   = lazy(() => import('@/pages/admin/AdminDashboard'))

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public site routes ── */}
        <Route element={<Layout />}>
          <Route path="/"             element={<Home />} />
          <Route path="/about"        element={<About />} />
          <Route path="/shop"         element={<Shop />} />
          <Route path="/cake-classes" element={<CakeClasses />} />
          <Route path="/cic"          element={<CIC />} />
          <Route path="/gallery"      element={<Gallery />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/contact"      element={<Contact />} />
        </Route>
        

        {/* ── Admin login (no Layout, no auth guard) ── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ── Admin dashboard (protected, no Layout) ── */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminDash />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  )
}