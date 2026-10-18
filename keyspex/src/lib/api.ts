import type { ApiFailure, ApiSuccess, ContactPayload, ProjectSummary, ServiceItemData } from './types';

const BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '') + '/api/v1';

export class ApiClientError extends Error {
  status: number;
  code: string;
  fieldErrors?: Record<string, string[]>;

  constructor(
    status: number,
    code: string,
    message: string,
    fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch {
    throw new ApiClientError(0, 'NETWORK_ERROR', 'Unable to reach the server. Please check your connection.');
  }

  const body = (await res.json().catch(() => null)) as ApiSuccess<T> | ApiFailure | null;

  if (!res.ok || !body || body.success === false) {
    const err = (body as ApiFailure | null)?.error;
    throw new ApiClientError(
      res.status,
      err?.code ?? 'UNKNOWN',
      err?.message ?? 'Something went wrong. Please try again.',
      err?.details,
    );
  }
  return body.data;
}

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/xzedwzpv';

export const api = {
  submitContact: async (payload: ContactPayload): Promise<{ id: string; message: string }> => {
    let res: Response;
    try {
      res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          company: payload.company,
          serviceInterest: payload.serviceInterest,
          message: payload.message,
          consent: payload.consent ? 'Agreed' : 'Declined',
          source: payload.source,
          _gotcha: payload.website,
          _replyto: payload.email,
          _subject: `New KeySpex Enquiry: ${payload.name} (${payload.serviceInterest})`,
        }),
      });
    } catch {
      throw new ApiClientError(0, 'NETWORK_ERROR', 'Unable to reach the server. Please check your connection.');
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      if (data && Array.isArray(data.errors) && data.errors.length > 0) {
        const fieldErrors: Record<string, string[]> = {};
        for (const item of data.errors) {
          if (item.field) {
            fieldErrors[item.field] = [item.message || 'Invalid value'];
          }
        }
        throw new ApiClientError(
          res.status,
          'VALIDATION_ERROR',
          data.errors.map((e: { message: string }) => e.message).join(', '),
          fieldErrors,
        );
      }
      throw new ApiClientError(
        res.status,
        'SUBMISSION_FAILED',
        data?.error ?? 'Unable to send enquiry. Please try again.',
      );
    }

    return { id: 'formspree', message: 'Enquiry sent successfully' };
  },

  getProjects: (limit = 6) => request<ProjectSummary[]>(`/projects?limit=${limit}`),

  getServices: () => request<ServiceItemData[]>('/services'),
};
