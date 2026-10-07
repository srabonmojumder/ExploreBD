import type { MetadataRoute } from 'next';

const DISTRICT_SLUGS = [
  // Chattogram (11)
  'chattogram', 'coxs-bazar', 'bandarban', 'rangamati', 'khagrachhari',
  'cumilla', 'feni', 'brahmanbaria', 'noakhali', 'chandpur', 'lakshmipur',
  // Sylhet (4)
  'sylhet', 'moulvibazar', 'sunamganj', 'habiganj',
  // Dhaka (13)
  'dhaka', 'gazipur', 'narayanganj', 'tangail', 'narsingdi', 'kishoreganj',
  'manikganj', 'munshiganj', 'faridpur', 'gopalganj', 'madaripur', 'rajbari', 'shariatpur',
  // Khulna (10)
  'khulna', 'bagerhat', 'satkhira', 'jashore', 'kushtia', 'jhenaidah',
  'chuadanga', 'meherpur', 'magura', 'narail',
  // Rajshahi (8)
  'rajshahi', 'bogura', 'pabna', 'sirajganj', 'naogaon', 'natore',
  'chapainawabganj', 'joypurhat',
  // Barishal (6)
  'barishal', 'patuakhali', 'bhola', 'pirojpur', 'barguna', 'jhalokathi',
  // Rangpur (8)
  'rangpur', 'dinajpur', 'panchagarh', 'thakurgaon', 'kurigram',
  'gaibandha', 'nilphamari', 'lalmonirhat',
  // Mymensingh (4)
  'mymensingh', 'netrokona', 'sherpur', 'jamalpur',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://explore-bd-gamma.vercel.app';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tracker`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/districts`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/places`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  const districtRoutes: MetadataRoute.Sitemap = DISTRICT_SLUGS.map((slug) => ({
    url: `${baseUrl}/districts/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...districtRoutes];
}
