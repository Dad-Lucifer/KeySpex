import { useState, type FormEvent } from 'react';
import { Loader2, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ServiceInterest } from '@/lib/types';
import { cn } from '@/lib/utils';

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/xzedwzpv';

type Status = 'idle' | 'submitting' | 'success' | 'error';

interface ContactFormProps {
  source?: string;
  className?: string;
}

export function ContactForm({ source = 'landing-contact-section', className }: ContactFormProps) {
  const [status, setStatus] = useState<Status>('idle');
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [serviceInterest, setServiceInterest] = useState<ServiceInterest>('website-development');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('submitting');
    setFormError(null);
    setFieldErrors({});

    if (!consent) {
      setFieldErrors({ consent: ['You must agree to be contacted regarding this enquiry'] });
      setStatus('error');
      return;
    }

    // Client-side spam detection (honeypot)
    if (website.trim()) {
      // Silently treat as success for spam bots
      setStatus('success');
      return;
    }

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim() || undefined,
          serviceInterest,
          message: message.trim(),
          consent: consent ? 'Agreed' : 'Declined',
          source,
          _gotcha: website.trim(),
          _replyto: email.trim(),
          _subject: `New KeySpex Enquiry from ${name.trim()} (${serviceInterest})`,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        setStatus('success');
      } else {
        if (data && Array.isArray(data.errors) && data.errors.length > 0) {
          const newFieldErrors: Record<string, string[]> = {};
          for (const item of data.errors) {
            if (item.field) {
              newFieldErrors[item.field] = [item.message || 'Invalid value'];
            }
          }
          setFieldErrors(newFieldErrors);
          setFormError(data.errors.map((item: { message: string }) => item.message).join(', '));
        } else if (data?.error) {
          setFormError(data.error);
        } else {
          setFormError('Unable to send enquiry. Please check your connection or reach out directly.');
        }
        setStatus('error');
      }
    } catch {
      setFormError('Unable to send enquiry. Please check your connection or email directly.');
      setStatus('error');
    }
  }

  const handleReset = () => {
    setStatus('idle');
    setName('');
    setEmail('');
    setCompany('');
    setMessage('');
    setConsent(false);
    setFormError(null);
    setFieldErrors({});
  };

  if (status === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in-50 zoom-in-95 duration-300"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 ring-8 ring-emerald-50/50">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h3 className="mt-6 text-[24px] font-bold text-[#090B10]">Thank you.</h3>
        <p className="mt-2 text-[15px] text-[#64748B] max-w-md">
          We've received your enquiry and our team will get back to you shortly.
        </p>
        <div className="mt-6 flex items-center gap-2 font-mono text-[12px] text-[#64748B]">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>Your submission is confidential and secure.</span>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="mt-8 rounded-xl border border-[#E5E7EB] bg-white px-5 py-2.5 font-mono text-[12px] font-bold text-[#090B10] hover:bg-[#F8FAFC] transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      action={FORMSPREE_ENDPOINT}
      method="POST"
      onSubmit={onSubmit}
      noValidate
      className={cn('space-y-6', className)}
    >
      {/* Honeypot — hidden from humans and screen readers */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden pointer-events-none">
        <label htmlFor="website-honeypot">
          Leave this field blank
          <input
            id="website-honeypot"
            type="text"
            name="_gotcha"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      {/* Row 1: Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 text-left">
          <label htmlFor="contact-name" className="block text-[13px] font-semibold text-[#090B10]">
            Your Name <span className="text-[#0866F5]">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
            className={cn(
              'w-full rounded-xl border bg-[#F8FAFC] px-4 py-3 text-[14px] text-[#090B10] placeholder:text-[#94A3B8] transition-all focus:border-[#0866F5] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0866F5]/10',
              fieldErrors.name ? 'border-rose-400' : 'border-[#E5E7EB]',
            )}
          />
          {fieldErrors.name && (
            <p id="contact-name-error" role="alert" className="text-xs text-rose-600 font-medium">
              {fieldErrors.name[0]}
            </p>
          )}
        </div>

        <div className="space-y-1.5 text-left">
          <label htmlFor="contact-email" className="block text-[13px] font-semibold text-[#090B10]">
            Work Email <span className="text-[#0866F5]">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@company.com"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
            className={cn(
              'w-full rounded-xl border bg-[#F8FAFC] px-4 py-3 text-[14px] text-[#090B10] placeholder:text-[#94A3B8] transition-all focus:border-[#0866F5] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0866F5]/10',
              fieldErrors.email ? 'border-rose-400' : 'border-[#E5E7EB]',
            )}
          />
          {fieldErrors.email && (
            <p id="contact-email-error" role="alert" className="text-xs text-rose-600 font-medium">
              {fieldErrors.email[0]}
            </p>
          )}
        </div>
      </div>

      {/* Row 2: Company & Service Interest */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 text-left">
          <label htmlFor="contact-company" className="block text-[13px] font-semibold text-[#090B10]">
            Company Name <span className="text-[#94A3B8] text-xs font-normal">(Optional)</span>
          </label>
          <input
            id="contact-company"
            name="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Studio"
            className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-[14px] text-[#090B10] placeholder:text-[#94A3B8] transition-all focus:border-[#0866F5] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0866F5]/10"
          />
        </div>

        <div className="space-y-1.5 text-left">
          <label htmlFor="contact-service" className="block text-[13px] font-semibold text-[#090B10]">
            Interested In <span className="text-[#0866F5]">*</span>
          </label>
          <select
            id="contact-service"
            name="serviceInterest"
            value={serviceInterest}
            onChange={(e) => setServiceInterest(e.target.value as ServiceInterest)}
            className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3 text-[14px] text-[#090B10] transition-all focus:border-[#0866F5] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0866F5]/10"
          >
            <option value="website-development">01. Website Development</option>
            <option value="custom-digital-solutions">02. Custom Digital Solutions</option>
            <option value="digital-growth-optimization">03. Digital Growth &amp; Optimization</option>
            <option value="other">Other / Custom Scope</option>
          </select>
        </div>
      </div>

      {/* Message textarea */}
      <div className="space-y-1.5 text-left">
        <label htmlFor="contact-message" className="block text-[13px] font-semibold text-[#090B10]">
          Tell us about your project <span className="text-[#0866F5]">*</span>
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What are your goals, challenges, or timeline requirements?"
          aria-invalid={!!fieldErrors.message}
          aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
          className={cn(
            'w-full rounded-xl border bg-[#F8FAFC] px-4 py-3 text-[14px] text-[#090B10] placeholder:text-[#94A3B8] transition-all focus:border-[#0866F5] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#0866F5]/10 resize-y min-h-[100px]',
            fieldErrors.message ? 'border-rose-400' : 'border-[#E5E7EB]',
          )}
        />
        {fieldErrors.message && (
          <p id="contact-message-error" role="alert" className="text-xs text-rose-600 font-medium">
            {fieldErrors.message[0]}
          </p>
        )}
      </div>

      {/* Consent checkbox */}
      <div className="flex items-start gap-3 text-left">
        <input
          id="contact-consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-[#0866F5] focus:ring-[#0866F5]"
        />
        <label htmlFor="contact-consent" className="text-[13px] text-[#64748B] leading-relaxed select-none">
          I agree to be contacted by KeySpex regarding my project enquiry. We respect your privacy and never share your data.
        </label>
      </div>
      {fieldErrors.consent && (
        <p role="alert" className="text-xs text-rose-600 font-medium text-left">
          {fieldErrors.consent[0]}
        </p>
      )}

      {/* Global Form Error Banner */}
      {formError && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-[13px] text-rose-700 text-left">
          {formError}
        </div>
      )}

      {/* Submit button */}
      <Button
        type="submit"
        disabled={status === 'submitting'}
        className="group flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#090B10] px-6 text-[15px] font-bold text-white transition-all hover:bg-[#0866F5] active:scale-[0.99] shadow-cta cursor-pointer"
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Sending Enquiry...</span>
          </>
        ) : (
          <>
            <span>Send Enquiry</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </>
        )}
      </Button>
    </form>
  );
}
