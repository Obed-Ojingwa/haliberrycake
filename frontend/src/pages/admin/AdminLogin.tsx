// C:\Users\Melody\Documents\haliberrycake\frontend\src\pages\admin\AdminLogin.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { authApi } from '@/lib/api'

const schema = z.object({
  email:    z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormValues = z.infer<typeof schema>

export default function AdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/admin'
  const [showPw, setShowPw] = useState(false)
  const { register, handleSubmit, formState:{ errors } } = useForm<FormValues>({ resolver:zodResolver(schema) })

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: ({ email, password }: FormValues) => authApi.login(email, password),
    onSuccess: (res) => {
      localStorage.setItem('haliberry_admin_token', res.data.access_token)
      navigate(from, { replace: true })
    },
  })

  const inputStyle = { background:'white', color:'var(--text-primary)', border:'1.5px solid #E0D0C5' }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      // style={{ background:'linear-gradient(135deg, #2C1810 0%, #52200E 55%, #7A3618 100%)' }}>
      >

      {/* Ambient orb */}
      <div className="absolute top-0 right-0 w-96 h-96 opacity-15 blur-3xl pointer-events-none rounded-full"
        style={{ background:'radial-gradient(circle, rgba(0,0,0,0.02), transparent 70%)', transform:'translate(30%,-30%)' }}/>

      <motion.div
        className="w-full max-w-md rounded-[2rem] overflow-hidden shadow-luxury-lg"
        style={{ background:'white' }}
        initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.55, ease:[0.25,0.46,0.45,0.94] }}
      >
        {/* Header */}
        <div className="px-10 pt-10 pb-7 text-center" style={{ background:'white' }}>
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background:'var(--peach)' }}>
            <Lock size={22} color="white"/>
          </div>
          <h1 className="font-serif font-semibold" style={{ fontSize:'1.6rem', color:'var(--text-primary)' }}>
            Admin Login
          </h1>
          <p className="font-sans text-sm mt-1" style={{ color:'var(--text-secondary)' }}>Haliberry Cake Dashboard</p>
        </div>

        {/* Form */}
        <div className="px-10 py-8">
          {isError && (
            <div className="mb-5 p-4 rounded-xl font-sans text-sm text-red-700 space-y-1" style={{ background:'#F5F5F5' }}>
              <p className="font-semibold">
                {(error as { response?:{data?:{detail?:string}} })?.response?.data?.detail ?? 'Login failed'}
              </p>
              <p className="text-xs opacity-70 break-all">
                {(error as { message?: string })?.message ?? ''} | API: {import.meta.env.VITE_API_URL ?? 'NOT SET'}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(d=>mutate(d))} className="space-y-5" noValidate>
            <div>
              <label className="font-sans text-xs font-medium mb-1.5 block" style={{ color:'var(--text-secondary)' }}>Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color:'var(--text-muted)' }}/>
                <input {...register('email')} type="email" placeholder="admin@haliberrycake.co.uk"
                  className="w-full pl-10 pr-4 py-3 rounded-xl font-sans text-sm outline-none transition-colors focus:border-[var(--peach)]"
                  style={{ ...inputStyle, borderColor: errors.email ? '#E53935' : '#E0D0C5' }}/>
              </div>
              {errors.email && <p className="font-sans text-xs mt-1 text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="font-sans text-xs font-medium mb-1.5 block" style={{ color:'var(--text-secondary)' }}>Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color:'var(--text-muted)' }}/>
                <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl font-sans text-sm outline-none transition-colors focus:border-[var(--peach)]"
                  style={{ ...inputStyle, borderColor: errors.password ? '#E53935' : '#E0D0C5' }}/>
                <button type="button" onClick={()=>setShowPw(v=>!v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color:'var(--text-muted)' }}>
                  {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
              {errors.password && <p className="font-sans text-xs mt-1 text-red-500">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isPending} className="btn-primary w-full justify-center py-3.5 mt-2">
              {isPending ? 'Signing in…' : 'Sign In to Dashboard'}
            </button>
          </form>

          <p className="text-center font-sans text-xs mt-6" style={{ color:'var(--text-muted)' }}>
            <a href="/" className="hover:text-[var(--peach)] transition-colors">← Back to website</a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

// // C:\Users\Melody\Documents\haliberrycake\frontend\src\pages\admin\AdminLogin.tsx
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
// import { useMutation } from '@tanstack/react-query'
// import { useNavigate, useLocation } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
// import { useState } from 'react'
// import { authApi } from '@/lib/api'

// const schema = z.object({
//   email:    z.string().email('Valid email required'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
// })
// type FormValues = z.infer<typeof schema>

// export default function AdminLogin() {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/admin'
//   const [showPw, setShowPw] = useState(false)
//   const { register, handleSubmit, formState:{ errors } } = useForm<FormValues>({ resolver:zodResolver(schema) })

//   const { mutate, isPending, isError, error } = useMutation({
//     mutationFn: ({ email, password }: FormValues) => authApi.login(email, password),
//     onSuccess: (res) => {
//       localStorage.setItem('haliberry_admin_token', res.data.access_token)
//       navigate(from, { replace: true })
//     },
//   })

//   const inputStyle = { background:'white', color:'var(--text-primary)', border:'1.5px solid #E0D0C5' }

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4"
//       style={{ background:'linear-gradient(135deg, #2C1810 0%, #52200E 55%, #7A3618 100%)' }}>

//       {/* Ambient orb */}
//       <div className="absolute top-0 right-0 w-96 h-96 opacity-15 blur-3xl pointer-events-none rounded-full"
//         style={{ background:'radial-gradient(circle, #F8A974, transparent 70%)', transform:'translate(30%,-30%)' }}/>

//       <motion.div
//         className="w-full max-w-md rounded-[2rem] overflow-hidden shadow-luxury-lg"
//         style={{ background:'white' }}
//         initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }}
//         transition={{ duration:0.55, ease:[0.25,0.46,0.45,0.94] }}
//       >
//         {/* Header */}
//         <div className="px-10 pt-10 pb-7 text-center" style={{ background:'white' }}>
//           <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
//             style={{ background:'var(--peach)' }}>
//             <Lock size={22} color="white"/>
//           </div>
//           <h1 className="font-serif font-semibold" style={{ fontSize:'1.6rem', color:'var(--text-primary)' }}>
//             Admin Login
//           </h1>
//           <p className="font-sans text-sm mt-1" style={{ color:'var(--text-secondary)' }}>Haliberry Cake Dashboard</p>
//         </div>

//         {/* Form */}
//         <div className="px-10 py-8">
//           {isError && (
//             <div className="mb-5 p-4 rounded-xl font-sans text-sm text-red-700" style={{ background:'#FEE2E2' }}>
//               {(error as { response?:{data?:{detail?:string}} })?.response?.data?.detail ?? 'Invalid email or password. Please try again.'}
//             </div>
//           )}

//           <form onSubmit={handleSubmit(d=>mutate(d))} className="space-y-5" noValidate>
//             <div>
//               <label className="font-sans text-xs font-medium mb-1.5 block" style={{ color:'var(--text-secondary)' }}>Email Address</label>
//               <div className="relative">
//                 <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color:'var(--text-muted)' }}/>
//                 <input {...register('email')} type="email" placeholder="admin@haliberrycake.co.uk"
//                   className="w-full pl-10 pr-4 py-3 rounded-xl font-sans text-sm outline-none transition-colors focus:border-[var(--peach)]"
//                   style={{ ...inputStyle, borderColor: errors.email ? '#E53935' : '#E0D0C5' }}/>
//               </div>
//               {errors.email && <p className="font-sans text-xs mt-1 text-red-500">{errors.email.message}</p>}
//             </div>

//             <div>
//               <label className="font-sans text-xs font-medium mb-1.5 block" style={{ color:'var(--text-secondary)' }}>Password</label>
//               <div className="relative">
//                 <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color:'var(--text-muted)' }}/>
//                 <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="••••••••"
//                   className="w-full pl-10 pr-10 py-3 rounded-xl font-sans text-sm outline-none transition-colors focus:border-[var(--peach)]"
//                   style={{ ...inputStyle, borderColor: errors.password ? '#E53935' : '#E0D0C5' }}/>
//                 <button type="button" onClick={()=>setShowPw(v=>!v)}
//                   className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color:'var(--text-muted)' }}>
//                   {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
//                 </button>
//               </div>
//               {errors.password && <p className="font-sans text-xs mt-1 text-red-500">{errors.password.message}</p>}
//             </div>

//             <button type="submit" disabled={isPending} className="btn-primary w-full justify-center py-3.5 mt-2">
//               {isPending ? 'Signing in…' : 'Sign In to Dashboard'}
//             </button>
//           </form>

//           <p className="text-center font-sans text-xs mt-6" style={{ color:'var(--text-muted)' }}>
//             <a href="/" className="hover:text-[var(--peach)] transition-colors">← Back to website</a>
//           </p>
//         </div>
//       </motion.div>
//     </div>
//   )
// }