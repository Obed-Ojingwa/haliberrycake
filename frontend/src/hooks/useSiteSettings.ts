// C:\Users\Melody\Documents\haliberrycake\frontend\src\hooks\useSiteSettings.ts
import { useQuery } from '@tanstack/react-query'
import { siteSettingsApi } from '@/lib/api'
import type { SiteSettingResponse } from '@/types'

// We don't have the SiteSettingResponse type in the frontend yet, so we'll define it here or import from a generated types file.
// Since we don't have a generated types file, we'll define it based on the backend response.
// However, to avoid duplication, we can create a types file for site settings or extend the existing types.
// For now, let's define the type in this hook and then we can move it to a shared types file later.

export interface SiteSetting {
  id: string
  key: string
  image_url: string | null
  caption: string | null
  created_at: string
  updated_at: string
}

export function useSiteSettings() {
  return useQuery<SiteSetting[]>({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const res = await siteSettingsApi.list()
      return res.data
    },
    staleTime: 1000 * 60 * 60, // 1 hour cache — site settings change infrequently
  })
}