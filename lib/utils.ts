import clsx, { ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(date);
}

export function isoDate(dateString: string): string {
  return new Date(dateString).toISOString();
}

export function truncate(text: string, length = 160): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length - 1).trim()}…`;
}
