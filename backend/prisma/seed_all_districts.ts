import { PrismaClient, PlaceCategory } from '@prisma/client';

const prisma = new PrismaClient();

interface PlaceSeed {
  name: string;
  bnName: string;
  slug: string;
  description: string;
  districtSlug: string;
  divisionSlug: string;
  latitude: number;
  longitude: number;
  coverImage: string;
  category: PlaceCategory;
  averageRating: number;
  totalVisitors: number;
  gallery: string[];
}

const NEW_PLACES: PlaceSeed[] = [
  // --- DHAKA & SAVAR ---
  {
    name: 'Dhaka University & Curzon Hall',
    bnName: 'ঢাকা বিশ্ববিদ্যালয় ও কার্জন হল',
    slug: 'dhaka-university-curzon-hall',
    description: 'The historic intellectual heart of Bangladesh established in 1921, famed for the magnificent red-brick Indo-Saracenic Curzon Hall, Aparajeyo Bangla, Central Shaheed Minar, and lively TSC adda.',
    districtSlug: 'dhaka',
    divisionSlug: 'dhaka',
    latitude: 23.7262,
    longitude: 90.4011,
    coverImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HISTORICAL,
    averageRating: 4.9,
    totalVisitors: 12500,
    gallery: [
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Jagannath University & Bahadur Shah Park',
    bnName: 'জগন্নাথ বিশ্ববিদ্যালয় ও বাহাদুর শাহ পার্ক',
    slug: 'jagannath-university-bahadur-shah-park',
    description: 'Renowned historic public university and Victorian memorial square in Old Dhaka commemorating the 1857 anti-British sepoy mutiny martyrs, nestled in the traditional heritage and culinary trails of Sadarghat.',
    districtSlug: 'dhaka',
    divisionSlug: 'dhaka',
    latitude: 23.7088,
    longitude: 90.4116,
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HISTORICAL,
    averageRating: 4.7,
    totalVisitors: 8900,
    gallery: [
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: "National Martyrs' Memorial (Savar)",
    bnName: 'জাতীয় স্মৃতিসৌধ (সাভার)',
    slug: 'national-martyrs-memorial-savar',
    description: 'The monumental 150-foot national symbol of Bangladesh freedom in Savar, composed of seven pairs of triangular wall prisms standing amidst serene artificial reflection lakes, mass graves, and landscaped botanical gardens.',
    districtSlug: 'dhaka',
    divisionSlug: 'dhaka',
    latitude: 23.9118,
    longitude: 90.2543,
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HISTORICAL,
    averageRating: 4.9,
    totalVisitors: 14200,
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Jahangirnagar University & Bird Sanctuaries',
    bnName: 'জাহাঙ্গীরনগর বিশ্ববিদ্যালয় ও অতিথি পাখির লেক',
    slug: 'jahangirnagar-university-savar',
    description: 'Bangladesh premier fully residential green university in Savar, famed for sprawling red-soil biodiversity campuses and freshwater lakes carpeted in pink water lilies where tens of thousands of migratory birds flock every winter.',
    districtSlug: 'dhaka',
    divisionSlug: 'dhaka',
    latitude: 23.8821,
    longitude: 90.2671,
    coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.LAKE,
    averageRating: 4.8,
    totalVisitors: 11000,
    gallery: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // --- GAZIPUR ---
  {
    name: 'Bhawal National Park',
    bnName: 'ভাওয়াল জাতীয় উদ্যান',
    slug: 'bhawal-national-park',
    description: 'Expansive 940-hectare Shal forest national park situated in Gazipur with scenic canopy walkways, tranquil lakes, row boating, and lush green wilderness picnic retreats.',
    districtSlug: 'gazipur',
    divisionSlug: 'dhaka',
    latitude: 24.0152,
    longitude: 90.4132,
    coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.FOREST,
    averageRating: 4.6,
    totalVisitors: 9400,
    gallery: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Bangabandhu Sheikh Mujib Safari Park',
    bnName: 'বঙ্গবন্ধু সাফারি পার্ক (গাজীপুর)',
    slug: 'bangabandhu-safari-park-gazipur',
    description: 'The largest open-range wildlife safari park in Bangladesh located in Sreepur, Gazipur. Offers protected AC bus safari drives through free-roaming zones of Royal Bengal tigers, lions, elephants, zebras, and giraffes.',
    districtSlug: 'gazipur',
    divisionSlug: 'dhaka',
    latitude: 24.1824,
    longitude: 90.4285,
    coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.ADVENTURE,
    averageRating: 4.8,
    totalVisitors: 13200,
    gallery: [
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Nuhash Polli',
    bnName: 'নুহাশ পল্লী (গাজীপুর)',
    slug: 'nuhash-polli-gazipur',
    description: 'Beloved 40-acre serene creative retreat of legendary writer & filmmaker Humayun Ahmed in Gazipur, featuring lush medicinal groves, tree houses, whimsical sculptures, and tranquil padma pukur.',
    districtSlug: 'gazipur',
    divisionSlug: 'dhaka',
    latitude: 24.1167,
    longitude: 90.4833,
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.PARK,
    averageRating: 4.7,
    totalVisitors: 8700,
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // --- NARAYANGANJ ---
  {
    name: 'Panam Nagar (The Lost City)',
    bnName: 'পানাম নগর ও সোনারগাঁও',
    slug: 'panam-nagar-sonargaon',
    description: 'Atmospheric 19th-century merchant ghost city of Bengal and Zainul Abedin Folk Art Museum surrounded by ancient terracotta mansions, reflecting canals, and lush gardens.',
    districtSlug: 'narayanganj',
    divisionSlug: 'dhaka',
    latitude: 23.6492,
    longitude: 90.6015,
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HISTORICAL,
    averageRating: 4.8,
    totalVisitors: 11500,
    gallery: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // --- TANGAIL ---
  {
    name: 'Mohera Zamindar Bari',
    bnName: 'মহেরা জমিদার বাড়ি',
    slug: 'mohera-zamindar-bari-tangail',
    description: 'Magnificent late 19th-century royal zamindar estate in Mirzapur Tangail, featuring grand Greco-Roman colonnades, royal palaces, ornate flower gardens, and Paschim Bari museum.',
    districtSlug: 'tangail',
    divisionSlug: 'dhaka',
    latitude: 24.1678,
    longitude: 90.0272,
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HISTORICAL,
    averageRating: 4.8,
    totalVisitors: 7600,
    gallery: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // --- NARSINGDI ---
  {
    name: 'Wari-Bateshwar Ancient City',
    bnName: 'ওয়ারী-বটেশ্বর প্রাচীন দুর্গনগরী',
    slug: 'wari-bateshwar-narsingdi',
    description: 'Legendary 2500-year-old archaeological wonder of ancient Gangaridai civilization, featuring silver punch-marked coins, pit dwellings, and fortified silk route trade settlements.',
    districtSlug: 'narsingdi',
    divisionSlug: 'dhaka',
    latitude: 24.0886,
    longitude: 90.8415,
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HISTORICAL,
    averageRating: 4.7,
    totalVisitors: 5400,
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // --- MUNSHIGANJ ---
  {
    name: 'Idrakpur Fort',
    bnName: 'ইদ্রাকপুর কেল্লা (মুন্সীগঞ্জ)',
    slug: 'idrakpur-fort-munshiganj',
    description: 'Historic 1660 AD water fort built by Mughal Subahdar Mir Jumla to defend Dhaka from Portuguese and Magh river pirate invasions, overlooking dry riverbeds.',
    districtSlug: 'munshiganj',
    divisionSlug: 'dhaka',
    latitude: 23.5422,
    longitude: 90.5305,
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HISTORICAL,
    averageRating: 4.6,
    totalVisitors: 4800,
    gallery: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // --- MANIKGANJ ---
  {
    name: 'Baliati Palace',
    bnName: 'বালিয়াটি প্রাসাদ (মানিকগঞ্জ)',
    slug: 'baliati-palace-manikganj',
    description: 'One of the grandest 19th-century zamindar palaces in Bangladesh situated in Saturia, spanning 7 ornate buildings with massive classical Ionic pillars and reflecting ponds.',
    districtSlug: 'manikganj',
    divisionSlug: 'dhaka',
    latitude: 23.9928,
    longitude: 90.0381,
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HISTORICAL,
    averageRating: 4.8,
    totalVisitors: 7100,
    gallery: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // --- KISHOREGANJ ---
  {
    name: 'Nikli Haor Waterscape',
    bnName: 'নিকলী হাওর (কিশোরগঞ্জ)',
    slug: 'nikli-haor-kishoreganj',
    description: 'Immense freshwater sea expanse in Kishoreganj where submerged roads, floating fishing villages, and boat journeys create breathtaking sunset horizons.',
    districtSlug: 'kishoreganj',
    divisionSlug: 'dhaka',
    latitude: 24.3167,
    longitude: 90.9333,
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.LAKE,
    averageRating: 4.8,
    totalVisitors: 9800,
    gallery: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // --- FARIDPUR ---
  {
    name: 'Polli Kobi Jasimuddin Residence',
    bnName: 'পল্লীকবি জসীমউদ্দীনের বাড়ি (ফরিদপুর)',
    slug: 'jasimuddin-residence-faridpur',
    description: 'Idyllic riverside homestead of beloved Bengali folk poet Jasimuddin in Ambikapur, showcasing his classic manuscript room, personal belongings, and rural mango groves.',
    districtSlug: 'faridpur',
    divisionSlug: 'dhaka',
    latitude: 23.6071,
    longitude: 89.8429,
    coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HISTORICAL,
    averageRating: 4.6,
    totalVisitors: 4500,
    gallery: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // --- GOPALGANJ ---
  {
    name: 'Bangabandhu Mausoleum Complex (Tungipara)',
    bnName: 'বঙ্গবন্ধু সমাধি সৌধ কমপ্লেক্স (টুঙ্গিপাড়া)',
    slug: 'bangabandhu-mausoleum-tungipara',
    description: 'National historical pilgrimage site in Tungipara with white marble domes, memorial libraries, reflection canals, and landscaped parklands overlooking Madhumati delta.',
    districtSlug: 'gopalganj',
    divisionSlug: 'dhaka',
    latitude: 22.9008,
    longitude: 89.9000,
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HISTORICAL,
    averageRating: 4.9,
    totalVisitors: 15000,
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // --- CUMILLA ---
  {
    name: 'Shalban Vihara & Mainamati',
    bnName: 'শালবন বিহার ও ময়নামতি',
    slug: 'shalban-vihara-cumilla',
    description: 'Ancient 8th-century Buddhist monastic city and archaeological excavation site in Mainamati Lalmai hills, containing 115 monastic cells, central stupas, and royal copperplates.',
    districtSlug: 'cumilla',
    divisionSlug: 'chattogram',
    latitude: 23.4244,
    longitude: 91.1344,
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HISTORICAL,
    averageRating: 4.8,
    totalVisitors: 8900,
    gallery: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // --- KHAGRACHHARI ---
  {
    name: 'Sajek Valley & Alutila Cave',
    bnName: 'সাজেক ভ্যালি ও আলুটিলা গুহা',
    slug: 'sajek-valley-alutila-khagrachhari',
    description: 'Crown jewel of hill tourism where fluffy white clouds roll through emerald mountain peaks, alongside the mysterious dark stone tunnels of Alutila cave and Risang waterfall.',
    districtSlug: 'khagrachhari',
    divisionSlug: 'chattogram',
    latitude: 23.3824,
    longitude: 92.2938,
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HILL,
    averageRating: 4.9,
    totalVisitors: 21000,
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // --- COX'S BAZAR ---
  {
    name: "Saint Martin's Coral Island",
    bnName: 'সেন্ট মার্টিন্স প্রবাল দ্বীপ',
    slug: 'saint-martins-island',
    description: 'The sole coral island of Bangladesh situated in the deep blue waters of the Bay of Bengal, famous for coconut groves, Chera Dwip coral reef, and fresh seafood barbecue.',
    districtSlug: 'coxs-bazar',
    divisionSlug: 'chattogram',
    latitude: 20.6272,
    longitude: 92.3225,
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.BEACH,
    averageRating: 4.9,
    totalVisitors: 19500,
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // --- BOGURA ---
  {
    name: 'Mahasthangarh Ancient Citadel',
    bnName: 'মহাস্থানগড় ও বেহুলার বাসর ঘর',
    slug: 'mahasthangarh-bogura',
    description: 'Oldest fortified urban archaeological site in Bangladesh dating back to the 3rd century BC on the Karatoya River, famous for the citadel walls, Gokul Medh, and museum.',
    districtSlug: 'bogura',
    divisionSlug: 'rajshahi',
    latitude: 24.9614,
    longitude: 89.3458,
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HISTORICAL,
    averageRating: 4.8,
    totalVisitors: 10400,
    gallery: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // --- RAJSHAHI ---
  {
    name: 'Puthia Temple Complex & Rajbari',
    bnName: 'পুঠিয়া রাজবাড়ি ও শিব মন্দির',
    slug: 'puthia-temple-complex-rajshahi',
    description: 'Unrivalled historic village featuring the largest concentration of historic terracotta Hindu temples in Bangladesh, including the magnificent Pancharatna Govinda Temple.',
    districtSlug: 'rajshahi',
    divisionSlug: 'rajshahi',
    latitude: 24.3686,
    longitude: 88.8358,
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HISTORICAL,
    averageRating: 4.8,
    totalVisitors: 8600,
    gallery: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // --- PABNA ---
  {
    name: 'Hardinge Bridge & Paksey Resort',
    bnName: 'হার্ডিঞ্জ ব্রিজ ও পাকশী',
    slug: 'hardinge-bridge-pabna',
    description: 'Iconic century-old steel truss railway bridge over the mighty Padma River built in 1912, alongside the twin Lalon Shah Bridge with beautiful riverside picnic lookouts.',
    districtSlug: 'pabna',
    divisionSlug: 'rajshahi',
    latitude: 24.0683,
    longitude: 89.0289,
    coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HISTORICAL,
    averageRating: 4.7,
    totalVisitors: 7800,
    gallery: [
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // --- KUSHTIA ---
  {
    name: 'Lalon Shah Mazar & Shilaidaha Kuthibari',
    bnName: 'লালন শাহ মাজার ও শিলাইদহ রবীন্দ্র কুঠিবাড়ি',
    slug: 'lalon-shah-shilaidaha-kushtia',
    description: 'Spiritual haven of mystical Baul philosophy in Chheuriya and Nobel laureate Rabindranath Tagore three-story country mansion where he penned Gitanjali.',
    districtSlug: 'kushtia',
    divisionSlug: 'khulna',
    latitude: 23.8833,
    longitude: 89.1333,
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HISTORICAL,
    averageRating: 4.9,
    totalVisitors: 16000,
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // --- BARISHAL & JHALOKATHI ---
  {
    name: 'Bhimruli Floating Guava Market',
    bnName: 'ভিমরুলী ভাসমান পেয়ারা বাজার',
    slug: 'bhimruli-floating-guava-market',
    description: 'The Venice of the East—century-old waterway trade canals where hundreds of wooden dinghy boats trade emerald-green fresh guavas in a picturesque canal maze.',
    districtSlug: 'jhalokathi',
    divisionSlug: 'barishal',
    latitude: 22.6583,
    longitude: 90.1583,
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.RIVER,
    averageRating: 4.8,
    totalVisitors: 9200,
    gallery: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Guthiya Mosque & Durga Sagar',
    bnName: 'বায়তুল আমান গুঠিয়া মসজিদ ও দুর্গা সাগর',
    slug: 'guthiya-mosque-durga-sagar-barishal',
    description: 'Breathtaking 20-dome modern Islamic architectural marvel adorned with marble in Barishal, paired with the historic 45-acre royal Durga Sagar bird lake.',
    districtSlug: 'barishal',
    divisionSlug: 'barishal',
    latitude: 22.7500,
    longitude: 90.2500,
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.RELIGIOUS,
    averageRating: 4.9,
    totalVisitors: 11400,
    gallery: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // --- RANGPUR & PANCHAGARH ---
  {
    name: 'Tajhat Palace (Rangpur)',
    bnName: 'তাজহাট রাজবাড়ি (রংপুর)',
    slug: 'tajhat-palace-rangpur',
    description: 'One of the most regal 20th-century white-columned royal palaces in North Bengal, featuring Italian marble staircases, classical Greek facades, and museum exhibits.',
    districtSlug: 'rangpur',
    divisionSlug: 'rangpur',
    latitude: 25.7208,
    longitude: 89.2789,
    coverImage: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.MUSEUM,
    averageRating: 4.8,
    totalVisitors: 8700,
    gallery: [
      'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Tetulia Kanchenjunga View & Tea Estates',
    bnName: 'তেঁতুলিয়া কাঞ্চনজঙ্ঘা ভিউ ও সমতল চা বাগান',
    slug: 'tetulia-kanchenjunga-panchagarh',
    description: 'Northernmost frontier of Bangladesh on the Mahananda river where the snow-capped Himalayan peaks of Kanchenjunga gleam in the sky above emerald flat-land tea gardens.',
    districtSlug: 'panchagarh',
    divisionSlug: 'rangpur',
    latitude: 26.4950,
    longitude: 88.3542,
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HILL,
    averageRating: 4.9,
    totalVisitors: 14000,
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // --- MYMENSINGH & NETROKONA ---
  {
    name: 'Shoshi Lodge & BAU Botanical Garden',
    bnName: 'শশী লজ ও বাকৃবি বোটানিক্যাল গার্ডেন',
    slug: 'shoshi-lodge-bau-mymensingh',
    description: 'Charming 19th-century royal palace of Maharaja Suryakanta Acharya with a marble statue of Venus, beside the lush Old Brahmaputra riverbank botanical university gardens.',
    districtSlug: 'mymensingh',
    divisionSlug: 'mymensingh',
    latitude: 24.7578,
    longitude: 90.4072,
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HISTORICAL,
    averageRating: 4.7,
    totalVisitors: 6900,
    gallery: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

async function main() {
  console.log('🔄 Updating Dhaka district & division cover images...');
  
  // Update Dhaka division and district to guaranteed working images
  await prisma.division.updateMany({
    where: { slug: 'dhaka' },
    data: {
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    },
  });

  await prisma.district.updateMany({
    where: { slug: 'dhaka' },
    data: {
      coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    },
  });

  console.log('🚀 Seeding famous tourist spots across Dhaka, Savar, Gazipur and all divisions...');

  for (const place of NEW_PLACES) {
    const district = await prisma.district.findUnique({
      where: { slug: place.districtSlug },
    });
    const division = await prisma.division.findUnique({
      where: { slug: place.divisionSlug },
    });

    if (!district || !division) {
      console.warn(`⚠️ Skipping ${place.name}: District or Division not found (${place.districtSlug})`);
      continue;
    }

    const record = await prisma.place.upsert({
      where: { slug: place.slug },
      update: {
        name: place.name,
        bnName: place.bnName,
        description: place.description,
        districtId: district.id,
        divisionId: division.id,
        latitude: place.latitude,
        longitude: place.longitude,
        coverImage: place.coverImage,
        category: place.category,
        averageRating: place.averageRating,
        totalVisitors: place.totalVisitors,
      },
      create: {
        name: place.name,
        bnName: place.bnName,
        slug: place.slug,
        description: place.description,
        districtId: district.id,
        divisionId: division.id,
        latitude: place.latitude,
        longitude: place.longitude,
        coverImage: place.coverImage,
        category: place.category,
        averageRating: place.averageRating,
        totalVisitors: place.totalVisitors,
      },
    });

    // Gallery images
    for (const imgUrl of place.gallery) {
      const existing = await prisma.placeImage.findFirst({
        where: { placeId: record.id, url: imgUrl },
      });
      if (!existing) {
        await prisma.placeImage.create({
          data: {
            placeId: record.id,
            url: imgUrl,
            caption: `${place.name} Gallery View`,
            isCover: imgUrl === place.coverImage,
          },
        });
      }
    }

    console.log(`✅ [${district.name}] Added/Updated: ${place.bnName || place.name}`);
  }

  const finalPlaceCount = await prisma.place.count();
  console.log(`🎉 Total Places in Database now: ${finalPlaceCount}`);
}

main()
  .catch((err) => {
    console.error('❌ Failed to seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
