// C:\Users\Melody\Documents\haliberrycake\frontend\src\hooks\useProducts.ts
import { useQuery } from '@tanstack/react-query'
import { productsApi } from '@/lib/api'
import type { Product, ProductCategory, PaginatedResponse } from '@/types'

interface UseProductsOptions {
  category?: ProductCategory | 'all'
  search?: string
  featured?: boolean
  page?: number
  pageSize?: number
}

export function useProducts({
  category,
  search,
  featured,
  page = 1,
  pageSize = 12,
}: UseProductsOptions = {}) {
  // Backend query param is `page_size` (not `per_page`)
  const params: Record<string, unknown> = { page, page_size: pageSize }
  if (category && category !== 'all') params.category = category
  if (search) params.search = search
  if (featured !== undefined) params.featured = featured

  return useQuery<PaginatedResponse<Product>>({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await productsApi.list(params)
      return data
    },
    staleTime: 3 * 60 * 1000,
  })
}

export function useFeaturedProducts() {
  return useQuery<Product[]>({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      // page_size (not per_page) — backend param name
      const { data } = await productsApi.list({ featured: true, page_size: 6 })
      return data.items ?? data
    },
    staleTime: 5 * 60 * 1000, // Check on this 
  })
}

export function useProduct(id: string | number) {
  return useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      // Always coerce to string — API path param is a UUID string
      const { data } = await productsApi.get(String(id))
      return data
    },
    enabled: !!id,
  })
}