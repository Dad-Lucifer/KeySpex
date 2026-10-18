/**
 * Formatting utilities for Indian Rupee (INR) and metrics per admin.md §13.3.
 */

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
})

export function formatINR(val: number): string {
  return inrFormatter.format(val)
}

/**
 * Compact Indian numbering format: Lakhs (L) and Crores (Cr)
 * Examples: 420000 -> ₹4.20L, 12000000 -> ₹1.20Cr
 */
export function formatINRCompact(val: number, digits = 2): string {
  if (Math.abs(val) >= 10000000) {
    const cr = val / 10000000
    return `₹${cr.toFixed(digits)}Cr`
  }
  if (Math.abs(val) >= 100000) {
    const l = val / 100000
    return `₹${l.toFixed(digits)}L`
  }
  return inrFormatter.format(val)
}

export function formatPercent(val: number, digits = 1): string {
  return `${val.toFixed(digits)}%`
}
