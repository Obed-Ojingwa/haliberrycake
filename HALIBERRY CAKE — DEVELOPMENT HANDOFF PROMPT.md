# HALIBERRY CAKE — DEVELOPMENT HANDOFF PROMPT
# Copy this entire document and paste it as your first message in the new Claude chat.

---

You are continuing the development of **Haliberry Cake** — a fully deployed luxury bakery platform for a London-based cake artist named Halimot. The project is live in production. You must read every detail below before writing a single line of code.

---

## CRITICAL RULES — FOLLOW ALWAYS

1. **Every code file must start with its full Windows path as a comment:**
   ```
   # C:\Users\Melody\Documents\haliberrycake\backend\app\api\products.py
   ```
   or for frontend:
   ```
   // C:\Users\Melody\Documents\haliberrycake\frontend\src\pages\Shop.tsx
   ```

2. **Never duplicate code.** The biggest bugs in this project came from files being accidentally written twice. Every file must be a single clean version.

3. **Do 3–5 focused changes per session max** to preserve tokens.

4. **Always check existing file content before editing** using a read/audit step. Never assume what a file contains.

5. **Brand palette — use consistently:**
   - Peach Glow: `#F8A974` → CSS var: `var(--peach)`
   - Soft Apricot: `#FBD6B2` → CSS var: `var(--apricot)`
   - Blush Petal: `#F2B6B8` → CSS var: `var(--blush)`
   - Golden Dew: `#F6E2B5` → CSS var: `var(--golden)`
   - Creamy Mist: `#F2E8E1` → CSS var: `var(--cream)`
   - Text Primary: `#2C1810`
   - Heading font: **Cormorant Garamond** (`font-serif`)
   - Body font: **Poppins** (`font-sans`)

---

## TECH STACK

**Frontend:**
- React 18 + TypeScript + Vite
- Tailwind CSS (custom brand config)
- Framer Motion (animations)
- React Router DOM v6
- TanStack Query v5 (data fetching)
- React Hook Form + Zod (forms)
- Axios (HTTP client)
- react-helmet-async (SEO)
- Lucide React (icons)

**Backend:**
- Python 3.12.11
- FastAPI 0.115.12
- SQLAlchemy 2.0.41
- Alembic (migrations)
- bcrypt 4.3.0 (password hashing — using bcrypt DIRECTLY, NOT passlib)
- python-jose (JWT tokens)
- Supabase (PostgreSQL database + Storage for images)
- psycopg2-binary (database driver)
- pydantic 2.11.5 + pydantic-settings 2.9.1
- slowapi (rate limiting)

**Deployment:**
- Frontend → Vercel: `https://haliberrycake.vercel.app`
- Backend → Render: `https://haliberrycake.onrender.com`
- Database → Supabase (PostgreSQL + Storage bucket: `haliberry-assets`)

---

## PROJECT STRUCTURE

```
haliberrycake/
├── frontend/
│   ├── index.html                          # SEO, OG tags, JSON-LD, Google Fonts
│   ├── package.json                        # All deps including @types/node
│   ├── vite.config.ts                      # Path alias @/ → ./src/
│   ├── tailwind.config.ts                  # Full brand palette
│   ├── tsconfig.json
│   ├── postcss.config.js
│   ├── .env.example                        # VITE_API_URL=http://localhost:8000
│   └── src/
│       ├── main.tsx                        # React root + HelmetProvider + QueryClient
│       ├── App.tsx                         # Lazy routes + ProtectedRoute for admin
│       ├── index.css                       # CSS vars, btn classes, brand styles
│       ├── types/index.ts                  # All TypeScript interfaces
│       ├── lib/
│       │   ├── api.ts                      # Axios instance + all API helpers
│       │   └── animations.ts              # Framer Motion variants
│       ├── hooks/
│       │   ├── useAuth.ts                  # JWT decode + expiry check
│       │   ├── useProducts.ts             # TanStack Query product hooks
│       │   └── useScrollReveal.ts         # IntersectionObserver hook
│       ├── pages/
│       │   ├── Home.tsx                   # ✅ Full — 7 sections
│       │   ├── About.tsx                  # ✅ Full — Hero, Bio, Timeline, Values
│       │   ├── Shop.tsx                   # ⚠️  Code complete but shows "coming soon" in prod
│       │   ├── CakeClasses.tsx            # ✅ Full — API-connected, booking modal
│       │   ├── CIC.tsx                    # ✅ Full — stats, mission, programmes
│       │   ├── Gallery.tsx               # ✅ Full — masonry, lightbox, category filter
│       │   ├── Testimonials.tsx           # ✅ Full — grid + static fallback
│       │   ├── Contact.tsx                # ✅ Full — RHF+Zod form, Maps embed
│       │   └── admin/
│       │       ├── AdminLogin.tsx         # ✅ JWT login with real error display
│       │       └── AdminDashboard.tsx     # ✅ Full — all 7 sections built
│       └── components/
│           ├── layout/
│           │   ├── Layout.tsx
│           │   ├── Navbar.tsx             # Transparent→solid on scroll, mobile menu
│           │   └── Footer.tsx
│           ├── home/
│           │   ├── HeroSection.tsx        # Dark luxury hero, ambient orbs
│           │   ├── FounderSection.tsx
│           │   ├── ProductShowcase.tsx
│           │   ├── CICImpactSection.tsx
│           │   ├── TestimonialsSection.tsx # Animated carousel
│           │   ├── GalleryPreview.tsx     # ⚠️  Shows placeholder gradients, not DB images
│           │   └── CTABanner.tsx
│           ├── about/                     # ✅ All 5 sections built
│           ├── shop/
│           │   ├── CategoryFilter.tsx     # ✅ Categories: wedding/birthday/cupcakes/desserts/treats
│           │   ├── ProductCard.tsx        # ✅ Image, hover overlay, enquire button
│           │   ├── ProductGrid.tsx        # ✅ Skeleton, empty, error states
│           │   └── InquiryModal.tsx       # ✅ Spring modal, RHF + Zod
│           ├── admin/
│           │   ├── AdminUI.tsx            # Shared: ConfirmDialog, AdminDrawer, EmptyState, Badge
│           │   ├── AdminProducts.tsx      # ✅ Full CRUD + image upload
│           │   ├── AdminGallery.tsx       # ✅ Drag-drop upload, grid, featured toggle
│           │   ├── AdminInquiries.tsx     # ✅ Inbox, read/unread, drawer detail
│           │   └── ProtectedRoute.tsx     # JWT auth guard
│           └── ui/
│               ├── Button.tsx
│               ├── PageLoader.tsx
│               ├── SectionHeader.tsx
│               └── WhatsAppFloat.tsx
│
└── backend/
    ├── requirements.txt                    # Python deps — bcrypt 4.3.0, NO passlib
    ├── runtime.txt                        # python-3.12.11
    ├── render.yaml                        # Render deployment config
    ├── build.sh                           # Alternative build script
    ├── seed.py                            # Creates first admin user
    ├── fix_password.py                    # Generates correct bcrypt hash
    ├── alembic.ini
    ├── alembic/
    │   ├── env.py
    │   ├── script.py.mako
    │   └── versions/                      # Run: alembic revision --autogenerate
    └── app/
        ├── main.py                        # FastAPI app — CORS, routers, lifespan
        ├── __init__.py
        ├── core/
        │   ├── config.py                  # Pydantic settings — all env vars
        │   └── auth.py                    # bcrypt direct (NOT passlib), JWT
        ├── database/
        │   └── session.py                 # SQLAlchemy engine, pool_size=2
        ├── models/                        # SQLAlchemy ORM models
        │   ├── product.py
        │   ├── cake_class.py
        │   ├── testimonial.py
        │   ├── gallery.py                 # GalleryImage model
        │   ├── inquiry.py
        │   ├── cic.py
        │   └── user.py
        ├── schemas/                       # Pydantic v2 schemas
        │   ├── auth.py
        │   ├── product.py                 # ProductListResponse with pagination
        │   ├── cake_class.py              # available_slots via from_orm_with_slots()
        │   ├── testimonial.py
        │   └── gallery.py                 # Also has InquiryCreate, CICProgram schemas
        ├── api/                           # FastAPI routers
        │   ├── auth.py                    # POST /login, GET /debug-users (temp), GET /reset-admin-password (temp)
        │   ├── products.py                # CRUD + show_all param for admin
        │   ├── cake_classes.py            # CRUD + from_orm_with_slots fix
        │   ├── gallery.py                 # Upload to Supabase Storage
        │   ├── testimonials.py            # Public submit + admin approve
        │   ├── inquiries.py               # Rate-limited (5/hour) + admin read
        │   └── cic.py                     # CRUD
        └── services/
            └── storage.py                 # Supabase Storage in prod, /tmp/ in dev
```

---

## API ENDPOINTS

All endpoints prefixed with `/api/v1/`

```
AUTH
  POST  /auth/login                      → JWT token
  GET   /auth/debug-users                → TEMP: list users (delete after testing)
  GET   /auth/reset-admin-password       → TEMP: reset password via URL (delete after)

PRODUCTS
  GET   /products                        → list (params: category, featured, search, page, page_size, show_all)
  GET   /products/{id}
  POST  /products                        → admin only
  PATCH /products/{id}                   → admin only
  DELETE /products/{id}                  → admin only
  POST  /products/{id}/image             → admin only, multipart upload

CAKE CLASSES
  GET   /classes                         → params: upcoming_only, level
  GET   /classes/{id}
  POST  /classes                         → admin only
  PATCH /classes/{id}                    → admin only
  DELETE /classes/{id}                   → admin only

GALLERY
  GET   /gallery                         → params: category, featured_only
  POST  /gallery/upload                  → admin only, multipart
  PATCH /gallery/{id}                    → admin only
  DELETE /gallery/{id}                   → admin only

TESTIMONIALS
  GET   /testimonials                    → approved only (public)
  GET   /testimonials/admin/all          → admin only, includes pending
  POST  /testimonials                    → public submit (saved as pending)
  PATCH /testimonials/{id}               → admin only
  PATCH /testimonials/{id}/approve       → admin only
  DELETE /testimonials/{id}              → admin only

INQUIRIES
  POST  /inquiries                       → public, rate limited 5/hour
  GET   /inquiries                       → admin only
  PATCH /inquiries/{id}/read             → admin only
  DELETE /inquiries/{id}                 → admin only

CIC PROGRAMS
  GET   /cic                             → active programmes
  POST  /cic                             → admin only
  PATCH /cic/{id}                        → admin only
  DELETE /cic/{id}                       → admin only

HEALTH
  GET   /health                          → { status, service, env, cors_origins }
```

---

## ENVIRONMENT VARIABLES

**Render (backend):**
```
DATABASE_URL          postgresql://postgres.xxx:PASS@aws-1-eu-central-1.pooler.supabase.com:6543/postgres
SECRET_KEY            haliberry-cake-london-jwt-secret-key-2024-change-me
APP_ENV               production
ALGORITHM             HS256
ACCESS_TOKEN_EXPIRE_MINUTES  60
ADMIN_EMAIL           admin@haliberrycake.co.uk
ADMIN_PASSWORD        Haliberry2024
FRONTEND_URL          https://haliberrycake.vercel.app
PRODUCTION_URL        https://haliberrycake.co.uk
SUPABASE_URL          https://gjdyuhnqnkbjchuutdko.supabase.co
SUPABASE_ANON_KEY     eyJhbG...
SUPABASE_SERVICE_KEY  eyJhbG...
PYTHON_VERSION        3.12.11
```

**Vercel (frontend):**
```
VITE_API_URL          https://haliberrycake.onrender.com
```

---

## KNOWN BUGS ALREADY FIXED

1. ✅ `passlib` + `bcrypt>=4.0` incompatibility → replaced with direct `bcrypt` calls
2. ✅ `pydantic-core` Rust compilation on Render → using pydantic 2.11.5 (has py3.14 wheel)
3. ✅ `postgres://` prefix → auto-converted to `postgresql://` in config validator
4. ✅ `frontend_url: str = "...", "..."` tuple bug in config → fixed to single string
5. ✅ Duplicate `app = FastAPI()` in `main.py` → cleaned to single definition
6. ✅ Duplicate routes in `AdminDashboard.tsx` → cleaned to single definition
7. ✅ `per_page` vs `page_size` param mismatch → fixed to `page_size`
8. ✅ `available_slots` Pydantic v2 `@property` not serialised → `from_orm_with_slots()`
9. ✅ 401 interceptor redirect loop on login page → skip redirect if URL contains `/auth/login`
10. ✅ Admin products hidden by `in_stock==True` filter → added `show_all=true` param
11. ✅ `$2y$` PHP bcrypt hashes from online generators → use `fix_password.py` locally

---

## WHAT NEEDS TO BE BUILT NEXT

### PRIORITY 1 — Shop page showing "coming soon" in production
The code in `Shop.tsx` is complete and correct. The issue is likely:
- `ProductGrid.tsx` renders an empty/error state because no products exist in Supabase yet
- OR the component has a stale Vercel deployment with old code
Fix: audit `Shop.tsx` return block fully, check `ProductGrid` empty/error states, ensure it gracefully shows "no products yet — check back soon" instead of a broken state. Then add sample products via the admin panel.

### PRIORITY 2 — Gallery images not showing on public pages
The `GalleryPreview.tsx` on the homepage shows placeholder gradient boxes.
The `Gallery.tsx` public page fetches from `/api/v1/gallery` correctly.
The issue: images uploaded via admin go to Supabase Storage and the URL is stored in `gallery_images.image_url`. But Supabase Storage requires the bucket to be **public** and the URL format to be the full CDN URL.
Fix:
- Verify the `haliberry-assets` bucket is set to Public in Supabase dashboard
- `storage.py` returns `client.storage.from_(BUCKET_NAME).get_public_url(unique_name)` — verify this URL is actually accessible
- `GalleryPreview.tsx` and `Gallery.tsx` both use `item.image_url` in `<img src={...}>` — if the URL is correct they will work
- Add a fallback gradient when `image_url` is null

### PRIORITY 3 — Admin image upload for homepage/about sections  
Currently the admin can upload to Gallery (portfolio images).
But the **Homepage hero, Founder photo, About page images** are hardcoded placeholder gradients with emoji.
Needed: A `HeroImages` or `SiteImages` admin section where Halimot can upload:
- Hero background image
- Founder portrait photo  
- About page images
These should be stored in Supabase Storage under a `site-images/` folder and their URLs saved to a `site_settings` table or as special gallery categories.

### PRIORITY 4 — Delete the temporary auth endpoints
Once login is confirmed working, remove from `auth.py`:
- `GET /auth/debug-users`
- `GET /auth/reset-admin-password`
These are unprotected and expose user data.

### PRIORITY 5 — Deployment config (Area B)
- `frontend/vercel.json` — React Router SPA fallback (fixes 404 on direct URL access)
- Deploy checklist documentation

---

## DATABASE SCHEMA (Supabase)

All tables use `TEXT` primary keys (UUID strings). Created via SQL Editor in Supabase:

```sql
users, products, cake_classes, testimonials, gallery_images, inquiries, cic_programs
```

Key field names (important for frontend↔backend matching):
- Products: `id, name, description, category, image_url, price, featured, in_stock`
- CakeClass: `id, title, description, class_date, duration_hours, price, total_slots, booked_slots, level, location, is_active`
- Gallery: `id, image_url, category, caption, alt_text, is_featured, sort_order`
- Inquiry: `id, name, email, phone, service_type, message, event_date, budget_range, is_read, is_replied`
- Testimonial: `id, customer_name, customer_role, message, image_url, rating, is_featured, is_approved`
- CICProgram: `id, title, description, impact_stats (JSONB), image_url, is_active, sort_order`
- User: `id, email, hashed_password, full_name, is_admin, is_active, last_login`

Product categories (backend enforces this enum): `wedding | birthday | cupcakes | desserts | treats`

---

## ADMIN DASHBOARD SECTIONS (all built)

| Route | Component | Status |
|---|---|---|
| `/admin` | Overview — stats + recent inquiries table | ✅ |
| `/admin/products` | AdminProducts — CRUD table, drawer form, image upload | ✅ |
| `/admin/classes` | AdminClasses — list, create/edit drawer, delete | ✅ |
| `/admin/gallery` | AdminGallery — drag-drop upload queue, grid, featured toggle | ✅ |
| `/admin/reviews` | AdminTestimonials — approve/reject/feature/delete | ✅ |
| `/admin/inquiries` | AdminInquiries — inbox, read/unread, reply via email | ✅ |
| `/admin/cic` | AdminCIC — create/edit/delete programmes | ✅ |

---

## HOW AUTHENTICATION WORKS

```
POST /api/v1/auth/login  { email, password }
  → backend: bcrypt.checkpw(password.encode(), hash.encode())
  → returns: { access_token: "eyJ...", token_type: "bearer" }
  → frontend: stored in localStorage as 'haliberry_admin_token'
  → all subsequent API calls send: Authorization: Bearer eyJ...
  → token expires: 60 minutes
  → ProtectedRoute checks token expiry client-side via JWT decode
```

**IMPORTANT:** bcrypt is used **directly** — NOT via passlib.
```python
import bcrypt
bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=12))
bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
```

---

## BRAND DESIGN SYSTEM

**Tailwind classes available (defined in index.css):**
- `.btn-primary` — peach fill button with shadow
- `.btn-outline` — peach border button  
- `.btn-ghost` — semi-transparent button for dark backgrounds
- `.card-luxury` — white card with luxury shadow + hover lift
- `.section-eyebrow` — small uppercase peach label
- `.section-title` — large serif heading
- `.section-subtitle` — muted sans-serif subtitle
- `.text-gradient` — peach-to-blush gradient text

**Framer Motion variants (from `@/lib/animations.ts`):**
`fadeUp, fadeIn, fadeLeft, fadeRight, scaleIn, staggerContainer, staggerContainerSlow, heroTextReveal, imageFloat`

---

## RECENT IMPORTANT DECISIONS

- **passlib replaced with direct bcrypt** — passlib 1.7.4 is incompatible with bcrypt 4.x. Never reintroduce passlib.
- **pydantic-core not pinned separately** — let pydantic pull the correct version automatically.
- **Pool size = 2** — Supabase free tier has 15 connection limit. Never set pool_size > 5.
- **Supabase pooler URL** — use Transaction mode (port 6543) not Session mode (5432) for Render.
- **`postgres://` prefix** — always auto-convert to `postgresql://` in the database URL validator.
- **No duplicate code** — every past major bug came from files being accidentally doubled. Always check line count before and after edits.
- **Admin shows all products** — pass `show_all=true` to `/api/v1/products` from admin to bypass `in_stock` filter.

---

You can first ask me which files/code you will want to see before proceeding. Now continue the development (You can first ask me which files you will want to see before proceeding). Start with the **highest priority items** listed above. Always begin by reading the relevant existing files before making changes.