import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-72px)] pb-[3.5rem]">
        <slot />
      </main>
      <Footer />
    </>
  )
}