import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-rem_calc(3.5rem+rem_calc(3.5rem)))] pb-[rem_calc(3.5rem)]">
        <slot />
      </main>
      <Footer />
    </>
  )
}