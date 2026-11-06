export interface ToneProduct {
  id: string;
  slug: string;
  title: string;
  category: string;
  scent: string;
  scentNotes: string;
  scentColor: string;
  price: number;
  compareAtPrice?: number;
  badge?: string;
  image: string;
  hoverImage?: string;
  volume?: string;
  isSoldOut?: boolean;
}

export const TONE_FEATURED_SETS: ToneProduct[] = [
  {
    id: 'tone-fresh-routine',
    slug: 'fresh-scent-layering-routine',
    title: 'Fresh Scent Layering Routine',
    category: 'Scent Layering Routine',
    scent: 'Fresh',
    scentNotes: 'Mineral Spring',
    scentColor: '#4A7C59',
    price: 51,
    compareAtPrice: 59,
    badge: 'Save $8',
    image: 'https://tone.shop/cdn/shop/files/TONE_Fresh_Collection_1x1_1500.jpg?crop=center&height=1949&v=1788994784&width=1500',
    hoverImage: 'https://tone.shop/cdn/shop/files/TONE-DTC-SET-PDP-Fresh-Scent.png?crop=center&height=2599&v=1790959281&width=2000',
    volume: '3-Piece Set',
  },
  {
    id: 'tone-coconut-routine',
    slug: 'coconut-scent-layering-routine',
    title: 'Coconut Scent Layering Routine',
    category: 'Scent Layering Routine',
    scent: 'Coconut',
    scentNotes: 'Warm Vanilla & Coconut',
    scentColor: '#C49A6C',
    price: 51,
    compareAtPrice: 59,
    badge: 'Save $8',
    image: 'https://tone.shop/cdn/shop/files/TONE_Coconut_Collection_1x1_1500.jpg?crop=center&height=1949&v=1788994784&width=1500',
    hoverImage: 'https://tone.shop/cdn/shop/files/TONE-DTC-SET-PDP-Coconut-Scent.png?crop=center&height=2599&v=1790959303&width=2000',
    volume: '3-Piece Set',
  },
  {
    id: 'tone-otgc-6pk',
    slug: 'on-the-go-fragrance-set-6-pack',
    title: 'On The Go Fragrance Set 6 Pack',
    category: 'Fragrance Set',
    scent: 'Variety Pack',
    scentNotes: 'All 6 Signature Scents',
    scentColor: '#1A1A1A',
    price: 60,
    compareAtPrice: 75,
    badge: 'Save $15',
    image: 'https://tone.shop/cdn/shop/files/TONE-AMZ-PDP-6PK-3.jpg?crop=center&height=2599&v=1790639705&width=2000',
    hoverImage: 'https://tone.shop/cdn/shop/files/AMZ-6pk-otgc-set-_90020_-PDP-in-and-out-Grey.png?crop=center&height=2599&v=1793310011&width=2000',
    volume: '6 × Rollerballs',
  },
  {
    id: 'tone-deo-set',
    slug: 'build-your-own-deo-set',
    title: 'Build Your Own Deo Set',
    category: 'Deodorant Bundle',
    scent: 'Variety',
    scentNotes: 'Custom 3-Pack',
    scentColor: '#3D5A80',
    price: 30,
    compareAtPrice: 36,
    badge: 'Save $6',
    image: 'https://tone.shop/cdn/shop/files/TONE-DEO-Landing-Page-HERO-3_ecd618c4-53e2-4602-a9c7-8497edea6d8f.webp?crop=center&height=1600&v=1791297960&width=2000',
    hoverImage: 'https://tone.shop/cdn/shop/files/TONE-DTC-SET-PDP-Deo.png?crop=center&height=2599&v=1790959317&width=2000',
    volume: '3 × 75g Sticks',
  },
];

export const TONE_MOSAIC_SCENTS = [
  {
    id: 'coconut',
    name: 'Coconut',
    image: 'https://tone.shop/cdn/shop/files/TONE-SHOP-BY-SCENT-COCONUT.jpg?crop=center&height=1696&v=1787957326&width=2528',
    url: '#scent-coconut',
  },
  {
    id: 'fresh',
    name: 'Fresh',
    image: 'https://tone.shop/cdn/shop/files/TONE-SHOP-BY-SCENT-FRESH.jpg?crop=center&height=1696&v=1787957327&width=2528',
    url: '#scent-fresh',
  },
  {
    id: 'vanilla',
    name: 'Vanilla',
    image: 'https://tone.shop/cdn/shop/files/TONE-SHOP-BY-SCENT-VANILLA.jpg?crop=center&height=1696&v=1787957326&width=2528',
    url: '#scent-vanilla',
  },
  {
    id: 'eucalyptus',
    name: 'Eucalyptus',
    image: 'https://tone.shop/cdn/shop/files/TONE-SHOP-BY-SCENT-EUCA.jpg?crop=center&height=1696&v=1787957326&width=2528',
    url: '#scent-eucalyptus',
  },
];

export const TONE_BODY_WASH_PRODUCTS: ToneProduct[] = [
  {
    id: 'tone-bw-island-breeze',
    slug: 'tone-body-wash-island-breeze',
    title: 'Body Wash',
    category: 'Body Wash',
    scent: 'Island Breeze',
    scentNotes: 'Vanilla Bean + Pistachio',
    scentColor: '#E6A26B',
    price: 12,
    image: 'https://tone.shop/cdn/shop/files/tone-island-breeze-bodywash-front-v2.webp?crop=center&height=2599&v=1781254709&width=2000',
    hoverImage: 'https://tone.shop/cdn/shop/files/tone-bodywash-island-breeze-2.webp?crop=center&height=3119&v=1781043080&width=2400',
    volume: '300ml',
  },
  {
    id: 'tone-bw-sunrise',
    slug: 'tone-sunrise-body-wash',
    title: 'Body Wash',
    category: 'Body Wash',
    scent: 'Sunrise',
    scentNotes: 'Crushed Orange',
    scentColor: '#D85A2A',
    price: 12,
    image: 'https://tone.shop/cdn/shop/files/tone-BodyWash-Sunrise_Front.webp?crop=center&height=2599&v=1771702979&width=2000',
    hoverImage: 'https://tone.shop/cdn/shop/files/B0HPF8H7PP.PT01.jpg?crop=center&height=2599&v=1793747355&width=2000',
    volume: '300ml',
  },
];

export const TONE_DEO_PRODUCTS: ToneProduct[] = [
  {
    id: 'tone-deo-discovery',
    slug: 'deodorant-discovery-pack',
    title: 'Deodorant Discovery Pack',
    category: 'Deodorant',
    scent: 'Four Iconic Scents',
    scentNotes: 'Coconut, Fresh, Vanilla, & Eucalyptus',
    scentColor: '#2B2B2B',
    price: 36,
    compareAtPrice: 48,
    badge: 'Save $12',
    image: 'https://tone.shop/cdn/shop/files/tone-deodorant-discovery-pack.webp?crop=center&height=2599&v=1783629273&width=2000',
    hoverImage: 'https://tone.shop/cdn/shop/files/B0HPFHX8DT.PT02.jpg?crop=center&height=2599&v=1793747538&width=2000',
    volume: '4 × 75g Sticks',
  },
  {
    id: 'tone-deo-island-breeze',
    slug: 'tone-deodorant-island-breeze',
    title: 'Deodorant',
    category: 'Deodorant',
    scent: 'Island Breeze',
    scentNotes: 'Vanilla Bean + Pistachio',
    scentColor: '#E6A26B',
    price: 12,
    image: 'https://tone.shop/cdn/shop/files/tone-deodorant-island-breeze-grey.webp?crop=center&height=3119&v=1781044124&width=2400',
    hoverImage: 'https://tone.shop/cdn/shop/files/tone-deodorant-island-breeze-2_7b0337f7-1ac0-438e-b1e2-21a3a7b941fc.webp?crop=center&height=3119&v=1781042846&width=2400',
    volume: '75g',
  },
];

export const TONE_ICONS = [
  {
    title: 'ICONIC SCENTS',
    text: 'Designed with luxurious scents to make you smell great.',
  },
  {
    title: 'NATURAL',
    text: 'Formulated with natural and clean ingredients, always paraben-free & dermatologist-tested',
  },
  {
    title: 'BUILT TO LAYER',
    text: 'Crafted to be long-lasting, effective, and make an actual difference',
  },
];

export const TONE_PILLS = [
  'SHOP ALL',
  'SETS',
  'DEODORANT',
  'BODY WASH',
  'COLOGNE',
  'LIP BALM',
  'LOTION',
];
