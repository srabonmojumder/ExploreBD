# ExploreBD — Bangladesh Travel Exploration & Tracking Platform 🇧🇩

A modern, full-stack travel platform and interactive tracking engine engineered specifically for exploring Bangladesh. ExploreBD enables travelers to uncover attractions across all **8 Divisions** and **64 Districts**, track multiple visits to micro-spots, compute personal exploration percentages, generate beautiful social share cards, and celebrate the natural heritage of Bangladesh.

---

## 🌟 Key Platform Features

- 🗺️ **Interactive Vector Map of Bangladesh:** Real-time SVG map powered by `manchitro`. Click any of the 64 districts to mark as visited and paint the district green with dynamic national coverage calculations.
- 🎒 **Micro-Spot Multi-Visit Tracking:** Log repeat visits to waterfalls, beaches, and historic landmarks (e.g. visited 3 times, dates, notes) with instant offline persistence via client-side Zustand.
- 📸 **High-Resolution Social Share Cards:** One-click generation of 1080×1350 PNG travel cards featuring the traveler's custom name, completion percentage, visited districts list, and achievement badges.
- 🏙️ **64 Districts & Tourist Places Explorer:** Fast search, category filters (waterfalls, beaches, hills, lakes, heritage), GPS coordinates, and direct Google Maps navigation.
- ⚡ **Ultra-Fast Performance:** In-memory TanStack Query caching (0ms instant page navigation), HTTP `Cache-Control` headers, and Next.js font delivery.
- 🎨 **Modern Dark Glassmorphic Design:** Tailored emerald/teal palette, responsive viewports, and unified Lucide icons.

---

## 📊 Administrative Hierarchy & Spot Breakdown

| Division (বিভাগ) | Bengali Name | District Count | Active Seeded Spots | Notable Attractions |
| :--- | :--- | :---: | :---: | :--- |
| **Chattogram** | চট্টগ্রাম | 11 | **19** | Cox's Bazar, Sajek Valley, Sitakunda Eco Park, Saint Martin's Island, Nilgiri, Boga Lake, Naval Beach, Foy's Lake |
| **Dhaka** | ঢাকা | 13 | **8** | Lalbagh Fort, Ahsan Manzil, Panam City, National Parliament, Dhanmondi Lake, Ramna Park, Star Mosque |
| **Sylhet** | সিলেট | 4 | **5** | Sreemangal Tea Gardens, Ratargul Swamp Forest, Bichanakandi, Jaflong, Madhabkunda Waterfall, Tanguar Haor |
| **Khulna** | খুলনা | 10 | **2** | Sundarbans National Park, Sixty Dome Mosque (Bagerhat) |
| **Barishal** | বরিশাল | 6 | **1** | Kuakata Sea Beach (Daughter of the Sea) |
| **Rajshahi** | রাজশাহী | 8 | **1** | Somapura Mahavihara (Paharpur) |
| **Rangpur** | রংপুর | 8 | **1** | Kantajew Temple (Dinajpur) |
| **Mymensingh** | ময়মনসিংহ | 4 | **1** | Birishiri Ceramic Hills & Lake (Netrokona) |
| **TOTAL** | **৮ বিভাগ** | **64** | **38** | **Comprehensive coverage across all 8 administrative divisions** |

---

## 🏛️ System Architecture

```text
ExploreBD/
├── backend/                      # Express + TypeScript + Prisma + PostgreSQL
│   ├── ARCHITECTURE_EN.md        # Detailed Backend Architecture (English)
│   ├── ARCHITECTURE_BN.md        # Detailed Backend Architecture (Banglish/Bengali)
│   ├── backups/                  # Database JSON & SQL dumps (Git Ignored)
│   ├── data/pgdata/              # Embedded PostgreSQL cluster (Git Ignored)
│   ├── prisma/
│   │   ├── schema.prisma         # Normalized database models (11 tables)
│   │   └── seed.ts               # Divisions, 64 districts & tourist destinations
│   └── src/
│       ├── controllers/          # Express route controllers
│       ├── middlewares/          # Validation, error handling, security
│       ├── routes/               # REST API route definitions
│       ├── scripts/              # DB server starter & backup scripts
│       ├── services/             # Core business logic layer
│       └── server.ts             # Server entry point
├── frontend/                     # Next.js 15 (App Router) + React 19 + Tailwind CSS
│   ├── ARCHITECTURE_EN.md        # Detailed Frontend Architecture (English)
│   ├── ARCHITECTURE_BN.md        # Detailed Frontend Architecture (Banglish/Bengali)
│   ├── public/                   # Static branding assets (logo.jpg, banner.jpg)
│   └── src/
│       ├── app/                  # Next.js App Router (tracker, districts, places)
│       ├── components/           # UI components (map, cards, modals, layout)
│       ├── lib/                  # ApiClient & TanStack Query Provider
│       └── stores/               # Zustand persistent travel store
└── README.md                     # Platform overview & documentation
```

---

## 🛠️ Technology Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS, TanStack Query v5, Zustand, Lucide React (`lucide-react`), HTML5 Canvas.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, Helmet, CORS, Zod.
- **Database:** PostgreSQL (Zero-dependency embedded cluster on port `5432`).
- **Typography:** `Plus Jakarta Sans` & `Hind Siliguri` via `next/font/google`.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm (v9+)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/srabonmojumder/ExploreBD.git
cd ExploreBD

# Install all monorepo dependencies
npm install
```

### 3. Initialize Database
```bash
# Generate Prisma Client & Push Schema
npm run db:push --workspace=backend

# Seed 8 divisions, 64 districts, and tourist places
npm run seed --workspace=backend
```

### 4. Run Development Servers
```bash
# Starts embedded PostgreSQL, Express API (:5000), and Next.js (:3000)
npm run dev
```

- **Frontend Application:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 💾 Database Backup & Recovery

ExploreBD includes an automated local backup script that creates both a **JSON snapshot** and a full **SQL dump** with `INSERT` statements:

```bash
npm run db:backup --workspace=backend
```

- Backup files are stored in `backend/backups/`.
- All backup files and raw PostgreSQL data directories are **strictly ignored by git** to guarantee privacy and security.

---

## 📖 In-Depth Documentation Files

- [Master Project Walkthrough & Onboarding Guide](file:///c:/Users/user/Documents/project/ExploreBD/PROJECT_WALKTHROUGH.md) ⭐
- [Backend Architecture Guide (English)](file:///c:/Users/user/Documents/project/ExploreBD/backend/ARCHITECTURE_EN.md)
- [Backend Architecture Guide (Banglish/Bengali)](file:///c:/Users/user/Documents/project/ExploreBD/backend/ARCHITECTURE_BN.md)
- [Frontend Architecture Guide (English)](file:///c:/Users/user/Documents/project/ExploreBD/frontend/ARCHITECTURE_EN.md)
- [Frontend Architecture Guide (Banglish/Bengali)](file:///c:/Users/user/Documents/project/ExploreBD/frontend/ARCHITECTURE_BN.md)

---

## 👨‍💻 Creator & Developer

Made with ❤️ by **Srabon Mozumder**
- **Facebook:** [https://www.facebook.com/sraabonmozumder](https://www.facebook.com/sraabonmozumder)
- **WhatsApp:** `+8801827621312`
