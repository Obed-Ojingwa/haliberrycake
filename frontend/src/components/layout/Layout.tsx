import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  return (
    <>
      <Navbar className="fixed top-0 left-0 right-0 z-50" />
      <main className="pt-[72px] min-h-[calc(100vh-72px)] pb-[3.5rem]">
        <slot />
      </main>
      <Footer />
    </>
  )
}