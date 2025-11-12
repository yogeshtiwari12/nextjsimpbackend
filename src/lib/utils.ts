import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge conditional class names and intelligently de-duplicate Tailwind utility classes.
 * Use this anywhere you need to combine className strings.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
