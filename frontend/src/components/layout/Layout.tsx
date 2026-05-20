import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="pt-[72px] min-h-[calc(100vh-72px)] pb-[3.5rem]">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}