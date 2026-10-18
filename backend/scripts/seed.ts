import 'dotenv/config';
import { FieldValue } from 'firebase-admin/firestore';
import { db } from '../src/config/firebase.js';
import { env } from '../src/config/env.js';

// Guard against accidentally seeding production.
if (env.isProd && !process.env['ALLOW_PROD_SEED']) {
  console.error('Refusing to seed production without ALLOW_PROD_SEED=1');
  process.exit(1);
}

const services = [
  {
    slug: 'website-development',
    number: '01',
    title: 'Website Development',
    description:
      "Responsive, carefully crafted websites designed to communicate a business's value, establish trust, and convert visitors into customers.",
    order: 1,
  },
  {
    slug: 'custom-digital-solutions',
    number: '02',
    title: 'Custom Digital Solutions',
    description:
      'Purpose-built digital products and business tools designed around customer needs and business workflows.',
    order: 2,
  },
  {
    slug: 'digital-growth-optimization',
    number: '03',
    title: 'Digital Growth & Optimization',
    description: 'Practical improvements to digital presence, usability, and customer experience.',
    order: 3,
  },
];

const categories = [
  'website-development',
  'custom-digital-solutions',
  'digital-growth-optimization',
] as const;

const projects = [1, 2, 3].map((n) => ({
  slug: `placeholder-project-${n}`,
  title: `Sample Project ${n}`,
  category: categories[n - 1]!,
  summary: 'A placeholder entry to be replaced with real KeySpex work.',
  description: '',
  coverImageUrl: null,
  coverImageAlt: 'Placeholder artwork for a sample project',
  gallery: [],
  projectUrl: null,
  isPlaceholder: true,
  published: true,
  order: n,
}));

console.log('Seeding database...');

const batch = db.batch();

for (const { slug, ...s } of services) {
  batch.set(db.collection('services').doc(slug), {
    ...s,
    published: true,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

for (const { slug, ...p } of projects) {
  batch.set(db.collection('projects').doc(slug), {
    slug,
    ...p,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
}

batch.set(db.collection('siteSettings').doc('public'), {
  contactEmail: null,
  socialLinks: [],
  updatedAt: FieldValue.serverTimestamp(),
});

await batch.commit();
console.log('Seed complete (3 services + 3 placeholder projects + siteSettings).');
