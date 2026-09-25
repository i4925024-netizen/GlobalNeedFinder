import {
  collection,
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
  limit,
  query,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Need, Listing, ProviderProfile } from '../types';
import { generateSearchKeywords } from '../utils/searchUtils';

const INITIAL_PROVIDERS: ProviderProfile[] = [
  {
    id: 'prov_apex_motors',
    userId: 'prov_apex_motors',
    businessName: 'Apex Global Motors & Logistics',
    bio: 'Direct exporters and certified pre-owned vehicle providers with global shipping and full inspection warranties.',
    country: 'United Arab Emirates',
    city: 'Dubai',
    serviceAreas: ['Dubai', 'Abu Dhabi', 'Sharjah', 'Global Export'],
    categories: ['vehicles'],
    phone: '+971 4 800 2739',
    email: 'contact@apexmotorsglobal.com',
    website: 'https://apexmotorsglobal.com',
    showEmail: true,
    showPhone: true,
    isVerified: true,
    rating: 4.9,
    reviewCount: 42,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  },
  {
    id: 'prov_cloudcraft_solutions',
    userId: 'prov_cloudcraft_solutions',
    businessName: 'CloudCraft Digital & Engineering',
    bio: 'Full-stack software agency specializing in React, Next.js, Cloud Architectures, and Mobile apps with 10+ years experience.',
    country: 'United Kingdom',
    city: 'London',
    serviceAreas: ['Global / Remote', 'London', 'Manchester'],
    categories: ['services', 'remote-work', 'jobs'],
    phone: '+44 20 7946 0192',
    email: 'team@cloudcraftdigital.co.uk',
    website: 'https://cloudcraftdigital.co.uk',
    showEmail: true,
    showPhone: false,
    isVerified: true,
    rating: 5.0,
    reviewCount: 38,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  },
  {
    id: 'prov_skyline_properties',
    userId: 'prov_skyline_properties',
    businessName: 'Skyline Elite Real Estate',
    bio: 'Premier residential and commercial property advisory for apartments, villas, and luxury rentals across major global cities.',
    country: 'United States',
    city: 'New York',
    serviceAreas: ['New York', 'Dubai', 'London'],
    categories: ['property'],
    phone: '+1 212 555 0199',
    email: 'rentals@skylineproperties.com',
    website: 'https://skylineproperties.com',
    showEmail: true,
    showPhone: true,
    isVerified: true,
    rating: 4.8,
    reviewCount: 29,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  },
  {
    id: 'prov_apex_electronics',
    userId: 'prov_apex_electronics',
    businessName: 'OmniTech Components & Hardware',
    bio: 'Wholesale electronics, Apple/Android device bulk supplier, chipsets, and original accessories with fast international dispatch.',
    country: 'Singapore',
    city: 'Singapore',
    serviceAreas: ['Asia', 'Europe', 'North America'],
    categories: ['electronics', 'products'],
    phone: '+65 6789 0123',
    email: 'b2b@omnitechcomponents.sg',
    showEmail: true,
    showPhone: true,
    isVerified: true,
    rating: 4.7,
    reviewCount: 54,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  },
];

const INITIAL_NEEDS: Omit<Need, 'id' | 'createdAt' | 'updatedAt' | 'searchKeywords'>[] = [
  {
    ownerId: 'customer_demo_1',
    ownerName: 'Hamza Khan',
    ownerEmail: 'hamza.k@example.com',
    title: 'Used Toyota Corolla 2018-2022 in Good Condition',
    category: 'vehicles',
    country: 'Pakistan',
    city: 'Islamabad',
    description:
      'Looking for a well-maintained Toyota Corolla (GLi or Altis) model 2018 onwards with genuine mileage under 75,000 km. Must have clean inspection record, genuine body parts, and valid registration papers ready for transfer.',
    budgetMin: 3500000,
    budgetMax: 4800000,
    currency: 'PKR',
    preferredCondition: 'Used - Excellent',
    urgency: 'high',
    status: 'OPEN',
    offersCount: 2,
    contactPreference: 'NeedFinder Messaging',
  },
  {
    ownerId: 'customer_demo_2',
    ownerName: 'Sarah Jenkins',
    ownerEmail: 'sarah.j@techventures.io',
    title: 'Senior Full-Stack React & Node.js Developer Needed',
    category: 'remote-work',
    country: 'United States',
    city: 'San Francisco',
    description:
      'We are looking for an experienced full-stack developer to assist our team in completing an analytics platform. Must have deep experience with React 19, TypeScript, PostgreSQL, and REST/GraphQL APIs. Long-term contract with 30-40 hours per week.',
    budgetMin: 4500,
    budgetMax: 7500,
    currency: 'USD',
    urgency: 'medium',
    status: 'OPEN',
    offersCount: 3,
    contactPreference: 'In-app Chat & Email',
  },
  {
    ownerId: 'customer_demo_3',
    ownerName: 'Rashid Al-Maktoum',
    ownerEmail: 'rashid.am@example.com',
    title: 'Modern 2-Bedroom Furnished Apartment in Downtown / Marina',
    category: 'property',
    country: 'United Arab Emirates',
    city: 'Dubai',
    description:
      'Family relocating to Dubai seeking a fully furnished 2-bedroom apartment with balcony and pool access. Walking distance to metro preferred. Ready to move in by next month. Annual lease contract.',
    budgetMin: 110000,
    budgetMax: 155000,
    currency: 'AED',
    urgency: 'high',
    status: 'OPEN',
    offersCount: 1,
    contactPreference: 'Direct Phone & In-app',
  },
  {
    ownerId: 'customer_demo_4',
    ownerName: 'Elena Rostova',
    ownerEmail: 'elena.rostova@designhaus.de',
    title: 'Bulk Organic Cotton Hoodies & T-Shirts Supplier',
    category: 'clothing',
    country: 'Germany',
    city: 'Berlin',
    description:
      'Sustainable fashion label looking for verified garment manufacturer capable of producing 500-1000 units of custom heavyweight French Terry hoodies with embroidery and custom tags. GOTS certification required.',
    budgetMin: 6000,
    budgetMax: 12000,
    currency: 'EUR',
    urgency: 'medium',
    status: 'OPEN',
    offersCount: 0,
    contactPreference: 'NeedFinder Messaging',
  },
  {
    ownerId: 'customer_demo_5',
    ownerName: 'David Chen',
    ownerEmail: 'dchen@asiaimports.sg',
    title: 'Refurbished MacBook Pro M1/M2 Bulk Lot (20+ units)',
    category: 'electronics',
    country: 'Singapore',
    city: 'Singapore',
    description:
      'Corporate equipment purchase: Need 20 units of Apple MacBook Pro 14" (M1 Pro or M2 Pro, 16GB RAM, 512GB SSD). Grade A condition with OEM chargers and warranty.',
    budgetMin: 22000,
    budgetMax: 30000,
    currency: 'SGD',
    urgency: 'high',
    status: 'OPEN',
    offersCount: 2,
    contactPreference: 'In-app Offer',
  },
  {
    ownerId: 'customer_demo_6',
    ownerName: 'Marcus Bradley',
    ownerEmail: 'marcus@bradleytravel.co.uk',
    title: 'Private Chauffeur & Van Hire for Corporate Tour in London',
    category: 'services',
    country: 'United Kingdom',
    city: 'London',
    description:
      'Require luxury Mercedes V-Class or similar with professional licensed chauffeur for 5 consecutive days of corporate meetings across Central London and Heathrow airport transfers.',
    budgetMin: 2000,
    budgetMax: 3500,
    currency: 'GBP',
    urgency: 'medium',
    status: 'OPEN',
    offersCount: 1,
    contactPreference: 'In-app Chat',
  },
  {
    ownerId: 'customer_demo_7',
    ownerName: 'Chloe Dupont',
    ownerEmail: 'c.dupont@voyage.fr',
    title: 'Bespoke 10-Day Safari Itinerary & Local Guide in Kenya',
    category: 'travel',
    country: 'Kenya',
    city: 'Nairobi',
    description:
      'Planning a photography safari for 4 adults covering Masai Mara, Amboseli, and Lake Nakuru. Seeking licensed safari operator with 4x4 land cruiser, expert spotter guide, and luxury tented lodge bookings.',
    budgetMin: 7000,
    budgetMax: 11000,
    currency: 'USD',
    urgency: 'low',
    status: 'OPEN',
    offersCount: 1,
    contactPreference: 'In-app Messaging',
  },
  {
    ownerId: 'customer_demo_8',
    ownerName: 'Tariq Mahmood',
    ownerEmail: 'tariq.m@contractors.ae',
    title: 'Experienced Civil Engineering Site Inspector',
    category: 'jobs',
    country: 'Saudi Arabia',
    city: 'Riyadh',
    description:
      'Hiring certified site engineer with 7+ years in commercial concrete and foundation inspection for an ongoing infrastructure project in northern Riyadh. Full-time 6-month placement with accommodation provided.',
    budgetMin: 18000,
    budgetMax: 26000,
    currency: 'SAR',
    urgency: 'urgent',
    status: 'OPEN',
    offersCount: 0,
    contactPreference: 'Direct Phone & Profile',
  },
];

const INITIAL_LISTINGS: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'searchKeywords'>[] = [
  {
    providerId: 'prov_apex_motors',
    providerName: 'Apex Global Motors & Logistics',
    title: '2021 Toyota Land Cruiser V8 - GCC Specs (Verified Inspection)',
    category: 'vehicles',
    description:
      'Pristine condition Land Cruiser with full agency service history. Zero accidents, sunroof, 360 camera, leather interior, and worldwide freight handling available.',
    price: 68000,
    currency: 'USD',
    country: 'United Arab Emirates',
    city: 'Dubai',
    condition: 'Used - Mint Condition',
    availability: 'In Stock - Ready for Export',
    active: true,
  },
  {
    providerId: 'prov_cloudcraft_solutions',
    providerName: 'CloudCraft Digital & Engineering',
    title: 'Custom Web & Mobile Application Development (Sprint Package)',
    category: 'services',
    description:
      'Complete 2-week MVP development sprint covering architecture, responsive React UI, Firebase / Cloud DB, authentication, and production deployment with source code handover.',
    price: 3500,
    currency: 'USD',
    country: 'United Kingdom',
    city: 'London',
    condition: 'Custom Service',
    availability: 'Immediate Onboarding',
    active: true,
  },
  {
    providerId: 'prov_skyline_properties',
    providerName: 'Skyline Elite Real Estate',
    title: 'Luxury 2-Bedroom Sky Residence with City View',
    category: 'property',
    description:
      'Furnished luxury high-floor apartment with floor-to-ceiling panoramic windows, 24/7 concierge, state-of-the-art gym, infinity pool, and valet parking.',
    price: 3800,
    currency: 'USD',
    country: 'United States',
    city: 'New York',
    condition: 'Turnkey Luxury',
    availability: 'Available Immediately',
    active: true,
  },
  {
    providerId: 'prov_apex_electronics',
    providerName: 'OmniTech Components & Hardware',
    title: 'Apple iPad Air & Pro Wholesale Lots - Direct Factory Sealed',
    category: 'electronics',
    description:
      'Authentic Apple stock with global warranty. Available in quantities from 10 to 500 units. Express DHL/FedEx insured shipping with customs documentation.',
    price: 490,
    currency: 'USD',
    country: 'Singapore',
    city: 'Singapore',
    condition: 'Brand New - Sealed Box',
    availability: 'Ready to Ship',
    active: true,
  },
];

export async function seedInitialDataIfEmpty(): Promise<boolean> {
  try {
    const existingSnap = await getDocs(query(collection(db, 'needs'), limit(2)));
    if (!existingSnap.empty) {
      return false; // Already seeded
    }

    // Seed Providers
    for (const prov of INITIAL_PROVIDERS) {
      await setDoc(doc(db, 'providerProfiles', prov.id), prov);
    }

    // Seed Needs
    let i = 1;
    for (const need of INITIAL_NEEDS) {
      const id = `need_seed_${i++}`;
      const searchKeywords = generateSearchKeywords(
        `${need.title} ${need.description} ${need.category} ${need.country} ${need.city}`
      );
      await setDoc(doc(db, 'needs', id), {
        ...need,
        id,
        searchKeywords,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    // Seed Listings
    let j = 1;
    for (const listing of INITIAL_LISTINGS) {
      const id = `listing_seed_${j++}`;
      const searchKeywords = generateSearchKeywords(
        `${listing.title} ${listing.description} ${listing.category} ${listing.country} ${listing.city} ${listing.providerName}`
      );
      await setDoc(doc(db, 'listings', id), {
        ...listing,
        id,
        searchKeywords,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    return true;
  } catch (err) {
    console.error('Error seeding initial data:', err);
    return false;
  }
}
