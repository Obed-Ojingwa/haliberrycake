// C:\Users\Melody\Documents\haliberrycake\frontend\src\types\index.ts

export interface Product {
  id: number | string
  name: string
  description?: string | null
  category: ProductCategory
  image_url: string | null
  price: number
  featured: boolean
  in_stock: boolean          // ← was missing
  updated_at: string
  created_at: string
}

export type ProductCategory =
  | 'wedding'
  | 'birthday'
  | 'cupcakes'
  | 'desserts'
  | 'treats'

export interface CakeClass {
  id: number | string
  title: string
  description?: string | null
  class_date: string
  duration: number           // hours (numeric)
  duration_hours?: number
  price: number
  slots?: number
  total_slots?: number
  booked_slots?: number
  slots_remaining?: number
  available_slots?: number
  level?: 'beginner' | 'intermediate' | 'advanced'   // ← was missing
  location?: string | null
  image_url?: string | null
  is_active?: boolean
  created_at: string
}

export interface Testimonial {
  id: number | string
  customer_name: string
  customer_role?: string | null
  message: string
  image_url: string | null
  rating: number
  is_featured?: boolean
  is_approved?: boolean
  created_at: string
}

export interface GalleryItem {
  id: number | string
  image_url: string
  category: string
  caption?: string | null
  alt_text?: string | null
  is_featured?: boolean
  sort_order?: number
  created_at?: string
}

export interface Inquiry {
  id: number | string
  name: string
  email: string
  phone?: string | null
  message: string
  service_type: ServiceType
  event_date?: string | null
  budget_range?: string | null
  is_read: boolean
  is_replied: boolean
  created_at: string
}

export type ServiceType =
  | 'wedding_cake'
  | 'birthday_cake'
  | 'cupcakes'
  | 'dessert_box'
  | 'luxury_treats'
  | 'cake_class'
  | 'cic_programme'
  | 'general'

export interface CICProgram {
  id: number | string
  title: string
  description?: string | null
  impact_stats?: Record<string, string | number> | null
  image_url?: string | null
  is_active?: boolean
  sort_order?: number
  created_at?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}

export interface ApiError {
  detail: string
}

export interface AuthToken {
  access_token: string
  token_type: 'bearer'
}