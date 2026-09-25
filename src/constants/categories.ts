import { CategoryInfo } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    name: 'Products',
    slug: 'products',
    iconName: 'Package',
    description: 'Buy & sell products',
    active: true,
  },
  {
    name: 'Services',
    slug: 'services',
    iconName: 'Wrench',
    description: 'Find skilled providers',
    active: true,
  },
  {
    name: 'Property',
    slug: 'property',
    iconName: 'Building2',
    description: 'Homes & commercial',
    active: true,
  },
  {
    name: 'Vehicles',
    slug: 'vehicles',
    iconName: 'Car',
    description: 'Cars & transportation',
    active: true,
  },
  {
    name: 'Jobs',
    slug: 'jobs',
    iconName: 'Briefcase',
    description: 'Jobs & opportunities',
    active: true,
  },
  {
    name: 'Remote Work',
    slug: 'remote-work',
    iconName: 'Globe',
    description: 'Work from anywhere',
    active: true,
  },
  {
    name: 'Clothing',
    slug: 'clothing',
    iconName: 'Shirt',
    description: 'Fashion & apparel',
    active: true,
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    iconName: 'Smartphone',
    description: 'Tech & devices',
    active: true,
  },
  {
    name: 'Travel',
    slug: 'travel',
    iconName: 'Plane',
    description: 'Travel-related needs',
    active: true,
  },
  {
    name: 'Other Needs',
    slug: 'other-needs',
    iconName: 'Compass',
    description: 'Tell us what you need',
    active: true,
  },
];

export const CATEGORY_MAP = new Map(CATEGORIES.map((c) => [c.slug, c]));
