// C:\Users\Melody\Documents\haliberrycake\frontend\src\components\admin\AdminProducts.tsx
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Pencil, Trash2, Star, StarOff, ImagePlus, Search } from 'lucide-react'
import { productsApi } from '@/lib/api'
import {
  AdminPageHeader, AdminDrawer, ConfirmDialog,
  EmptyState, Badge, inputCls, labelCls, selectCls,
} from './AdminUI'
import type { Product } from '@/types'

/* ── Form schema ─────────────────────────────────────────────── */
const schema = z.object({
  name:        z.string().min(2),
  description: z.string().optional(),
  category:    z.enum(['wedding', 'birthday', 'cupcakes', 'desserts', 'treats']),
  price:       z.coerce.number().min(1, 'Price must be > 0'),
  featured:    z.boolean().optional(),
  in_stock:    z.boolean().optional(),
})
type FormValues = z.infer<typeof schema>

const CATEGORIES = ['wedding', 'birthday', 'cupcakes', 'desserts', 'treats'] as const

/* ── Product Form inside drawer ──────────────────────────────── */
function ProductForm({
  product,
  onSuccess,
}: {
  product: Product | null
  onSuccess: () => void
}) {
  const qc = useQueryClient()
  const isEdit = !!product

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: product
      ? { name: product.name, description: product.description ?? '', category: product.category as FormValues['category'], price: product.price, featured: product.featured, in_stock: product.in_stock }
      : { featured: false, in_stock: true },
  })

  const save = useMutation({
    mutationFn: (data: FormValues) =>
      isEdit
        ? productsApi.update(String(product!.id), data as Record<string, unknown>)
        : productsApi.create(data as Record<string, unknown>),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] })
      reset()
      onSuccess()
    },
  })

  return (
    <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-5">
      {/* Name */}
      <div>
        <label className={labelCls}>Product Name *</label>
        <input {...register('name')} placeholder="e.g. Three-Tier Wedding Cake" className={inputCls} />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Description</label>
        <textarea {...register('description')} rows={3} placeholder="Describe this product…"
          className={inputCls} style={{ resize: 'none' }} />
      </div>

      {/* Category + Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Category *</label>
          <select {...register('category')} className={selectCls}>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
        </div>
        <div>
          <label className={labelCls}>Price (£) *</label>
          <input {...register('price')} type="number" step="0.01" placeholder="120.00" className={inputCls} />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
        </div>
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        {[
          { name: 'featured' as const, label: 'Featured on homepage' },
          { name: 'in_stock' as const, label: 'In stock' },
        ].map(({ name, label }) => (
          <label key={name} className="flex items-center gap-2 cursor-pointer">
            <input {...register(name)} type="checkbox"
              className="w-4 h-4 rounded accent-[var(--peach)]" />
            <span className="font-sans text-sm text-[var(--text-secondary)]">{label}</span>
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || save.isPending}
        className="btn-primary w-full justify-center"
      >
        {save.isPending ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  )
}

/* ── Image upload row ────────────────────────────────────────── */
function ImageUploadRow({ product }: { product: Product }) {
  const qc = useQueryClient()
  const [uploading, setUploading] = useState(false)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      await productsApi.uploadImage(String(product.id), file)
      qc.invalidateQueries({ queryKey: ['admin-products'] })
    } finally {
      setUploading(false)
    }
  }

  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--cream)] flex-shrink-0 flex items-center justify-center">
        {product.image_url
          ? <img src={product.image_url} alt="" className="w-full h-full object-cover" />
          : <ImagePlus size={18} className="text-[var(--text-muted)]" />
        }
      </div>
      <span className="font-sans text-xs text-[var(--peach)] opacity-0 group-hover:opacity-100 transition-opacity">
        {uploading ? 'Uploading…' : 'Change image'}
      </span>
      <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
    </label>
  )
}

/* ── Main Products Page ──────────────────────────────────────── */
export default function AdminProducts() {
  const qc = useQueryClient()
  const [drawerOpen, setDrawerOpen]   = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const res = await productsApi.list({ page_size: 100, show_all: true })
      return res.data as { items: Product[]; total: number }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] })
      setDeleteTarget(null)
    },
  })

  const toggleFeatured = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      productsApi.update(id, { featured }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-products'] }),
  })

  const openCreate = () => { setEditProduct(null); setDrawerOpen(true) }
  const openEdit   = (p: Product) => { setEditProduct(p); setDrawerOpen(true) }

  const products = (data?.items ?? [])
    .filter(p => catFilter === 'all' || p.category === catFilter)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <AdminPageHeader
        title="Products"
        subtitle={`${data?.total ?? 0} products in your collection`}
        action={
          <button onClick={openCreate} className="btn-primary text-sm py-2.5">
            <Plus size={16} /> Add Product
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products…"
            className={inputCls + ' pl-9'}
          />
        </div>
        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {['all', ...CATEGORIES].map(c => (
            <button
              key={c} onClick={() => setCatFilter(c)}
              className="px-3.5 py-2 rounded-full font-sans text-xs font-medium capitalize transition-all"
              style={{
                background: c === catFilter ? 'var(--peach)' : '#FDF7F2',
                color:      c === catFilter ? 'white' : 'var(--text-secondary)',
                border:     `1.5px solid ${c === catFilter ? 'var(--peach)' : '#E0D0C5'}`,
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden bg-white border border-[var(--cream)] shadow-luxury-sm">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-12 rounded-xl animate-pulse bg-[var(--cream)]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            emoji="🎂" title="No products yet"
            body="Add your first cake to start building your collection."
            action={<button onClick={openCreate} className="btn-primary text-sm">Add First Product</button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: '#FDF7F2', borderBottom: '1px solid var(--cream)' }}>
                  {['Image','Name','Category','Price','Featured','Stock','Actions'].map(h => (
                    <th key={h} className="font-sans text-xs font-medium tracking-wider uppercase text-left px-5 py-3.5 text-[var(--text-muted)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr
                    key={p.id}
                    style={{
                      borderTop: '1px solid var(--cream)',
                      background: i % 2 === 0 ? 'white' : '#FEFCFB',
                    }}
                    className="hover:bg-[#FDF7F2] transition-colors group"
                  >
                    {/* Image */}
                    <td className="px-5 py-3.5">
                      <ImageUploadRow product={p} />
                    </td>
                    {/* Name */}
                    <td className="px-5 py-3.5">
                      <p className="font-sans text-sm font-medium text-[var(--text-primary)] max-w-[180px] truncate">{p.name}</p>
                      {p.description && (
                        <p className="font-sans text-xs text-[var(--text-muted)] mt-0.5 max-w-[180px] truncate">{p.description}</p>
                      )}
                    </td>
                    {/* Category */}
                    <td className="px-5 py-3.5">
                      <Badge label={p.category} />
                    </td>
                    {/* Price */}
                    <td className="px-5 py-3.5 font-sans text-sm font-semibold text-[var(--text-primary)]">
                      £{Number(p.price).toFixed(2)}
                    </td>
                    {/* Featured toggle */}
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => toggleFeatured.mutate({ id: String(p.id), featured: !p.featured })}
                        title={p.featured ? 'Remove from featured' : 'Set as featured'}
                        className="transition-colors"
                      >
                        {p.featured
                          ? <Star size={18} fill="var(--peach)" style={{ color: 'var(--peach)' }} />
                          : <StarOff size={18} className="text-[var(--text-muted)] hover:text-[var(--peach)]" />
                        }
                      </button>
                    </td>
                    {/* Stock */}
                    <td className="px-5 py-3.5">
                      <Badge label={p.in_stock ? 'In Stock' : 'Out of Stock'} colour={p.in_stock ? 'green' : 'red'} />
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(p)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--cream)] transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} className="text-[var(--text-secondary)]" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(p)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Drawer */}
      <AdminDrawer
        open={drawerOpen}
        title={editProduct ? `Edit: ${editProduct.name}` : 'Add New Product'}
        onClose={() => setDrawerOpen(false)}
      >
        <ProductForm
          product={editProduct}
          onSuccess={() => setDrawerOpen(false)}
        />
      </AdminDrawer>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Product"
        body={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(String(deleteTarget.id))}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

// // C:\Users\Melody\Documents\haliberrycake\frontend\src\components\admin\AdminProducts.tsx
// import { useState } from 'react'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { useForm } from 'react-hook-form'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
// import { Plus, Pencil, Trash2, Star, StarOff, ImagePlus, Search } from 'lucide-react'
// import { productsApi } from '@/lib/api'
// import {
//   AdminPageHeader, AdminDrawer, ConfirmDialog,
//   EmptyState, Badge, inputCls, labelCls, selectCls,
// } from './AdminUI'
// import type { Product } from '@/types'

// /* ── Form schema ─────────────────────────────────────────────── */
// const schema = z.object({
//   name:        z.string().min(2),
//   description: z.string().optional(),
//   category:    z.enum(['wedding', 'birthday', 'cupcakes', 'desserts', 'treats']),
//   price:       z.coerce.number().min(1, 'Price must be > 0'),
//   featured:    z.boolean().optional(),
//   in_stock:    z.boolean().optional(),
// })
// type FormValues = z.infer<typeof schema>

// const CATEGORIES = ['wedding', 'birthday', 'cupcakes', 'desserts', 'treats'] as const

// /* ── Product Form inside drawer ──────────────────────────────── */
// function ProductForm({
//   product,
//   onSuccess,
// }: {
//   product: Product | null
//   onSuccess: () => void
// }) {
//   const qc = useQueryClient()
//   const isEdit = !!product

//   const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
//     resolver: zodResolver(schema),
//     defaultValues: product
//       ? { name: product.name, description: product.description ?? '', category: product.category as FormValues['category'], price: product.price, featured: product.featured, in_stock: product.in_stock }
//       : { featured: false, in_stock: true },
//   })

//   const save = useMutation({
//     mutationFn: (data: FormValues) =>
//       isEdit
//         ? productsApi.update(String(product!.id), data as Record<string, unknown>)
//         : productsApi.create(data as Record<string, unknown>),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ['admin-products'] })
//       reset()
//       onSuccess()
//     },
//   })

//   return (
//     <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-5">
//       {/* Name */}
//       <div>
//         <label className={labelCls}>Product Name *</label>
//         <input {...register('name')} placeholder="e.g. Three-Tier Wedding Cake" className={inputCls} />
//         {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
//       </div>

//       {/* Description */}
//       <div>
//         <label className={labelCls}>Description</label>
//         <textarea {...register('description')} rows={3} placeholder="Describe this product…"
//           className={inputCls} style={{ resize: 'none' }} />
//       </div>

//       {/* Category + Price */}
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className={labelCls}>Category *</label>
//           <select {...register('category')} className={selectCls}>
//             {CATEGORIES.map(c => (
//               <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
//             ))}
//           </select>
//           {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
//         </div>
//         <div>
//           <label className={labelCls}>Price (£) *</label>
//           <input {...register('price')} type="number" step="0.01" placeholder="120.00" className={inputCls} />
//           {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
//         </div>
//       </div>

//       {/* Toggles */}
//       <div className="flex gap-6">
//         {[
//           { name: 'featured' as const, label: 'Featured on homepage' },
//           { name: 'in_stock' as const, label: 'In stock' },
//         ].map(({ name, label }) => (
//           <label key={name} className="flex items-center gap-2 cursor-pointer">
//             <input {...register(name)} type="checkbox"
//               className="w-4 h-4 rounded accent-[var(--peach)]" />
//             <span className="font-sans text-sm text-[var(--text-secondary)]">{label}</span>
//           </label>
//         ))}
//       </div>

//       <button
//         type="submit"
//         disabled={isSubmitting || save.isPending}
//         className="btn-primary w-full justify-center"
//       >
//         {save.isPending ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
//       </button>
//     </form>
//   )
// }

// /* ── Image upload row ────────────────────────────────────────── */
// function ImageUploadRow({ product }: { product: Product }) {
//   const qc = useQueryClient()
//   const [uploading, setUploading] = useState(false)

//   async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0]
//     if (!file) return
//     setUploading(true)
//     try {
//       await productsApi.uploadImage(String(product.id), file)
//       qc.invalidateQueries({ queryKey: ['admin-products'] })
//     } finally {
//       setUploading(false)
//     }
//   }

//   return (
//     <label className="flex items-center gap-2 cursor-pointer group">
//       <div className="w-12 h-12 rounded-xl overflow-hidden bg-[var(--cream)] flex-shrink-0 flex items-center justify-center">
//         {product.image_url
//           ? <img src={product.image_url} alt="" className="w-full h-full object-cover" />
//           : <ImagePlus size={18} className="text-[var(--text-muted)]" />
//         }
//       </div>
//       <span className="font-sans text-xs text-[var(--peach)] opacity-0 group-hover:opacity-100 transition-opacity">
//         {uploading ? 'Uploading…' : 'Change image'}
//       </span>
//       <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
//     </label>
//   )
// }

// /* ── Main Products Page ──────────────────────────────────────── */
// export default function AdminProducts() {
//   const qc = useQueryClient()
//   const [drawerOpen, setDrawerOpen]   = useState(false)
//   const [editProduct, setEditProduct] = useState<Product | null>(null)
//   const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
//   const [search, setSearch] = useState('')
//   const [catFilter, setCatFilter] = useState('all')

//   const { data, isLoading } = useQuery({
//     queryKey: ['admin-products'],
//     queryFn: async () => {
//       const res = await productsApi.list({ page_size: 100, show_all: true })
//       return res.data as { items: Product[]; total: number }
//     },
//   })

//   const deleteMutation = useMutation({
//     mutationFn: (id: string) => productsApi.delete(id),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ['admin-products'] })
//       setDeleteTarget(null)
//     },
//   })

//   const toggleFeatured = useMutation({
//     mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
//       productsApi.update(id, { featured }),
//     onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-products'] }),
//   })

//   const openCreate = () => { setEditProduct(null); setDrawerOpen(true) }
//   const openEdit   = (p: Product) => { setEditProduct(p); setDrawerOpen(true) }

//   const products = (data?.items ?? [])
//     .filter(p => catFilter === 'all' || p.category === catFilter)
//     .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

//   return (
//     <div>
//       <AdminPageHeader
//         title="Products"
//         subtitle={`${data?.total ?? 0} products in your collection`}
//         action={
//           <button onClick={openCreate} className="btn-primary text-sm py-2.5">
//             <Plus size={16} /> Add Product
//           </button>
//         }
//       />

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 mb-6">
//         {/* Search */}
//         <div className="relative flex-1 min-w-[200px]">
//           <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
//           <input
//             value={search} onChange={e => setSearch(e.target.value)}
//             placeholder="Search products…"
//             className={inputCls + ' pl-9'}
//           />
//         </div>
//         {/* Category pills */}
//         <div className="flex flex-wrap gap-2">
//           {['all', ...CATEGORIES].map(c => (
//             <button
//               key={c} onClick={() => setCatFilter(c)}
//               className="px-3.5 py-2 rounded-full font-sans text-xs font-medium capitalize transition-all"
//               style={{
//                 background: c === catFilter ? 'var(--peach)' : '#FDF7F2',
//                 color:      c === catFilter ? 'white' : 'var(--text-secondary)',
//                 border:     `1.5px solid ${c === catFilter ? 'var(--peach)' : '#E0D0C5'}`,
//               }}
//             >
//               {c}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Table */}
//       <div className="rounded-2xl overflow-hidden bg-white border border-[var(--cream)] shadow-luxury-sm">
//         {isLoading ? (
//           <div className="p-8 space-y-3">
//             {[1,2,3,4].map(i => (
//               <div key={i} className="h-12 rounded-xl animate-pulse bg-[var(--cream)]" />
//             ))}
//           </div>
//         ) : products.length === 0 ? (
//           <EmptyState
//             emoji="🎂" title="No products yet"
//             body="Add your first cake to start building your collection."
//             action={<button onClick={openCreate} className="btn-primary text-sm">Add First Product</button>}
//           />
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr style={{ background: '#FDF7F2', borderBottom: '1px solid var(--cream)' }}>
//                   {['Image','Name','Category','Price','Featured','Stock','Actions'].map(h => (
//                     <th key={h} className="font-sans text-xs font-medium tracking-wider uppercase text-left px-5 py-3.5 text-[var(--text-muted)]">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {products.map((p, i) => (
//                   <tr
//                     key={p.id}
//                     style={{
//                       borderTop: '1px solid var(--cream)',
//                       background: i % 2 === 0 ? 'white' : '#FEFCFB',
//                     }}
//                     className="hover:bg-[#FDF7F2] transition-colors group"
//                   >
//                     {/* Image */}
//                     <td className="px-5 py-3.5">
//                       <ImageUploadRow product={p} />
//                     </td>
//                     {/* Name */}
//                     <td className="px-5 py-3.5">
//                       <p className="font-sans text-sm font-medium text-[var(--text-primary)] max-w-[180px] truncate">{p.name}</p>
//                       {p.description && (
//                         <p className="font-sans text-xs text-[var(--text-muted)] mt-0.5 max-w-[180px] truncate">{p.description}</p>
//                       )}
//                     </td>
//                     {/* Category */}
//                     <td className="px-5 py-3.5">
//                       <Badge label={p.category} />
//                     </td>
//                     {/* Price */}
//                     <td className="px-5 py-3.5 font-sans text-sm font-semibold text-[var(--text-primary)]">
//                       £{Number(p.price).toFixed(2)}
//                     </td>
//                     {/* Featured toggle */}
//                     <td className="px-5 py-3.5">
//                       <button
//                         onClick={() => toggleFeatured.mutate({ id: String(p.id), featured: !p.featured })}
//                         title={p.featured ? 'Remove from featured' : 'Set as featured'}
//                         className="transition-colors"
//                       >
//                         {p.featured
//                           ? <Star size={18} fill="var(--peach)" style={{ color: 'var(--peach)' }} />
//                           : <StarOff size={18} className="text-[var(--text-muted)] hover:text-[var(--peach)]" />
//                         }
//                       </button>
//                     </td>
//                     {/* Stock */}
//                     <td className="px-5 py-3.5">
//                       <Badge label={p.in_stock ? 'In Stock' : 'Out of Stock'} colour={p.in_stock ? 'green' : 'red'} />
//                     </td>
//                     {/* Actions */}
//                     <td className="px-5 py-3.5">
//                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                         <button
//                           onClick={() => openEdit(p)}
//                           className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--cream)] transition-colors"
//                           title="Edit"
//                         >
//                           <Pencil size={14} className="text-[var(--text-secondary)]" />
//                         </button>
//                         <button
//                           onClick={() => setDeleteTarget(p)}
//                           className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
//                           title="Delete"
//                         >
//                           <Trash2 size={14} className="text-red-400" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* Create / Edit Drawer */}
//       <AdminDrawer
//         open={drawerOpen}
//         title={editProduct ? `Edit: ${editProduct.name}` : 'Add New Product'}
//         onClose={() => setDrawerOpen(false)}
//       >
//         <ProductForm
//           product={editProduct}
//           onSuccess={() => setDrawerOpen(false)}
//         />
//       </AdminDrawer>

//       {/* Delete confirmation */}
//       <ConfirmDialog
//         open={!!deleteTarget}
//         title="Delete Product"
//         body={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
//         loading={deleteMutation.isPending}
//         onConfirm={() => deleteTarget && deleteMutation.mutate(String(deleteTarget.id))}
//         onCancel={() => setDeleteTarget(null)}
//       />
//     </div>
//   )
// }