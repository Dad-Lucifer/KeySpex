export interface ServiceItemData {
  index: string;
  title: string;
  tagline: string;          // short "For:" line — one sentence
  description: string;      // body paragraph shown on card
  benefit: string;          // benefit line from services.md
  tags: string[];           // scope highlight pills
  category: "website" | "marketing" | "creative";
  href: string;
}

export const servicesData: ServiceItemData[] = [
  // ── A. Website & Business Solutions ─────────────────────────────────────
  {
    index: "01",
    title: "Business Portfolio Website",
    tagline: "For businesses that are hard to find, or hard to trust, online.",
    description:
      "A professional website that presents your services, work and contact details in one credible place, so potential customers can learn about you before they get in touch.",
    benefit: "A clear, credible first impression.",
    tags: ["Responsive Design", "Mobile-First", "Fast Load"],
    category: "website",
    href: "#contact",
  },
  {
    index: "02",
    title: "Business Dashboard",
    tagline: "For businesses whose data is scattered across sheets and notes.",
    description:
      "A digital interface that organises your business data and lets you monitor the metrics you choose to track. Features are agreed as part of your project scope.",
    benefit: "Better visibility to support everyday decisions.",
    tags: ["Custom Portal", "Data Organisation", "Easy Reporting"],
    category: "website",
    href: "#contact",
  },
  {
    index: "03",
    title: "Store Management System",
    tagline: "For shop owners who track stock and sales by hand.",
    description:
      "A digital system that helps offline store owners move away from manual records and keep inventory and revenue information in one place. An internal tool for running your shop — not a customer-facing online store.",
    benefit: "A clearer picture of your stock and sales.",
    tags: ["Inventory Tracking", "Sales Records", "Offline Store"],
    category: "website",
    href: "#contact",
  },
  // ── B. Digital Visibility & Marketing ───────────────────────────────────
  {
    index: "04",
    title: "Google Business SEO",
    tagline: "For local businesses with an incomplete or outdated Google listing.",
    description:
      "We help improve your Google Business Profile so your business information is accurate, complete and easy for people to understand — giving you a stronger local online presence.",
    benefit: "A stronger local online presence.",
    tags: ["Google Profile", "Local SEO", "Accurate Listing"],
    category: "marketing",
    href: "#contact",
  },
  {
    index: "05",
    title: "Social Media Marketing",
    tagline: "For brands whose posts look different every time, or stop altogether.",
    description:
      "Consistent, on-brand content that presents your products and services and builds recognition and engagement with your audience — so your feed works for you every day.",
    benefit: "Stronger brand recognition over time.",
    tags: ["On-Brand Content", "Consistent Posting", "Audience Growth"],
    category: "marketing",
    href: "#contact",
  },
  {
    index: "06",
    title: "Social Media Campaigns",
    tagline: "For launches, offers and seasons that deserve more than a single post.",
    description:
      "Coordinated promotional activity built around a defined business goal and run over an agreed period — whether a product launch, festival offer, seasonal push or brand-awareness drive. Goal → Plan → Create → Launch.",
    benefit: "A promotion with a plan behind it.",
    tags: ["Campaign Strategy", "Defined Goal", "Coordinated Launch"],
    category: "marketing",
    href: "#contact",
  },
  // ── C. Creative & Content ────────────────────────────────────────────────
  {
    index: "07",
    title: "Graphic Designing",
    tagline: "For businesses whose materials look mismatched or unfinished.",
    description:
      "Professional design that improves how your business is presented and keeps your communication consistent — across social media creatives, promotional graphics, banners and other marketing materials.",
    benefit: "A polished, cohesive look across your brand.",
    tags: ["Social Creatives", "Promo Graphics", "Brand Consistency"],
    category: "creative",
    href: "#contact",
  },
  {
    index: "08",
    title: "Video Editing",
    tagline: "For businesses with footage but no polished way to share it.",
    description:
      "Edited videos that present your products, services, promotional messages and brand story through engaging visual content — ready to share across your channels.",
    benefit: "Clear, engaging content for your channels.",
    tags: ["Product Videos", "Brand Story", "Promo Reels"],
    category: "creative",
    href: "#contact",
  },
];
