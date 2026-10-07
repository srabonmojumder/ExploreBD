# 🧭 ExploreBD — মাস্টার প্রজেক্ট ওয়াকথ্রু ও কমপ্লিট ইঞ্জিনিয়ারিং গাইড (Project Walkthrough)

> **নতুন ডেভেলপারদের জন্য সম্পূর্ণ গাইড:** এই ডকুমেন্টটি পড়লে যে কেউ মাত্র ১০ মিনিটের মধ্যে বুঝতে পারবে ExploreBD প্রজেক্টটি কী নিয়ে তৈরি, কোথায় কোন ফাইল আছে, ফ্রন্টএন্ড ও ব্যাকএন্ড কীভাবে পরস্পরের সাথে কাজ করছে এবং নতুন ফিচার কীভাবে যোগ করতে হবে।

---

## ১. প্রজেক্ট পরিচিতি ও উদ্দেশ্য (Project Vision)
**ExploreBD** হলো বাংলাদেশের প্রথম ফুল-স্ট্যাক, গ্যামিফাইড সোশ্যাল ট্রাভেল ট্র্যাকিং প্ল্যাটফর্ম।
- সাধারণ ট্রাভেল ব্লগে শুধু আর্টিকেল পড়া যায়, কিন্তু ExploreBD-তে একজন ভ্রমণপিপাসু ব্যক্তি তার **ব্যক্তিগত ভ্রমণ খতিয়ান** তৈরি করতে পারে।
- **৮টি প্রশাসনিক বিভাগ** ও **৬৪টি জেলার** মধ্যে সে কত শতাংশ ঘুরেছে তা লাইভ ভেক্টর ম্যাপে চিহ্নিত হয়।
- প্রতিটি পর্যটন স্পটে (ঝর্ণা, বিচ, পার্ক, পাহাড়) সে **কত বার গিয়েছে** (মাল্টি-ভিজিট কাউন্টার) তা ট্র্যাক করতে পারে।
- নিজের নাম ও ভ্রমণ অর্জনের ব্যাজ সহ ইনস্টাগ্রাম/ফেসবুকে শেয়ার উপযোগী **হাই-রেজোলিউশন (1080×1350) পিএনজি কার্ড** এক ক্লিকে ডাউনলোড করতে পারে।

---

## ২. সিস্টেম আর্কিটেকচার ও ডাটা ফ্লো (Architecture Flow)

```text
[ Browser / User ]
       │
       ▼
[ Next.js 15 App Router Frontend (:3000) ]
       │
       ├──► Zustand Store (useTravelStore) ──► Browser LocalStorage (০ms ল্যাটেন্সিতে ভিজিট সেভ)
       │
       └──► TanStack Query v5 (ইন-মেমোরি ক্যাশ: ৫ মিনিট)
                 │  (HTTP GET /api/districts, /api/places)
                 ▼
[ Express + TypeScript Backend API (:5000) ]
       │
       ├──► Security & CORS (Helmet, CookieParser)
       ├──► Controllers & Services (Business Logic)
       └──► Prisma ORM
                 │  (Port 5432, 1ms Latency)
                 ▼
[ Embedded PostgreSQL Cluster (backend/data/pgdata) ]
```

### ডাটা কীভাবে কাজ করে:
1. **পাবলিক ডেটা (বিভাগ, জেলা, স্পট):** ব্যাকএন্ডের PostgreSQL ডেটাবেজ থেকে প্রিজমার মাধ্যমে আসে। এটি ট্যানস্ট্যাক কুয়েরির মাধ্যমে ৫ মিনিট মেমরিতে ক্যাশ থাকে, তাই পেজ বদলালে বারবার লোডিং হয় না।
2. **ব্যক্তিগত ভ্রমণ ডেটা (কোন স্পটে ৩ বার গিয়েছি, কোন জেলা ঘুরেছি):** ফ্রন্টএন্ডের Zustand স্টোরের মাধ্যমে ইউজারের ব্রাউজারের `localStorage`-এ সুরক্ষিত থাকে। তাই কোনো পাসওয়ার্ড বা সার্ভার সাইন-ইন ছাড়াও ইউজার আজীবন তার ট্র্যাকিং হিস্টোরি দেখতে পায়।

---

## ৩. ডিরেক্টরি স্ট্রাকচার ও কোথায় কী আছে (Where Everything Lives)

```text
ExploreBD/
├── package.json                   # পুরো প্রজেক্টের মনোরেপো ওয়ার্কস্পেস কনফিগারেশন
├── README.md                      # প্রজেক্ট পরিচিতি ও সেটআপ গাইড
├── PROJECT_WALKTHROUGH.md         # এই কমপ্লিট মাস্টার গাইড
├── .gitignore                     # গিট ইগনোর রুলস (ডেটাবেজ ও ব্যাকআপ ফাইল সুরক্ষিত রাখে)
│
├── backend/                       # ব্যাকএন্ড সার্ভার (Express + Prisma + PostgreSQL)
│   ├── ARCHITECTURE_EN.md         # ব্যাকএন্ড আর্কিটেকচার বিস্তারিত (English)
│   ├── ARCHITECTURE_BN.md         # ব্যাকএন্ড আর্কিটেকচার বিস্তারিত (Banglish/বাংলা)
│   ├── package.json               # ব্যাকএন্ডের ডিপেন্ডেন্সি ও স্ক্রিপ্টসমূহ
│   ├── tsconfig.json              # ব্যাকএন্ড টাইপস্ক্রিপ্ট কনফিগ
│   ├── backups/                   # ডেটাবেজের JSON ও SQL অটোমেটিক ব্যাকআপ (Git Ignored)
│   ├── data/pgdata/               # লোকাল PostgreSQL ক্লাস্টার ডেটাবেজ ফাইল (Git Ignored)
│   │
│   ├── prisma/
│   │   ├── schema.prisma          # ১১টি ডেটাবেজ মডেল (Division, District, Place, User...)
│   │   └── seed.ts                # ৬৪ জেলা, ৮ বিভাগ ও ৩৮টি জনপ্রিয় স্পটের সিড ডেটা
│   │
│   └── src/
│       ├── config/                # পোর্ট, এনভায়রনমেন্ট ভেরিয়েবল কনফিগ
│       ├── controllers/           # রিকোয়েস্ট হ্যান্ডলার (district, division, place, health)
│       ├── services/              # বিজনেস লজিক লেয়ার (ডাটাবেজ কুয়েরি প্রসেসিং)
│       ├── repositories/          # প্রিজমা ক্লায়েন্ট সিঙ্গলটন (Prisma Instance)
│       ├── routes/                # এপিআই রুটস ডেফিনিশন (/api/districts, /api/places...)
│       ├── middlewares/           # এরর হ্যান্ডলার, ভ্যালিডেশন
│       ├── utils/                 # ApiResponse ও স্ট্যান্ডার্ড রেসপন্স ফরম্যাটার
│       ├── scripts/
│       │   ├── start-pg-server.ts # লোকাল পোর্ট ৫৪৩২-এ PostgreSQL চালু করার অটোমেটিক স্ক্রিপ্ট
│       │   ├── backup-database.ts # ডেটাবেজ JSON ও SQL ব্যাকআপ এক্সপোর্টার
│       │   └── dump-stats.ts      # ৮ বিভাগ ও ৬৪ জেলার স্পট কাউন্ট প্রিন্টার
│       ├── app.ts                 # এক্সপ্রেস অ্যাপ ইনিশিয়ালাইজেশন ও মিডলওয়্যার
│       └── server.ts              # সার্ভার বুটস্ট্র্যাপ (পোর্ট ৫০০০)
│
└── frontend/                      # ফ্রন্টএন্ড ওয়েব অ্যাপ (Next.js 15 + Tailwind CSS)
    ├── ARCHITECTURE_EN.md         # ফ্রন্টএন্ড আর্কিটেকচার বিস্তারিত (English)
    ├── ARCHITECTURE_BN.md         # ফ্রন্টএন্ড আর্কিটেকচার বিস্তারিত (Banglish/বাংলা)
    ├── package.json               # ফ্রন্টএন্ডের ডিপেন্ডেন্সি (Next 15, Lucide, Manchitro)
    ├── next.config.ts             # নেক্সট.জেএস অপ্টিমাইজেশন ও ইমেজ কনফিগ
    ├── tailwind.config.ts         # কাস্টম এমারেল্ড, টিল কালার প্যালেট ও ফন্ট
    ├── public/                    # স্ট্যাটিক ব্র্যান্ড এসেট (logo.jpg, banner.jpg)
    │
    └── src/
        ├── app/                   # নেক্সট.জেএস ১৫ অ্যাপ রাউটার পেজসমূহ
        │   ├── layout.tsx         # গ্লোবাল লেআউট (Navbar, Footer, Font Optimization)
        │   ├── globals.css        # ডার্ক মোড ও গ্লাস-মরফিজম সিএসএস স্টাইল
        │   ├── not-found.tsx      # ৪০৪ রেসপনসিভ এরর পেজ
        │   ├── page.tsx           # হোম পেজ (হিরো ব্যানার, বিভাগ ম্যাগাজিন কার্ড, ট্রেন্ডিং স্পট)
        │   ├── tracker/
        │   │   └── page.tsx       # ভ্রমণ ট্র্যাকার (ইন্টারেক্টিভ ম্যাপ ও ৬৪ জেলা গ্রিড)
        │   ├── districts/
        │   │   ├── page.tsx       # ৬৪ জেলা এক্সপ্লোরার ও বিভাগ ফিল্টারিং
        │   │   └── [slug]/page.tsx# নির্দিষ্ট জেলার স্পট লিস্ট ও জেলা প্রগ্রেস ট্র্যাকার
        │   └── places/
        │       ├── page.tsx       # ক্যাটাগরি অনুযায়ী দর্শনীয় স্থান তালিকা
        │       └── [slug]/page.tsx# দর্শনীয় স্থানের ডিটেইলস, গ্যালারি ও মাল্টি-ভিজিট কাউন্টার
        │
        ├── components/
        │   ├── layout/            # Navbar.tsx (লাইভ জেলা কাউন্ট ব্যাজ), Footer.tsx (ক্রেডিট)
        │   ├── map/               # BangladeshInteractiveMap.tsx, NationalMapShareModal.tsx
        │   ├── districts/         # DistrictCard.tsx, DistrictSpotTrackerCard.tsx, DistrictShareCardModal.tsx
        │   ├── places/            # PlaceCard.tsx, CategoryBadge.tsx
        │   ├── home/              # DivisionPreview.tsx, ApiStatusCard.tsx
        │   └── shared/            # SearchInput.tsx (Debounced Search)
        │
        ├── lib/
        │   ├── api-client.ts      # ব্যাকএন্ড এপিআই কল করার টাইপ-সেফ ফেচার
        │   └── query-provider.tsx # ট্যানস্ট্যাক কুয়েরি প্রোভাইডার (৫ মিনিট ক্যাশ সেটিংস)
        │
        ├── stores/
        │   ├── useTravelStore.ts  # Zustand লোকাল ট্রাভেল স্টোর (ভিজিট কাউন্ট, জেলা হিস্টোরি)
        │   └── useAppStore.ts     # গ্লোবাল ইউআই স্টোর (মোবাইল ড্রয়ার টগল)
        │
        └── hooks/
            └── useMounted.ts      # ক্লায়েন্ট সাইড হাইড্রেশন মিসম্যাচ প্রতিরোধক হুক
```

---

## ৪. প্রজেক্টের প্রধান ফিচারগুলো কীভাবে কাজ করে (Feature Mechanics)

### ১. ইন্টারেক্টিভ বাংলাদেশ মানচিত্র (Interactive Map)
- **কোড ফাইল:** `frontend/src/components/map/BangladeshInteractiveMap.tsx`
- **লাইব্রেরি:** `manchitro` (বাংলাদেশের ৬৪ জেলার অফিসিয়াল এসভিজি ভেক্টর ম্যাপিং)।
- **কীভাবে কাজ করে:** ইউজার কোনো জেলায় ক্লিক করলে `useTravelStore`-এর `toggleDistrictVisit(districtSlug)` ফাংশন ট্রিগার হয়। জেলাটি সাথে সাথে সবুজ রঙে রেন্ডার হয় এবং স্ক্রিনের ওপরে ন্যাশনাল ট্রাভেল পার্সেন্টেজ হিসাব করে দেখায় (যেমন: `৪/৬৪ জেলা • ৬% সম্পন্ন`)।

### ২. সোশ্যাল মিডিয়া শেয়ার কার্ড জেনারেটর (Social Share Cards)
- **কোড ফাইল:**
  - `frontend/src/components/map/NationalMapShareModal.tsx` (ন্যাশনাল ম্যাপ শেয়ার কার্ড)
  - `frontend/src/components/districts/DistrictShareCardModal.tsx` (জেলা শেয়ার কার্ড)
- **কীভাবে কাজ করে:** HTML5 Canvas দিয়ে সম্পূর্ণ ক্লায়েন্ট-সাইডে একটি প্রিমিয়াম **1080×1350 পিক্সেল** কার্ড জেনারেট হয়। এতে ইউজারের দেওয়া নাম, কতটি জেলা ঘুরেছে, লেভেল ব্যাজ (🌱 নবাগত, 🥈 পরিব্রাজক, 🥇 বিশেষজ্ঞ) এবং এক্সপ্লোরবিডি লোগো সহ হাই-কোয়ালিটি PNG ইমেজ এক ক্লিকে ডাউনলোড হয়ে যায়।

### ৩. স্পট অনুযায়ী মাল্টি-ভিজিট কাউন্টার (Multi-Visit Logging)
- **কোড ফাইল:** `frontend/src/components/districts/DistrictSpotTrackerCard.tsx`
- **কীভাবে কাজ করে:** সাধারণ সাইটে স্পট দেখা যায়, কিন্তু এখানে ইউজার "+" বাটনে ক্লিক করে বলতে পারে সে সাজেকে ২ বার, কক্সবাজারে ৫ বার গিয়েছে। এটি লোকালস্টোরেজে সেভ হয়ে থাকে।

### ৪. ব্যাকএন্ড অটোমেটিক ডেটাবেজ সার্ভার
- **কোড ফাইল:** `backend/src/scripts/start-pg-server.ts`
- **কীভাবে কাজ করে:** কম্পিউটারে আলাদা PostgreSQL ইনস্টল বা ক্লাউড সংযোগের প্রয়োজন নেই। `npm run dev` দিলেই লোকাল `embedded-postgres` ইঞ্জিন `5432` পোর্টে ক্লাস্টার চালু করে `explorebd` ডেটাবেজ বানিয়ে নেয়।

---

## ৫. নতুন ডেভেলপারের জন্য কুইক-স্টার্ট গাইড (Developer How-To)

### প্রজেক্ট চালানো:
```bash
# ১. ডিপেন্ডেন্সি ইনস্টল (রুট ফোল্ডারে)
npm install

# ২. সার্ভার ও ফ্রন্টএন্ড একসাথে চালু করা
npm run dev
```
- **ফ্রন্টএন্ড:** [http://localhost:3000](http://localhost:3000)
- **ব্যাকএন্ড এপিআই:** [http://localhost:5000](http://localhost:5000)
- **হেলথ চেক:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### নতুন স্পট বা জেলা ডেটাবেজে যুক্ত করতে চাইলে:
১. `backend/prisma/seed.ts` ফাইলটি খুলুন।  
২. `PLACES` অ্যারেতে নতুন স্পটের নাম, বিবরণ, ক্যাটাগরি, জিপিএস এবং ছবির লিংক যোগ করুন:
```typescript
{
  name: 'New Spot Name',
  bnName: 'নতুন স্পটের বাংলা নাম',
  slug: 'new-spot-name',
  districtSlug: 'coxs-bazar', // যে জেলার সাথে যুক্ত
  divisionSlug: 'chattogram',
  category: 'BEACH',
  latitude: 21.4272,
  longitude: 91.9702,
  coverImage: 'https://...',
  averageRating: 4.8,
  totalVisitors: 5000,
  gallery: [],
}
```
৩. টার্মিনালে রান করুন:
```bash
npm run seed --workspace=backend
```

### ডেটাবেজের ব্যাকআপ নিতে চাইলে:
```bash
npm run db:backup --workspace=backend
```
- এটি স্বয়ংক্রিয়ভাবে `backend/backups/`-এ নতুন JSON ও SQL ব্যাকআপ ফাইল সেভ করবে যা গিট-ইগনোরড।

---

## ৬. কোড ও কমিট নিয়মাবলী (Coding Guidelines)
1. **আইকন:** সবসময় `lucide-react` ব্যবহার করবেন। কোনো ব্রোকেন বা অসংলগ্ন আইকন ব্যবহার করবেন না।
2. **ইমেজ ফলব্যাক:** যে কোনো নতুন ইমেজ কম্পোনেন্টে `onError={() => setImgSrc('/banner.jpg')}` হ্যান্ডলার ব্যবহার করবেন যাতে লিংক নষ্ট হলেও ব্রোকেন ইমেজ না দেখায়।
3. **কমিট স্টাইল:** ইউজারের নির্দেশনা অনুযায়ী কমিটে কোনো `feat:` বা `fix:` প্রিফিক্স ব্যবহার করবেন না; সাধারণ প্রফেশনাল ডেভেলপার সেন্টেন্সে কমিট করবেন (যেমন: `update district spot details and responsive styles`)।

---
Crafted with pride by **Srabon Mozumder** | **ExploreBD Platform** 🇧🇩
