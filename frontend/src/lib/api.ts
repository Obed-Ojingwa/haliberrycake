// C:\Users\Melody\Documents\haliberrycake\frontend\src\lib\api.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

// ── Attach JWT on every request ──────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('haliberry_admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Surface 401 → redirect to admin login ────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Don't redirect if we're already on the login page
      // (prevents infinite redirect loop when login credentials are wrong)
      const isLoginRequest = err.config?.url?.includes('/auth/login')
      if (!isLoginRequest) {
        localStorage.removeItem('haliberry_admin_token')
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(err)
  },
)

// ─── Products ────────────────────────────────────────────────────
export const productsApi = {
  list:   (params?: Record<string, unknown>) => api.get('/api/v1/products', { params }),
  get:    (id: string)                        => api.get(`/api/v1/products/${id}`),
  create: (data: Record<string, unknown>)     => api.post('/api/v1/products', data),
  update: (id: string, data: Record<string, unknown>) => api.patch(`/api/v1/products/${id}`, data),
  delete: (id: string)                        => api.delete(`/api/v1/products/${id}`),
  uploadImage: (id: string, file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post(`/api/v1/products/${id}/image`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

// ─── Gallery ─────────────────────────────────────────────────────
export const galleryApi = {
  list:   (params?: Record<string, unknown>) => api.get('/api/v1/gallery', { params }),
  upload: (file: File, category: string, caption?: string) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('category', category)
    if (caption) fd.append('caption', caption)
    return api.post('/api/v1/gallery/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  update: (id: string, data: Record<string, unknown>) => api.patch(`/api/v1/gallery/${id}`, data),
  delete: (id: string)                                 => api.delete(`/api/v1/gallery/${id}`),
}

// ─── Inquiries ───────────────────────────────────────────────────
export const inquiryApi = {
  submit:   (data: unknown)    => api.post('/api/v1/inquiries', data),
  list:     (unread?: boolean) => api.get('/api/v1/inquiries', { params: unread ? { unread_only: true } : {} }),
  markRead: (id: string)       => api.patch(`/api/v1/inquiries/${id}/read`),
  delete:   (id: string)       => api.delete(`/api/v1/inquiries/${id}`),
}

// ─── Classes ─────────────────────────────────────────────────────
export const classesApi = {
  list:   (params?: Record<string, unknown>) => api.get('/api/v1/classes', { params }),
  get:    (id: string)                        => api.get(`/api/v1/classes/${id}`),
  create: (data: Record<string, unknown>)     => api.post('/api/v1/classes', data),
  update: (id: string, data: Record<string, unknown>) => api.patch(`/api/v1/classes/${id}`, data),
  delete: (id: string)                        => api.delete(`/api/v1/classes/${id}`),
}

// ─── Testimonials ────────────────────────────────────────────────
export const testimonialsApi = {
  list:   ()                                          => api.get('/api/v1/testimonials'),
  update: (id: string, data: Record<string, unknown>) => api.patch(`/api/v1/testimonials/${id}`, data),
  delete: (id: string)                                => api.delete(`/api/v1/testimonials/${id}`),
}

// ─── Types ───────────────────────────────────────────────────────
export type GalleryImage = {
  id: string
  url: string
  title?: string
  category?: string
}

// ─── Auth ────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/api/v1/auth/login', { email, password }),
}

// // C:\Users\Melody\Documents\haliberrycake\frontend\src\lib\api.ts
// import axios from 'axios'

// export type GalleryImage = {
//   id: string
//   url: string
//   title?: string
//   category?: string
// }

// const baseURL = (import.meta as any).env?.VITE_API_URL ?? 'http://localhost:8000'

// export const api = axios.create({
//   baseURL,
//   headers: { 'Content-Type': 'application/json' },
//   timeout: 15_000,
// })

// // ── Attach JWT on every request ──────────────────────────────────
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('haliberry_admin_token')
//   if (token) config.headers.Authorization = `Bearer ${token}`
//   return config
// })

// // ── Surface 401 → redirect to admin login ────────────────────────
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       localStorage.removeItem('haliberry_admin_token')
//       window.location.href = '/admin/login'
//     }
//     return Promise.reject(err)
//   },
// )

// // ─── Products ────────────────────────────────────────────────────
// export const productsApi = {
//   list:   (params?: Record<string, unknown>) => api.get('/api/v1/products', { params }),
//   get:    (id: string)                        => api.get(`/api/v1/products/${id}`),
//   create: (data: Record<string, unknown>)     => api.post('/api/v1/products', data),
//   update: (id: string, data: Record<string, unknown>) => api.patch(`/api/v1/products/${id}`, data),
//   delete: (id: string)                        => api.delete(`/api/v1/products/${id}`),
//   uploadImage: (id: string, file: File) => {
//     const fd = new FormData()
//     fd.append('file', file)
//     return api.post(`/api/v1/products/${id}/image`, fd, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     })
//   },
// }

// // ─── Gallery ─────────────────────────────────────────────────────
// export const galleryApi = {
//   list:   (params?: Record<string, unknown>) => api.get('/api/v1/gallery', { params }),
//   upload: (file: File, category: string, caption?: string) => {
//     const fd = new FormData()
//     fd.append('file', file)
//     fd.append('category', category)
//     if (caption) fd.append('caption', caption)
//     return api.post('/api/v1/gallery/upload', fd, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     })
//   },
//   update: (id: string, data: Record<string, unknown>) => api.patch(`/api/v1/gallery/${id}`, data),
//   delete: (id: string)                                 => api.delete(`/api/v1/gallery/${id}`),
// }

// // ─── Inquiries ───────────────────────────────────────────────────
// export const inquiryApi = {
//   submit:   (data: unknown)    => api.post('/api/v1/inquiries', data),
//   list:     (unread?: boolean) => api.get('/api/v1/inquiries', { params: unread ? { unread_only: true } : {} }),
//   markRead: (id: string)       => api.patch(`/api/v1/inquiries/${id}/read`),
//   delete:   (id: string)       => api.delete(`/api/v1/inquiries/${id}`),
// }

// // ─── Classes ─────────────────────────────────────────────────────
// export const classesApi = {
//   list:   (params?: Record<string, unknown>) => api.get('/api/v1/classes', { params }),
//   get:    (id: string)                        => api.get(`/api/v1/classes/${id}`),
//   create: (data: Record<string, unknown>)     => api.post('/api/v1/classes', data),
//   update: (id: string, data: Record<string, unknown>) => api.patch(`/api/v1/classes/${id}`, data),
//   delete: (id: string)                        => api.delete(`/api/v1/classes/${id}`),
// }

// // ─── Testimonials ────────────────────────────────────────────────
// export const testimonialsApi = {
//   list:   ()                                          => api.get('/api/v1/testimonials'),
//   update: (id: string, data: Record<string, unknown>) => api.patch(`/api/v1/testimonials/${id}`, data),
//   delete: (id: string)                                => api.delete(`/api/v1/testimonials/${id}`),
// }

// // ─── Auth ────────────────────────────────────────────────────────
// export const authApi = {
//   login: (email: string, password: string) =>
//     api.post('/api/v1/auth/login', { email, password }),
// }