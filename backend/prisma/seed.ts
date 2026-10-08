import { PrismaClient, PlaceCategory } from '@prisma/client';

const prisma = new PrismaClient();

interface DivisionData {
  name: string;
  bnName: string;
  slug: string;
  code: string;
  description: string;
  image: string;
}

interface DistrictData {
  name: string;
  bnName: string;
  slug: string;
  divisionSlug: string;
  description: string;
  coverImage: string;
  latitude: number;
  longitude: number;
}

interface PlaceData {
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

const DIVISIONS: DivisionData[] = [
  {
    name: 'Chattogram',
    bnName: 'চট্টগ্রাম',
    slug: 'chattogram',
    code: 'CTG',
    description: 'The port city and maritime gateway of Bangladesh, famed for long sea beaches, lush hill tracts, waterfalls, and coral islands.',
    image: 'https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Sylhet',
    bnName: 'সিলেট',
    slug: 'sylhet',
    code: 'SYL',
    description: 'The land of two leaves and a bud, home to cascading waterfalls, freshwater swamp forests, crystal stone streams, and expansive wetlands.',
    image: 'https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Dhaka',
    bnName: 'ঢাকা',
    slug: 'dhaka',
    code: 'DHK',
    description: 'The historic capital division with centuries-old Mughal architecture, vibrant rivers, royal palaces, and bustling cultural crossroads.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Khulna',
    bnName: 'খুলনা',
    slug: 'khulna',
    code: 'KHU',
    description: 'Home of the majestic Sundarbans—the world largest tidal halophytic mangrove forest, royal Bengal tigers, and medieval terracotta mosques.',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Rajshahi',
    bnName: 'রাজশাহী',
    slug: 'rajshahi',
    code: 'RAJ',
    description: 'The silk city and archeological heartland, renowned for luscious mango orchards, ancient Buddhist monasteries, and historic terracotta temples.',
    image: 'https://images.unsplash.com/photo-1628085449774-c36bcf8a8037?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Barishal',
    bnName: 'বরিশাল',
    slug: 'barishal',
    code: 'BAR',
    description: 'Venice of Bengal, blessed with labyrinthine riverine waterways, floating guava markets, and the panoramic sunrise-sunset beach of Kuakata.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Rangpur',
    bnName: 'রংপুর',
    slug: 'rangpur',
    code: 'RNG',
    description: 'The northern frontier featuring royal palaces, the majestic Teesta River, historic temples, and scenic Himalayan foothill tea vistas.',
    image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Mymensingh',
    bnName: 'ময়মনসিংহ',
    slug: 'mymensingh',
    code: 'MYM',
    description: 'Enchanting frontier with blue ceramic lakes, undulating Garo hills, historic zamindar lodges, and serene Brahmaputra riverbanks.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  },
];

// All 64 Districts of Bangladesh
const DISTRICTS: DistrictData[] = [
  // 1. Chattogram Division (11 districts)
  { name: 'Chattogram', bnName: 'চট্টগ্রাম', slug: 'chattogram', divisionSlug: 'chattogram', description: 'Port city nestled between green hills and the Bay of Bengal.', coverImage: 'https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?auto=format&fit=crop&w=800&q=80', latitude: 22.3569, longitude: 91.7832 },
  { name: "Cox's Bazar", bnName: 'কক্সবাজার', slug: 'coxs-bazar', divisionSlug: 'chattogram', description: 'The longest unbroken natural sea beach in the world.', coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', latitude: 21.4272, longitude: 92.0058 },
  { name: 'Bandarban', bnName: 'বান্দরবান', slug: 'bandarban', divisionSlug: 'chattogram', description: 'Towering peaks, misty hills, cloud-shrouded valleys, and roaring waterfalls.', coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', latitude: 22.1953, longitude: 92.2184 },
  { name: 'Rangamati', bnName: 'রাঙ্গামাটি', slug: 'rangamati', divisionSlug: 'chattogram', description: 'Pristine blue waters of Kaptai Lake and indigenous hill culture.', coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80', latitude: 22.7324, longitude: 92.2985 },
  { name: 'Khagrachhari', bnName: 'খাগড়াছড়ি', slug: 'khagrachhari', divisionSlug: 'chattogram', description: 'Mysterious caves, gushing mountain falls, and scenic valley lookouts.', coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80', latitude: 23.1193, longitude: 91.9847 },
  { name: 'Cumilla', bnName: 'কুমিল্লা', slug: 'cumilla', divisionSlug: 'chattogram', description: 'Ancient Buddhist archaeological relics of Shalban Vihara and Mainamati.', coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80', latitude: 23.4682, longitude: 91.1788 },
  { name: 'Feni', bnName: 'ফেনী', slug: 'feni', divisionSlug: 'chattogram', description: 'Historic transit corridor and scenic Muhuri irrigation project.', coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', latitude: 23.0159, longitude: 91.3976 },
  { name: 'Brahmanbaria', bnName: 'ব্রাহ্মণবাড়িয়া', slug: 'brahmanbaria', divisionSlug: 'chattogram', description: 'Cultural hub of classical music and historic Kalbhairab temple.', coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80', latitude: 23.9608, longitude: 91.1115 },
  { name: 'Noakhali', bnName: 'নোয়াখালী', slug: 'noakhali', divisionSlug: 'chattogram', description: 'Coastal district renowned for Nijhum Dwip and roaming deer herds.', coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80', latitude: 22.8696, longitude: 91.0991 },
  { name: 'Chandpur', bnName: 'চাঁদপুর', slug: 'chandpur', divisionSlug: 'chattogram', description: 'The confluence of Padma, Meghna, and Dakatia rivers and Hilsa haven.', coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', latitude: 23.2333, longitude: 90.6667 },
  { name: 'Lakshmipur', bnName: 'লক্ষ্মীপুর', slug: 'lakshmipur', divisionSlug: 'chattogram', description: 'Coastal river district with expansive Meghna estuaries and betel nut groves.', coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80', latitude: 22.9447, longitude: 90.8282 },

  // 2. Sylhet Division (4 districts)
  { name: 'Sylhet', bnName: 'সিলেট', slug: 'sylhet', divisionSlug: 'sylhet', description: 'Spiritual shrines, crystal freshwater streams at Bholaganj and Jaflong.', coverImage: 'https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=800&q=80', latitude: 24.8949, longitude: 91.8687 },
  { name: 'Moulvibazar', bnName: 'মৌলভীবাজার', slug: 'moulvibazar', divisionSlug: 'sylhet', description: 'Tea capital of Bangladesh, Lawachara rain forest, and Madhabkunda falls.', coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80', latitude: 24.4829, longitude: 91.7774 },
  { name: 'Sunamganj', bnName: 'সুনামগঞ্জ', slug: 'sunamganj', divisionSlug: 'sylhet', description: 'Fabulous Tanguar Haor wetland, Shimul Bagan, and turquoise Jadukata river.', coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', latitude: 25.0658, longitude: 91.3950 },
  { name: 'Habiganj', bnName: 'হবিগঞ্জ', slug: 'habiganj', divisionSlug: 'sylhet', description: 'Satchhari National Park, tea gardens, and historical mosques.', coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80', latitude: 24.3749, longitude: 91.4155 },

  { name: 'Dhaka', bnName: 'ঢাকা', slug: 'dhaka', divisionSlug: 'dhaka', description: 'Megacity of vibrant history, Lalbagh Fort, and Ahsan Manzil palace.', coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80', latitude: 23.8103, longitude: 90.4125 },
  { name: 'Gazipur', bnName: 'গাজীপুর', slug: 'gazipur', divisionSlug: 'dhaka', description: 'Bhawal National Park, wilderness resorts, and wildlife safari parks.', coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80', latitude: 23.9999, longitude: 90.4203 },
  { name: 'Narayanganj', bnName: 'নারায়ণগঞ্জ', slug: 'narayanganj', divisionSlug: 'dhaka', description: 'Historic Panam Nagar, Sonargaon folk art museum, and river harbor.', coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80', latitude: 23.6238, longitude: 90.5000 },
  { name: 'Tangail', bnName: 'টাঙ্গাইল', slug: 'tangail', divisionSlug: 'dhaka', description: 'Renowned for handmade sarees, Mohera Zamindar house, and Atia Mosque.', coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', latitude: 24.2513, longitude: 89.9167 },
  { name: 'Narsingdi', bnName: 'নরসিংদী', slug: 'narsingdi', divisionSlug: 'dhaka', description: 'Wari-Bateshwar ancient archaeological site dating back 2500 years.', coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80', latitude: 23.9197, longitude: 90.7202 },
  { name: 'Kishoreganj', bnName: 'কিশোরগঞ্জ', slug: 'kishoreganj', divisionSlug: 'dhaka', description: 'Scenic Nikli Haor wetlands, Jangalbari Fort, and historic temples.', coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80', latitude: 24.4449, longitude: 90.7766 },
  { name: 'Manikganj', bnName: 'মানিকগঞ্জ', slug: 'manikganj', divisionSlug: 'dhaka', description: 'Baliati Palace zamindar complex and tranquil Padma river shores.', coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80', latitude: 23.8617, longitude: 90.0003 },
  { name: 'Munshiganj', bnName: 'মুন্সীগঞ্জ', slug: 'munshiganj', divisionSlug: 'dhaka', description: 'Idrakpur Fort, birthplace of Atish Dipankar, and fertile potato delta.', coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80', latitude: 23.5422, longitude: 90.5305 },
  { name: 'Faridpur', bnName: 'ফরিদপুর', slug: 'faridpur', divisionSlug: 'dhaka', description: 'Cultural center on the Padma river and Jasimuddin residence.', coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', latitude: 23.6071, longitude: 89.8429 },
  { name: 'Gopalganj', bnName: 'গোপালগঞ্জ', slug: 'gopalganj', divisionSlug: 'dhaka', description: 'Tungipara mausoleum complex and sprawling wetland canals.', coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80', latitude: 23.0051, longitude: 89.8266 },
  { name: 'Madaripur', bnName: 'মাদারীপুর', slug: 'madaripur', divisionSlug: 'dhaka', description: 'Auliapur Neelkuthi and Padma riverbank agricultural landscapes.', coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', latitude: 23.1641, longitude: 90.1897 },
  { name: 'Rajbari', bnName: 'রাজবাড়ী', slug: 'rajbari', divisionSlug: 'dhaka', description: 'Godadhar river confluences and historic railway heritage.', coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80', latitude: 23.7574, longitude: 89.6445 },
  { name: 'Shariatpur', bnName: 'শরীয়তপুর', slug: 'shariatpur', divisionSlug: 'dhaka', description: 'Padma Bridge southern gateway and Fatehjangpur fort grounds.', coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80', latitude: 23.2423, longitude: 90.4348 },

  // 4. Khulna Division (10 districts)
  { name: 'Khulna', bnName: 'খুলনা', slug: 'khulna', divisionSlug: 'khulna', description: 'Gateway to the Sundarbans mangrove forest and Rupsha riverbanks.', coverImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80', latitude: 22.8456, longitude: 89.5403 },
  { name: 'Bagerhat', bnName: 'বাগেরহাট', slug: 'bagerhat', divisionSlug: 'khulna', description: 'UNESCO World Heritage Sixty Dome Mosque and Khan Jahan Ali mausoleum.', coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80', latitude: 22.6516, longitude: 89.7859 },
  { name: 'Satkhira', bnName: 'সাতক্ষীরা', slug: 'satkhira', divisionSlug: 'khulna', description: 'Sundarbans western fringe, sundari trees, and saltwater aquaculture.', coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80', latitude: 22.7185, longitude: 89.0705 },
  { name: 'Jashore', bnName: 'যশোর', slug: 'jashore', divisionSlug: 'khulna', description: 'Gadkhali flower capital, date palm jaggery, and historic shrines.', coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', latitude: 23.1664, longitude: 89.2137 },
  { name: 'Kushtia', bnName: 'কুষ্টিয়া', slug: 'kushtia', divisionSlug: 'khulna', description: 'Shrine of mystic bard Lalon Shah and Rabindranath Tagore Kuthibari.', coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80', latitude: 23.9013, longitude: 89.1204 },
  { name: 'Jhenaidah', bnName: 'ঝিনাইদহ', slug: 'jhenaidah', divisionSlug: 'khulna', description: 'Ancient mosques of Shailkupa and scenic agricultural fields.', coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80', latitude: 23.5448, longitude: 89.1539 },
  { name: 'Chuadanga', bnName: 'চুয়াডাঙ্গা', slug: 'chuadanga', divisionSlug: 'khulna', description: 'Border district with historic Gholdari mosque and Carew & Co.', coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', latitude: 23.6402, longitude: 88.8418 },
  { name: 'Meherpur', bnName: 'মেহেরপুর', slug: 'meherpur', divisionSlug: 'khulna', description: 'Historic Mujibnagar Memorial Monument of Bangladesh liberation.', coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80', latitude: 23.7622, longitude: 88.6318 },
  { name: 'Magura', bnName: 'মাগুরা', slug: 'magura', divisionSlug: 'khulna', description: 'Rich folklore heritage and historic Siddheshwari temple.', coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80', latitude: 23.4873, longitude: 89.4198 },
  { name: 'Narail', bnName: 'নড়াইল', slug: 'narail', divisionSlug: 'khulna', description: 'Birthplace of master painter SM Sultan and Chitra riverbank heritage.', coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', latitude: 23.1725, longitude: 89.5127 },

  // 5. Rajshahi Division (8 districts)
  { name: 'Rajshahi', bnName: 'রাজশাহী', slug: 'rajshahi', divisionSlug: 'rajshahi', description: 'Silk mills, Varendra research museum, and Puthia temple village.', coverImage: 'https://images.unsplash.com/photo-1628085449774-c36bcf8a8037?auto=format&fit=crop&w=800&q=80', latitude: 24.3745, longitude: 88.6042 },
  { name: 'Bogura', bnName: 'বগুড়া', slug: 'bogura', divisionSlug: 'rajshahi', description: 'Ancient fortress city Mahasthangarh and famous Bogura curd.', coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80', latitude: 24.8465, longitude: 89.3777 },
  { name: 'Pabna', bnName: 'পাবনা', slug: 'pabna', divisionSlug: 'rajshahi', description: 'Hardinge Bridge, Paksey railway township, and mental health heritage.', coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80', latitude: 24.0116, longitude: 89.2562 },
  { name: 'Sirajganj', bnName: 'সিরাজগঞ্জ', slug: 'sirajganj', divisionSlug: 'rajshahi', description: 'Jamuna Bridge terminal, weaving looms, and Rabindra complex.', coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80', latitude: 24.4534, longitude: 89.7008 },
  { name: 'Naogaon', bnName: 'নওগাঁ', slug: 'naogaon', divisionSlug: 'rajshahi', description: 'UNESCO Somapura Mahavihara at Paharpur, Kusumba Mosque.', coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80', latitude: 24.7936, longitude: 88.9318 },
  { name: 'Natore', bnName: 'নাটোর', slug: 'natore', divisionSlug: 'rajshahi', description: 'Uttara Gonobhaban royal palace and Rani Bhabani zamindar palace.', coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', latitude: 24.4206, longitude: 88.9324 },
  { name: 'Chapainawabganj', bnName: 'চাঁপাইনবাবগঞ্জ', slug: 'chapainawabganj', divisionSlug: 'rajshahi', description: 'Mango capital of Bangladesh and Choto Sona Mosque of Bengal Sultanate.', coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80', latitude: 24.5965, longitude: 88.2775 },
  { name: 'Joypurhat', bnName: 'জয়পুরহাট', slug: 'joypurhat', divisionSlug: 'rajshahi', description: 'Historic Lockma zamindar palace and picturesque limestone caves.', coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', latitude: 25.1015, longitude: 89.0277 },

  // 6. Barishal Division (6 districts)
  { name: 'Barishal', bnName: 'বরিশাল', slug: 'barishal', divisionSlug: 'barishal', description: 'Floating guava markets, bell-ringing river launches, and Durga Sagar.', coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80', latitude: 22.7010, longitude: 90.3535 },
  { name: 'Patuakhali', bnName: 'পটুয়াখালী', slug: 'patuakhali', divisionSlug: 'barishal', description: 'Kuakata Sea Beach, where both sunrise and sunset glow over the sea.', coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', latitude: 22.3596, longitude: 90.3298 },
  { name: 'Bhola', bnName: 'ভোলা', slug: 'bhola', divisionSlug: 'barishal', description: 'The largest island district of Bangladesh, Monpura and Char Kukri Mukri.', coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80', latitude: 22.6859, longitude: 90.6481 },
  { name: 'Pirojpur', bnName: 'পিরোজপুর', slug: 'pirojpur', divisionSlug: 'barishal', description: 'Baimara floating market, river estuaries, and historic zamindar estates.', coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80', latitude: 22.5841, longitude: 89.9720 },
  { name: 'Barguna', bnName: 'বরগুনা', slug: 'barguna', divisionSlug: 'barishal', description: 'Suborno Char, coastal mangrove forest belts, and tranquil beaches.', coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', latitude: 22.0953, longitude: 90.1121 },
  { name: 'Jhalokathi', bnName: 'ঝালকাঠি', slug: 'jhalokathi', divisionSlug: 'barishal', description: 'Historic guava canals, Kirtipasha palace, and tranquil rivers.', coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80', latitude: 22.6406, longitude: 90.1987 },

  // 7. Rangpur Division (8 districts)
  { name: 'Rangpur', bnName: 'রংপুর', slug: 'rangpur', divisionSlug: 'rangpur', description: 'Tajhat Palace, Chikli Beel, and cultural north Bengal pride.', coverImage: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80', latitude: 25.7439, longitude: 89.2752 },
  { name: 'Dinajpur', bnName: 'দিনাজপুর', slug: 'dinajpur', divisionSlug: 'rangpur', description: 'Exquisite 18th-century terracotta Kantajew Temple and Ramsagar Dighi.', coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80', latitude: 25.6217, longitude: 88.6355 },
  { name: 'Panchagarh', bnName: 'পঞ্চগড়', slug: 'panchagarh', divisionSlug: 'rangpur', description: 'Northernmost tip where Kanchenjunga peaks gleam on clear autumn days.', coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', latitude: 26.3411, longitude: 88.5542 },
  { name: 'Thakurgaon', bnName: 'ঠাকুরগাঁও', slug: 'thakurgaon', divisionSlug: 'rangpur', description: 'Historic Fun City, Baliadangi mango tree, and quiet rural vistas.', coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80', latitude: 26.0337, longitude: 88.4617 },
  { name: 'Kurigram', bnName: 'কুড়িগ্রাম', slug: 'kurigram', divisionSlug: 'rangpur', description: 'Expansive river chars on the mighty Brahmaputra and Dharla rivers.', coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80', latitude: 25.8054, longitude: 89.6362 },
  { name: 'Gaibandha', bnName: 'গাইবান্ধা', slug: 'gaibandha', divisionSlug: 'rangpur', description: 'Brahmaputra confluence and historic Bardhankuti zamindar estate.', coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80', latitude: 25.3288, longitude: 89.5430 },
  { name: 'Nilphamari', bnName: 'নীলফামারী', slug: 'nilphamari', divisionSlug: 'rangpur', description: 'Teesta Barrage, historic Saidpur railway workshops, and Chini Mosque.', coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', latitude: 25.9318, longitude: 88.8560 },
  { name: 'Lalmonirhat', bnName: 'লালমনিরহাট', slug: 'lalmonirhat', divisionSlug: 'rangpur', description: 'Teesta riverbanks, Tin Bigha Corridor, and Mogholhat borders.', coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', latitude: 25.9923, longitude: 89.2847 },

  // 8. Mymensingh Division (4 districts)
  { name: 'Mymensingh', bnName: 'ময়মনসিংহ', slug: 'mymensingh', divisionSlug: 'mymensingh', description: 'Shashi Lodge palace, Agricultural University campus, and Brahmaputra banks.', coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', latitude: 24.7471, longitude: 90.4203 },
  { name: 'Netrokona', bnName: 'নেত্রকোণা', slug: 'netrokona', divisionSlug: 'mymensingh', description: 'Turquoise blue water of Birishiri Ceramic Hills and Someshwari River.', coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80', latitude: 24.8709, longitude: 90.7279 },
  { name: 'Sherpur', bnName: 'শেরপুর', slug: 'sherpur', divisionSlug: 'mymensingh', description: 'Undulating Garo hills, Madhutila eco-park, and Gajni अवकाश Kendra.', coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80', latitude: 25.0205, longitude: 90.0153 },
  { name: 'Jamalpur', bnName: 'জামালপুর', slug: 'jamalpur', divisionSlug: 'mymensingh', description: 'Nakshi Kantha craftsmanship, Jamuna river chars, and Laldighir par.', coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80', latitude: 24.9375, longitude: 89.9378 },
];

// Rich, iconic tourist places with coordinates, categories, and galleries
const PLACES: PlaceData[] = [
  // Chattogram
  {
    name: 'Khaiyachora Waterfall',
    bnName: 'খৈয়াছড়া ঝর্ণা',
    slug: 'khaiyachora-waterfall',
    description: 'A mesmerizing 9-step cascading waterfall hidden within the dense hills of Mirsharai. Renowned as the Queen of Waterfalls in Bangladesh, it offers adventurous jungle treks and natural pools.',
    districtSlug: 'chattogram',
    divisionSlug: 'chattogram',
    latitude: 22.7562,
    longitude: 91.6025,
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.WATERFALL,
    averageRating: 4.8,
    totalVisitors: 1450,
    gallery: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Jamboree Park',
    bnName: 'জাম্বুরি পার্ক',
    slug: 'jamboree-park',
    description: 'Premier urban recreation and leisure park situated in Agrabad, Chattogram. Known for its massive 50,000 sq ft artificial lake, vibrant musical LED lighting, green promenades, and family gatherings.',
    districtSlug: 'chattogram',
    divisionSlug: 'chattogram',
    latitude: 22.3276,
    longitude: 91.8105,
    coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.PARK,
    averageRating: 4.7,
    totalVisitors: 5200,
    gallery: [
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'DC Park (Faujdarhat)',
    bnName: 'ডিসি পার্ক (ফৌজদারহাট)',
    slug: 'dc-park-faujdarhat',
    description: 'Scenic 194-acre coastal park in Faujdarhat, Sitakunda overlooking the sea. Host to the legendary annual Chattogram Flower Festival featuring hundreds of colorful flower varieties, water lilies, and sea breeze.',
    districtSlug: 'chattogram',
    divisionSlug: 'chattogram',
    latitude: 22.4045,
    longitude: 91.7582,
    coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.PARK,
    averageRating: 4.8,
    totalVisitors: 6100,
    gallery: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Patenga Sea Beach',
    bnName: 'পতেঙ্গা সমুদ্র সৈকত',
    slug: 'patenga-sea-beach',
    description: 'Popular coastal destination in Chattogram situated near the mouth of the Karnaphuli River. Famous for vibrant sea-breeze sunsets, spicy street food crab fries, and speed boat rides.',
    districtSlug: 'chattogram',
    divisionSlug: 'chattogram',
    latitude: 22.2359,
    longitude: 91.7915,
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.BEACH,
    averageRating: 4.5,
    totalVisitors: 8400,
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Chandranath Hill & Temple',
    bnName: 'চন্দ্রনাথ পাহাড় ও মন্দির',
    slug: 'chandranath-hill',
    description: 'The highest peak in Chattogram district at Sitakunda, rising over 1,150 feet. A revered Hindu pilgrimage site offering a challenging stone-step mountain trek with panoramic views of the Bay of Bengal.',
    districtSlug: 'chattogram',
    divisionSlug: 'chattogram',
    latitude: 22.6277,
    longitude: 91.6841,
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HILL,
    averageRating: 4.8,
    totalVisitors: 2800,
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Bhatiari Lake & Sunset Point',
    bnName: 'ভাটিয়ারী লেক ও সানসেট পয়েন্ট',
    slug: 'bhatiari-lake',
    description: 'Serene lakeside nestled in the undulating military academy hills of Bhatiari. Features panoramic lake lookouts, cool pine-clad hill breezes, boating, and scenic evening tea stalls.',
    districtSlug: 'chattogram',
    divisionSlug: 'chattogram',
    latitude: 22.4417,
    longitude: 91.7692,
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.LAKE,
    averageRating: 4.6,
    totalVisitors: 4100,
    gallery: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Mohamaya Lake & Kayaking',
    bnName: 'মহামায়া লেক ও কায়াকিং',
    slug: 'mohamaya-lake',
    description: 'The second largest man-made lake in Bangladesh, located in Mirsharai. Encircled by towering green hills and hidden cascading springs, it is the top kayaking haven in the country.',
    districtSlug: 'chattogram',
    divisionSlug: 'chattogram',
    latitude: 22.8028,
    longitude: 91.5647,
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.ADVENTURE,
    averageRating: 4.8,
    totalVisitors: 3600,
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: "Foy's Lake & Concord Sea World",
    bnName: "ফয়'স লেক ও কনকর্ড সি ওয়ার্ল্ড",
    slug: 'foys-lake',
    description: 'Picturesque artificial lake created in 1924, surrounded by scenic green hills. Features boat rides, resort cottages, and an expansive amusement water theme park.',
    districtSlug: 'chattogram',
    divisionSlug: 'chattogram',
    latitude: 22.3638,
    longitude: 91.8022,
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.RESORT,
    averageRating: 4.5,
    totalVisitors: 7200,
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Guliakhali Sea Beach',
    bnName: 'গুলিয়াখালী সমুদ্র সৈকত',
    slug: 'guliakhali-sea-beach',
    description: 'A one-of-a-kind natural beach in Sitakunda featuring carpets of lush green undulating grass crisscrossed by sea-water canals alongside mangrove keora trees.',
    districtSlug: 'chattogram',
    divisionSlug: 'chattogram',
    latitude: 22.5681,
    longitude: 91.6192,
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.BEACH,
    averageRating: 4.7,
    totalVisitors: 4500,
    gallery: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'CRB Shirishtala (Heritage Walk)',
    bnName: 'সিআরবি শিরীষতলা',
    slug: 'crb-shirishtala',
    description: 'The cultural and heritage green lung of Chattogram city, shaded by hundred-year-old giant Shirish and rain trees. Center for Pohela Boishakh celebrations and serene evening coffee walks.',
    districtSlug: 'chattogram',
    divisionSlug: 'chattogram',
    latitude: 22.3392,
    longitude: 91.8228,
    coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.PARK,
    averageRating: 4.8,
    totalVisitors: 6900,
    gallery: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Parki Beach',
    bnName: 'পারকি সমুদ্র সৈকত',
    slug: 'parki-beach',
    description: 'Sprawling sandy beach in Anwara along the Karnaphuli river estuary, fringed with a dense coastal tamarisk (Jhau) forest and lively red crab colonies.',
    districtSlug: 'chattogram',
    divisionSlug: 'chattogram',
    latitude: 22.1889,
    longitude: 91.8083,
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.BEACH,
    averageRating: 4.4,
    totalVisitors: 3100,
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Sitakunda Eco Park & Botanical Garden',
    bnName: 'সীতাকুণ্ড বোটানিক্যাল গার্ডেন ও ইকো পার্ক',
    slug: 'sitakunda-eco-park',
    description: 'The first eco-park established in Bangladesh, featuring botanical conservatories, rare medicinal plant species, natural streams, and the twin waterfalls of Suptadhara and Sahasradhara.',
    districtSlug: 'chattogram',
    divisionSlug: 'chattogram',
    latitude: 22.6186,
    longitude: 91.6883,
    coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.PARK,
    averageRating: 4.6,
    totalVisitors: 3300,
    gallery: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Commonwealth War Cemetery',
    bnName: 'চট্টগ্রাম কমনওয়েলথ ওয়ার সিমেট্রি',
    slug: 'commonwealth-war-cemetery-chattogram',
    description: 'A beautifully manicured and serene historic memorial park at Dampara, commemorating 755 soldiers from Allied forces who fell during World War II in the Burma Campaign.',
    districtSlug: 'chattogram',
    divisionSlug: 'chattogram',
    latitude: 22.3587,
    longitude: 91.8242,
    coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HISTORICAL,
    averageRating: 4.7,
    totalVisitors: 2600,
    gallery: [
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
    ],
  },
  // Cox's Bazar
  {
    name: "Cox's Bazar Beach",
    bnName: 'কক্সবাজার সমুদ্র সৈকত',
    slug: 'coxs-bazar-beach',
    description: 'The iconic 120-kilometer unbroken natural sandy beach, stretching from Kolatoli and Laboni to Inani. Sunset point of Bangladesh with endless rolling waves and seaside nightlife.',
    districtSlug: 'coxs-bazar',
    divisionSlug: 'chattogram',
    latitude: 21.4272,
    longitude: 91.9758,
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.BEACH,
    averageRating: 4.9,
    totalVisitors: 8900,
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: "Saint Martin's Island",
    bnName: 'সেন্ট মার্টিন দ্বীপ',
    slug: 'saint-martins-island',
    description: 'The sole coral island of Bangladesh in the northeast part of the Bay of Bengal. Crystal-clear azure waters, living corals, fresh green coconuts, and heavenly serene night skies.',
    districtSlug: 'coxs-bazar',
    divisionSlug: 'chattogram',
    latitude: 20.6273,
    longitude: 92.3225,
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.BEACH,
    averageRating: 4.9,
    totalVisitors: 4200,
    gallery: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    ],
  },
  // Bandarban
  {
    name: 'Nilgiri Hill Resort',
    bnName: 'নীলগিরি',
    slug: 'nilgiri-bandarban',
    description: 'One of the highest and most spectacular mountain viewpoints in Bangladesh, located 2,200 feet above sea level. Visitors often find themselves floating above an ethereal sea of white clouds.',
    districtSlug: 'bandarban',
    divisionSlug: 'chattogram',
    latitude: 21.9167,
    longitude: 92.3167,
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HILL,
    averageRating: 4.9,
    totalVisitors: 3100,
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Nafakhum Waterfall',
    bnName: 'নাফাখুম জলপ্রপাত',
    slug: 'nafakhum-waterfall',
    description: 'The Niagara of Bangladesh, situated deep in Thanchi along the Remakri River. Roaring wild cascades tumbling across rocky riverbeds, surrounded by untouched indigenous landscapes.',
    districtSlug: 'bandarban',
    divisionSlug: 'chattogram',
    latitude: 21.8486,
    longitude: 92.5126,
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.WATERFALL,
    averageRating: 4.9,
    totalVisitors: 1620,
    gallery: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    ],
  },
  // Rangamati
  {
    name: 'Sajek Valley',
    bnName: 'সাজেক ভ্যালি',
    slug: 'sajek-valley',
    description: 'The Kingdom of Clouds perched high in the northern hills of Rangamati near the Mizoram border. Winding serpentine mountain roads, wooden cottages, and breathtaking sunrises.',
    districtSlug: 'rangamati',
    divisionSlug: 'chattogram',
    latitude: 23.3820,
    longitude: 92.2938,
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HILL,
    averageRating: 4.9,
    totalVisitors: 6400,
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Kaptai Lake',
    bnName: 'কাপ্তাই হ্রদ',
    slug: 'kaptai-lake',
    description: 'The largest man-made freshwater lake in South Asia, ringed by steep emerald mountains, floating fruit stalls, Shuvolong falls, and the famous Hanging Bridge.',
    districtSlug: 'rangamati',
    divisionSlug: 'chattogram',
    latitude: 22.6533,
    longitude: 92.1753,
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.LAKE,
    averageRating: 4.8,
    totalVisitors: 3800,
    gallery: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    ],
  },
  // Sylhet
  {
    name: 'Ratargul Swamp Forest',
    bnName: 'রাতারগুল সোয়াম্প ফরেস্ট',
    slug: 'ratargul-swamp-forest',
    description: 'The only freshwater swamp forest in Bangladesh, often called the Amazon of Bangladesh. Submerged evergreen trees where wooden dinghy boats glide through reflective mirrored waters.',
    districtSlug: 'sylhet',
    divisionSlug: 'sylhet',
    latitude: 25.0033,
    longitude: 91.9295,
    coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.FOREST,
    averageRating: 4.7,
    totalVisitors: 4100,
    gallery: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Bholaganj Sada Pathor',
    bnName: 'ভোলাগঞ্জ সাদা পাথর',
    slug: 'bholaganj-sada-pathor',
    description: 'Where crystalline turquoise mountain streams from the Meghalaya hills tumble over fields of glistening white stones. A heavenly cool retreat at the northern border.',
    districtSlug: 'sylhet',
    divisionSlug: 'sylhet',
    latitude: 25.1565,
    longitude: 91.7583,
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.RIVER,
    averageRating: 4.8,
    totalVisitors: 3950,
    gallery: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    ],
  },
  // Moulvibazar
  {
    name: 'Lawachara National Park',
    bnName: 'লাউয়াছড়া জাতীয় উদ্যান',
    slug: 'lawachara-national-park',
    description: 'A biodiverse semi-evergreen rainforest in Kamalganj, home to endangered western hoolock gibbons, rare orchids, towering fig canopies, and a historic railway track cutting through the wild.',
    districtSlug: 'moulvibazar',
    divisionSlug: 'sylhet',
    latitude: 24.3262,
    longitude: 91.7877,
    coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.FOREST,
    averageRating: 4.7,
    totalVisitors: 2800,
    gallery: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Sreemangal Tea Gardens',
    bnName: 'শ্রীমঙ্গল চা বাগান',
    slug: 'sreemangal-tea-gardens',
    description: 'Rolling velvet green hills stretching as far as the eye can see. Renowned for seven-layer tea, pineapple groves, cycling trails, and tranquil bird sanctuaries at Baikka Beel.',
    districtSlug: 'moulvibazar',
    divisionSlug: 'sylhet',
    latitude: 24.3065,
    longitude: 91.7296,
    coverImage: 'https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.PARK,
    averageRating: 4.9,
    totalVisitors: 5600,
    gallery: [
      'https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=800&q=80',
    ],
  },
  // Sunamganj
  {
    name: 'Tanguar Haor',
    bnName: 'টাঙ্গুয়ার হাওর',
    slug: 'tanguar-haor',
    description: 'A Ramsar World Wetland site covering over 100 square kilometers below the Meghalaya hills. Famous for traditional wooden houseboat stays under starlit skies and thousands of migratory birds.',
    districtSlug: 'sunamganj',
    divisionSlug: 'sylhet',
    latitude: 25.1500,
    longitude: 91.0667,
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.LAKE,
    averageRating: 4.9,
    totalVisitors: 3400,
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
  },
  // Dhaka
  {
    name: 'Lalbagh Fort',
    bnName: 'লালবাগ কেল্লা',
    slug: 'lalbagh-fort',
    description: 'Incomplete 17th-century Mughal fort complex overlooking the Buriganga River in Old Dhaka, featuring the marble Tomb of Pari Bibi, the Diwan-i-Aam, and historic underground tunnels.',
    districtSlug: 'dhaka',
    divisionSlug: 'dhaka',
    latitude: 23.7191,
    longitude: 90.3882,
    coverImage: 'https://images.unsplash.com/photo-1609137144822-0d1279a0cf34?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HISTORICAL,
    averageRating: 4.6,
    totalVisitors: 7200,
    gallery: [
      'https://images.unsplash.com/photo-1609137144822-0d1279a0cf34?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Ahsan Manzil',
    bnName: 'আহসান মঞ্জিল',
    slug: 'ahsan-manzil',
    description: 'The grand Pink Palace on the banks of Buriganga, once the official palace and seat of the Nawab of Dhaka. Now a magnificent national museum showcasing royal artifacts and Indo-Saracenic revival architecture.',
    districtSlug: 'dhaka',
    divisionSlug: 'dhaka',
    latitude: 23.7086,
    longitude: 90.4061,
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.MUSEUM,
    averageRating: 4.7,
    totalVisitors: 6500,
    gallery: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Hatirjheel Promenade & Water Taxi',
    bnName: 'হাতিরঝিল ও ওয়াটার ট্যাক্সি',
    slug: 'hatirjheel-dhaka',
    description: 'Modern waterfront transportation and leisure destination in central Dhaka with illuminated express bridges, musical fountain shows, lakeside cycling trails, and scenic water taxi rides.',
    districtSlug: 'dhaka',
    divisionSlug: 'dhaka',
    latitude: 23.7744,
    longitude: 90.4132,
    coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.LAKE,
    averageRating: 4.8,
    totalVisitors: 9800,
    gallery: [
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Dhanmondi Lake & Rabindra Sarobar',
    bnName: 'ধানমন্ডি লেক ও রবীন্দ্র সরোবর',
    slug: 'dhanmondi-lake',
    description: 'Vibrant cultural and open-air recreational heart of Dhaka. Features waterside amphitheater concerts at Rabindra Sarobar, traditional snack stalls, wooden bridges, and rowing boats.',
    districtSlug: 'dhaka',
    divisionSlug: 'dhaka',
    latitude: 23.7461,
    longitude: 90.3752,
    coverImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.PARK,
    averageRating: 4.7,
    totalVisitors: 8700,
    gallery: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Ramna Park',
    bnName: 'রমনা পার্ক',
    slug: 'ramna-park',
    description: 'Historic 68-acre central park adorned with a large lake, rare age-old trees, and jogging walkways. The traditional staging ground for Pohela Boishakh dawn celebrations in Bangladesh.',
    districtSlug: 'dhaka',
    divisionSlug: 'dhaka',
    latitude: 23.7372,
    longitude: 90.4005,
    coverImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.PARK,
    averageRating: 4.6,
    totalVisitors: 6900,
    gallery: [
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'National Parliament Complex',
    bnName: 'জাতীয় সংসদ ভবন চত্বর',
    slug: 'national-parliament-complex',
    description: 'Architectural masterpiece designed by world-renowned architect Louis Kahn, reflected in artificial surrounding moat waters with sprawling green lawns and wide pedestrian plazas.',
    districtSlug: 'dhaka',
    divisionSlug: 'dhaka',
    latitude: 23.7628,
    longitude: 90.3783,
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HISTORICAL,
    averageRating: 4.9,
    totalVisitors: 7800,
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Diabari Kashbon & Metro Rail Vista',
    bnName: 'দিয়াবাড়ি কাশবন ও মেট্রোরেল',
    slug: 'diabari-uttara',
    description: 'Vast open horizon landscape in Uttara Sector 15 famous for blooming white autumn catkin flowers (Kashbon), fresh country breezes, and picturesque elevated views of the MRT Line-6 trains.',
    districtSlug: 'dhaka',
    divisionSlug: 'dhaka',
    latitude: 23.8765,
    longitude: 90.3721,
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.PARK,
    averageRating: 4.5,
    totalVisitors: 5400,
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
  },
  // Narayanganj
  {
    name: 'Panam Nagar',
    bnName: 'পানাম নগর',
    slug: 'panam-nagar',
    description: 'The mysterious 19th-century ghost town in Sonargaon with single-street rows of neoclassical and colonial European mansions built by wealthy Hindu cotton traders.',
    districtSlug: 'narayanganj',
    divisionSlug: 'dhaka',
    latitude: 23.6491,
    longitude: 90.6025,
    coverImage: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HISTORICAL,
    averageRating: 4.8,
    totalVisitors: 4800,
    gallery: [
      'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
    ],
  },
  // Khulna & Bagerhat
  {
    name: 'Sundarbans National Park',
    bnName: 'সুন্দরবন জাতীয় উদ্যান',
    slug: 'sundarbans-national-park',
    description: 'UNESCO World Heritage tidal mangrove forest spanning 10,000 square kilometers across Bangladesh and India. Roaming Royal Bengal tigers, spotted deer, saltwater crocodiles, and whispering sundari trees.',
    districtSlug: 'khulna',
    divisionSlug: 'khulna',
    latitude: 21.9497,
    longitude: 89.1833,
    coverImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.FOREST,
    averageRating: 4.9,
    totalVisitors: 5100,
    gallery: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    name: 'Sixty Dome Mosque',
    bnName: 'ষাট গম্বুজ মসজিদ',
    slug: 'sixty-dome-mosque',
    description: 'Medieval 15th-century UNESCO World Heritage brick mosque constructed by Khan Jahan Ali in Bagerhat. Features 77 low domes supported by 60 stone pillars and massive fortress-like terracotta walls.',
    districtSlug: 'bagerhat',
    divisionSlug: 'khulna',
    latitude: 22.6744,
    longitude: 89.7419,
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.RELIGIOUS,
    averageRating: 4.8,
    totalVisitors: 3600,
    gallery: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    ],
  },
  // Patuakhali
  {
    name: 'Kuakata Sea Beach',
    bnName: 'কুয়াকাটা সমুদ্র সৈকত',
    slug: 'kuakata-sea-beach',
    description: 'Known as Sagor Konna (Daughter of the Sea), this unique 18km beach on the southern tip of Patuakhali offers unobstructed vistas of both the sunrise and the sunset across the waters of the Bay of Bengal.',
    districtSlug: 'patuakhali',
    divisionSlug: 'barishal',
    latitude: 21.8167,
    longitude: 90.1167,
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.BEACH,
    averageRating: 4.8,
    totalVisitors: 4500,
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    ],
  },
  // Naogaon
  {
    name: 'Somapura Mahavihara (Paharpur)',
    bnName: 'সোমপুর মহাবিহার (পাহাড়পুর)',
    slug: 'somapura-mahavihara',
    description: 'UNESCO World Heritage site built in the 8th century by the Pala emperor Dharmapala. One of the largest and most famous Buddhist monasteries in South Asia with an imposing cruciform central shrine.',
    districtSlug: 'naogaon',
    divisionSlug: 'rajshahi',
    latitude: 25.0315,
    longitude: 88.9769,
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.HISTORICAL,
    averageRating: 4.8,
    totalVisitors: 2900,
    gallery: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    ],
  },
  // Dinajpur
  {
    name: 'Kantajew Temple',
    bnName: 'কান্তজীউ মন্দির',
    slug: 'kantajew-temple',
    description: 'Exquisite late medieval Hindu temple famous across the world for intricate terracotta relief plaques illustrating epics of the Ramayana and Mahabharata, built in 1752 by Maharaja Pran Nath.',
    districtSlug: 'dinajpur',
    divisionSlug: 'rangpur',
    latitude: 25.7925,
    longitude: 88.6653,
    coverImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.RELIGIOUS,
    averageRating: 4.9,
    totalVisitors: 2700,
    gallery: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    ],
  },
  // Netrokona
  {
    name: 'Birishiri Ceramic Hills & Lake',
    bnName: 'বিরিশিরি চিনামাটির পাহাড়',
    slug: 'birishiri-ceramic-hills',
    description: 'Spectacular turquoise-blue mineral lake surrounded by white and pastel ceramic clay hills at Durgapur. Set beside the clear crystal waters of the Someshwari River against the Garo hills.',
    districtSlug: 'netrokona',
    divisionSlug: 'mymensingh',
    latitude: 25.1278,
    longitude: 90.6689,
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    category: PlaceCategory.LAKE,
    averageRating: 4.8,
    totalVisitors: 2400,
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

async function main() {
  console.log('--- Seeding ExploreBD Core Data ---');

  // 1. Seed Divisions
  console.log(`Seeding ${DIVISIONS.length} Divisions...`);
  const divisionMap = new Map<string, string>();
  for (const div of DIVISIONS) {
    const record = await prisma.division.upsert({
      where: { slug: div.slug },
      update: {
        name: div.name,
        bnName: div.bnName,
        code: div.code,
        description: div.description,
        image: div.image,
      },
      create: {
        name: div.name,
        bnName: div.bnName,
        slug: div.slug,
        code: div.code,
        description: div.description,
        image: div.image,
      },
    });
    divisionMap.set(div.slug, record.id);
  }

  // 2. Seed 64 Districts
  console.log(`Seeding ${DISTRICTS.length} Districts...`);
  const districtMap = new Map<string, string>();
  for (const dist of DISTRICTS) {
    const divisionId = divisionMap.get(dist.divisionSlug);
    if (!divisionId) {
      console.warn(`Division not found for district ${dist.name}: ${dist.divisionSlug}`);
      continue;
    }

    const record = await prisma.district.upsert({
      where: { slug: dist.slug },
      update: {
        name: dist.name,
        bnName: dist.bnName,
        divisionId,
        description: dist.description,
        coverImage: dist.coverImage,
        latitude: dist.latitude,
        longitude: dist.longitude,
      },
      create: {
        name: dist.name,
        bnName: dist.bnName,
        slug: dist.slug,
        divisionId,
        description: dist.description,
        coverImage: dist.coverImage,
        latitude: dist.latitude,
        longitude: dist.longitude,
      },
    });
    districtMap.set(dist.slug, record.id);
  }

  // 3. Seed Tourist Places
  console.log(`Seeding ${PLACES.length} Tourist Places...`);
  for (const place of PLACES) {
    const districtId = districtMap.get(place.districtSlug);
    const divisionId = divisionMap.get(place.divisionSlug);

    if (!districtId || !divisionId) {
      console.warn(`District/Division not found for place ${place.name}`);
      continue;
    }

    const record = await prisma.place.upsert({
      where: { slug: place.slug },
      update: {
        name: place.name,
        bnName: place.bnName,
        description: place.description,
        districtId,
        divisionId,
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
        districtId,
        divisionId,
        latitude: place.latitude,
        longitude: place.longitude,
        coverImage: place.coverImage,
        category: place.category,
        averageRating: place.averageRating,
        totalVisitors: place.totalVisitors,
      },
    });

    // Create gallery images if they don't already exist
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
  }

  // Summary counts
  const totalDivisions = await prisma.division.count();
  const totalDistricts = await prisma.district.count();
  const totalPlaces = await prisma.place.count();

  console.log('✅ Core Data Seeding Complete!');
  console.log(`📊 Current Database Stats:`);
  console.log(`   - Divisions: ${totalDivisions}`);
  console.log(`   - Districts: ${totalDistricts}`);
  console.log(`   - Tourist Places: ${totalPlaces}`);
}

main()
  .catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
