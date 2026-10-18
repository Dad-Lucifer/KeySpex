export type ServiceInterest =
  | 'website-development'
  | 'custom-digital-solutions'
  | 'digital-growth-optimization'
  | 'other';

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  error: { code: string; message: string; details?: Record<string, string[]> };
}

export interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  serviceInterest: ServiceInterest;
  message: string;
  consent: boolean;
  source?: string;
  website?: string; // honeypot
}

export interface ProjectSummary {
  slug: string;
  title: string;
  category: Exclude<ServiceInterest, 'other'>;
  summary: string;
  coverImageUrl: string | null;
  coverImageAlt: string;
  isPlaceholder: boolean;
  order: number;
}

export interface ServiceItemData {
  slug: string;
  number: string;
  title: string;
  description: string;
  order: number;
}
