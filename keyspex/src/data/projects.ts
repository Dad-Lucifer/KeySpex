// ============================================================================
// KEYSPEX CURATED WORK ARCHIVE
// ============================================================================
// Real showcase portfolio covering Websites & Systems, Instagram Creatives,
// and Kinetic Reels & Motion Work.
// ============================================================================

export type ProjectType = "website" | "instagram" | "reel"

export interface ProjectData {
  id: string
  type: ProjectType
  title: string
  client: string
  category: string
  tagline: string
  description: string
  impactMetric: { label: string; value: string }
  tags: string[]
  featured?: boolean
  isPlaceholder?: boolean
  href: string
  coverImage?: string

  // Specialized metadata
  websiteDetails?: {
    domain: string
    speedScore: number
    lcp: string
    cls: string
    techStack: string[]
    themeColor: string
    accentColor: string
    headline: string
    sub: string
    previewType: "architecture" | "ecommerce" | "pos" | "clinical"
    heroImage: string
    secondaryImage?: string
  }

  instagramDetails?: {
    handle: string
    likes: string
    saves: string
    carouselSlides: number
    caption: string
    brandTone: string
    palette: string[]
    theme: "coffee" | "furniture" | "fintech"
    slides: Array<{
      image: string
      title: string
      subtitle: string
      note?: string
    }>
  }

  reelDetails?: {
    views: string
    shares: string
    audioTitle: string
    duration: string
    resolution: string
    theme: "fashion" | "cafe" | "skincare"
    posterImage: string
  }
}

export const projectsData: ProjectData[] = [
  // ── 01. WEBSITES & DIGITAL SYSTEMS ───────────────────────────────────────
  {
    id: "web-apex",
    type: "website",
    title: "Apex Spatial Architecture",
    client: "Apex Design & Urban Planning Studio",
    category: "Website & Digital Identity",
    tagline: "Ultra-minimal editorial portfolio for an award-winning architectural firm.",
    description:
      "Engineered with Japanese-Scandinavian minimalist aesthetics, sub-300ms initial load, interactive project lookbook, and high-precision fluid typography.",
    impactMetric: { label: "Client Inquiries", value: "+210% MoM" },
    tags: ["Responsive Portfolio", "Sub-300ms LCP", "Zero Layout Shift", "Dark Luxury"],
    featured: true,
    href: "#contact",
    websiteDetails: {
      domain: "apex-spatial.studio",
      speedScore: 99,
      lcp: "0.28s",
      cls: "0.00",
      techStack: ["Next.js", "Tailwind CSS", "Motion API", "Vercel Edge"],
      themeColor: "#0C0E14",
      accentColor: "#0866F5",
      headline: "Monolithic Geometry. Human Purpose.",
      sub: "Bespoke architectural structures and interior environments crafted across India.",
      previewType: "architecture",
      heroImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      secondaryImage: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    id: "web-veloce",
    type: "website",
    title: "Veloce Lifestyle Apparel",
    client: "Veloce Streetwear & Active Brand",
    category: "E-Commerce Experience",
    tagline: "Kinetic D2C digital storefront with seamless mobile checkout.",
    description:
      "Custom product reveal transitions, instant cart sync, headless store speed, and fluid product lookbooks optimized for high conversion.",
    impactMetric: { label: "Cart Conversion", value: "4.8% (Top 5%)" },
    tags: ["E-Commerce", "Instant Checkout", "Mobile-First", "High Conversion"],
    featured: false,
    href: "#contact",
    websiteDetails: {
      domain: "veloce-wear.in",
      speedScore: 98,
      lcp: "0.34s",
      cls: "0.00",
      techStack: ["Shopify Headless", "React", "Tailwind CSS"],
      themeColor: "#11141E",
      accentColor: "#5B9BFF",
      headline: "Built for Motion. Designed for Form.",
      sub: "Technical apparel engineered with performance textiles for everyday city life.",
      previewType: "ecommerce",
      heroImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80",
      secondaryImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    id: "web-kalyan",
    type: "website",
    title: "Kalyan Store Operating POS",
    client: "Kalyan Multi-Brand Offline Retail",
    category: "Custom Business Tool",
    tagline: "Internal shop management & POS system replacing manual registers.",
    description:
      "A purpose-built internal dashboard for offline shop owners to monitor live inventory, track staff counter sales, and maintain audit-ready financial ledgers.",
    impactMetric: { label: "Inventory Accuracy", value: "99.8% Synced" },
    tags: ["Offline Store POS", "Inventory Management", "Realtime Ledger", "Internal Tool"],
    featured: false,
    href: "#contact",
    websiteDetails: {
      domain: "pos.kalyan-retail.internal",
      speedScore: 100,
      lcp: "0.19s",
      cls: "0.00",
      techStack: ["React", "PostgreSQL", "Tailwind CSS"],
      themeColor: "#090B10",
      accentColor: "#10B981",
      headline: "Offline Store Ledger & Inventory Hub",
      sub: "Real-time stock tracking across 1,480 SKUs with automated shift revenue reconciliation.",
      previewType: "pos",
      heroImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    id: "web-pulse",
    type: "website",
    title: "Pulse Health & Wellness Portal",
    client: "Pulse Specialty Clinic Network",
    category: "Web Platform & Booking",
    tagline: "Multi-location clinic scheduling & patient service platform.",
    description:
      "Clean clinical presence with instant WhatsApp appointment confirmations, Google Maps local profile integration, and streamlined service packages.",
    impactMetric: { label: "Booking No-Shows", value: "-64% Reduced" },
    tags: ["Clinical Portal", "Appointment Engine", "Google Maps Sync", "SEO Optimized"],
    featured: false,
    href: "#contact",
    websiteDetails: {
      domain: "pulsehealth.clinic",
      speedScore: 99,
      lcp: "0.31s",
      cls: "0.00",
      techStack: ["React", "Tailwind CSS", "WhatsApp API"],
      themeColor: "#0E131F",
      accentColor: "#0866F5",
      headline: "Specialized Healthcare. Made Accessible.",
      sub: "Book verified doctor consultations and preventive diagnostics with instant confirmation.",
      previewType: "clinical",
      heroImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
    },
  },

  // ── 02. INSTAGRAM CREATIVES & BRAND GRIDS ────────────────────────────────
  {
    id: "ig-coffee",
    type: "instagram",
    title: "Artisan Specialty Coffee Co.",
    client: "Artisan Roasters & Brew Bar",
    category: "Instagram Visual Identity",
    tagline: "Cohesive 9-grid aesthetic campaign with custom editorial typography.",
    description:
      "Designed a recognizable visual language across social posts: warm earthen tones, micro-origin tasting note cards, and cohesive festival launch carousels.",
    impactMetric: { label: "Organic Engagement", value: "3.4x Higher" },
    tags: ["Brand Identity", "Editorial Typography", "Social Creative", "Cohesive Feed"],
    featured: false,
    href: "#contact",
    instagramDetails: {
      handle: "artisan.roasters",
      likes: "3,480",
      saves: "942",
      carouselSlides: 3,
      caption: "Origin Series 04 // Single-estate Chikmagalur washed roast. Notes of caramelized fig, toasted hazelnut and 70% dark cacao.",
      brandTone: "Warm Earthen Luxury",
      palette: ["#2B1B17", "#9E7B5C", "#E8D8C8", "#FAF7F2"],
      theme: "coffee",
      slides: [
        {
          image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1000&q=80",
          title: "ORIGIN 04: CHIKMAGALUR",
          subtitle: "Single-Estate Washed Arabica",
          note: "ALTITUDE 1,450M • HARVEST 2026",
        },
        {
          image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80",
          title: "TASTING PROFILE",
          subtitle: "Caramelized Fig & Cacao",
          note: "ACIDITY: MEDIUM-BRIGHT",
        },
        {
          image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80",
          title: "SLOW ROAST CRAFT",
          subtitle: "Small-Batch Cast Iron Drum",
          note: "BREW GUIDE: V60 / AEROPRESS",
        },
      ],
    },
  },
  {
    id: "ig-furniture",
    type: "instagram",
    title: "Nordic Living — Festival Drop",
    client: "Nordic Living Home & Decor",
    category: "Campaign Carousel Design",
    tagline: "Bauhaus-inspired promotional campaign with minimal geometric silhouettes.",
    description:
      "Coordinated launch campaign for seasonal furniture drop: unified color cadence, clean dimensional grids, and high-engagement swipe carousels.",
    impactMetric: { label: "Saves & Shares", value: "1,820 Saves" },
    tags: ["Carousel Design", "Promotional Campaign", "Bauhaus Grid", "High-Engagement"],
    featured: false,
    href: "#contact",
    instagramDetails: {
      handle: "nordicliving.india",
      likes: "4,910",
      saves: "1,820",
      carouselSlides: 3,
      caption: "The Autumn Silhouette Collection. Minimalist Scandinavian oak and brushed aluminum crafted for modern open-plan living.",
      brandTone: "Nordic Architectural Chic",
      palette: ["#1C1E24", "#7F8C8D", "#D5DBDB", "#F4F6F6"],
      theme: "furniture",
      slides: [
        {
          image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80",
          title: "THE SILHOUETTE CHAIR",
          subtitle: "Solid Oiled European Oak",
          note: "HAND-CRAFTED JOINERY",
        },
        {
          image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80",
          title: "OPEN LIVING CADENCE",
          subtitle: "Calm Textures & Soft Daylight",
          note: "AUTUMN CAPSULE 2026",
        },
        {
          image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
          title: "TACTILE SIMPLICITY",
          subtitle: "Raw Linen & Matte Stone",
          note: "AVAILABLE IN-STORE & ONLINE",
        },
      ],
    },
  },
  {
    id: "ig-fintech",
    type: "instagram",
    title: "Vanguard Capital — Visual Explainer",
    client: "Vanguard Wealth Management",
    category: "Information Design & Graphics",
    tagline: "High-trust financial infographics simplifying complex investments.",
    description:
      "Transformed dense wealth planning concepts into elegant, easily-digestible social carousels that established executive credibility and customer trust.",
    impactMetric: { label: "Post Retention", value: "88% Swipe-Through" },
    tags: ["Infographics", "Executive Branding", "Data Visualization", "Trust-First"],
    featured: false,
    href: "#contact",
    instagramDetails: {
      handle: "vanguard.advisory",
      likes: "2,640",
      saves: "1,290",
      carouselSlides: 3,
      caption: "Asset Allocation in 2026: Why balanced debt-equity indexing beats emotional market speculation. Swipe for the data breakdown.",
      brandTone: "High-Trust Corporate Obsidian",
      palette: ["#090B10", "#0866F5", "#5B9BFF", "#FFFFFF"],
      theme: "fintech",
      slides: [
        {
          image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?auto=format&fit=crop&w=1000&q=80",
          title: "ASSET ALLOCATION 2026",
          subtitle: "Systematic Wealth Rebalancing",
          note: "PORTFOLIO STABILITY REPORT",
        },
        {
          image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1000&q=80",
          title: "VOLATILITY RESILIENCE",
          subtitle: "Downside Protection Strategies",
          note: "HISTORICAL 10-YEAR ALPHA",
        },
        {
          image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1000&q=80",
          title: "INDEX COMPOUNDING",
          subtitle: "Disciplined Long-Term Horizon",
          note: "AUDITED FINANCIAL FRAMEWORK",
        },
      ],
    },
  },

  // ── 03. REELS & KINETIC MOTION ───────────────────────────────────────────
  {
    id: "reel-fashion",
    type: "reel",
    title: "Monochrome Studio Launch Reel",
    client: "Monochrome Luxury Atelier",
    category: "Kinetic Reel & Sound Design",
    tagline: "Fast-paced 9:16 product reveal reel with rhythm-matched kinetic typography.",
    description:
      "Crafted for maximum visual retention: dynamic focal zooms, seamless cuts synced to 128 BPM sub-bass beats, and high-fashion color grading.",
    impactMetric: { label: "Total Views", value: "184K+ Views" },
    tags: ["Kinetic Typography", "9:16 Video", "Sound Design", "Viral Reach"],
    featured: false,
    href: "#contact",
    reelDetails: {
      views: "184,200",
      shares: "8,920",
      audioTitle: "Original Mix — KeySpex Audio Lab",
      duration: "0:24",
      resolution: "4K UHD 60fps",
      theme: "fashion",
      posterImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80",
    },
  },
  {
    id: "reel-cafe",
    type: "reel",
    title: "Caffè Nero — Behind The Craft",
    client: "Caffè Nero Specialty Bar",
    category: "Cinematic Atmosphere Reel",
    tagline: "Macro 4K espresso extraction & beans origin story reel.",
    description:
      "Captivating behind-the-scenes sensory cinematography designed to drive foot-traffic and online delivery orders for a premier specialty roastery.",
    impactMetric: { label: "Store Footfall", value: "+38% Weekend Surge" },
    tags: ["Macro Cinematography", "Storytelling", "Color Graded", "Hospitality"],
    featured: false,
    href: "#contact",
    reelDetails: {
      views: "248,500",
      shares: "14,300",
      audioTitle: "Analog Warmth // Low-Fi Espresso Tape",
      duration: "0:32",
      resolution: "4K UHD 60fps",
      theme: "cafe",
      posterImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1000&q=80",
    },
  },
  {
    id: "reel-skincare",
    type: "reel",
    title: "Aura Botanical Skincare Drop",
    client: "Aura Clean Cosmetics",
    category: "Product Launch Reel",
    tagline: "High-gloss cosmetic texture reveal with 3D fluid motion graphics.",
    description:
      "Ultra-crisp macro texture shots, kinetic ingredient reveals, and sleek clinical typography engineered for paid Instagram & Meta performance ad spend.",
    impactMetric: { label: "Ad ROAS", value: "4.2x Return on Ad Spend" },
    tags: ["Performance Creative", "Product Video", "High-Gloss Motion", "D2C Growth"],
    featured: false,
    href: "#contact",
    reelDetails: {
      views: "112,400",
      shares: "6,410",
      audioTitle: "Ethereal Ambient // Botanical Pulse",
      duration: "0:18",
      resolution: "4K UHD 60fps",
      theme: "skincare",
      posterImage: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80",
    },
  },
]

