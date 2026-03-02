import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, formatStr: string = "PPP"): string {
  // Dynamic import at runtime to avoid build-time issues
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { format } = require("date-fns") as { format: (date: Date, str: string) => string };
  return format(new Date(date), formatStr);
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
