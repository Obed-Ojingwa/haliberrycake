import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
})

export const classesApi = {
  list: (params: { upcoming_only?: boolean } = {}) => api.get('/classes', { params }),
}

export const inquiryApi = {
  submit: (data: any) => api.post('/inquiries', data),
}

export const testimonialsApi = {
  list: () => api.get('/testimonials'),
}

export const galleryApi = {
  list: () => api.get('/gallery'),
}

export const api = {
  get: (endpoint: string) => api.get(endpoint),
  post: (endpoint: string, data: any) => api.post(endpoint, data),
}

// Types
export type CakeClass = {
  id: string
  title: string
  description: string
  price: number
  level: 'beginner' | 'intermediate' | 'advanced'
  class_date: string
  duration: number
  slots?: number
  slots_remaining?: number
}

export type CICProgram = {
  id: string
  title: string
  description: string
  impact_stats?: Record<string, number>
}

export type Testimonial = {
  id: number
  customer_name: string
  message: string
  rating: number
  image_url?: string
  created_at: string
}

export type GalleryImage = {
  id: string
  title?: string
  url: string
  category?: string
}