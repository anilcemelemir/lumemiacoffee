import { useSeoMeta } from "../hooks/useSeoMeta";

/**
 * App-level component that handles dynamic SEO injection.
 * Renders nothing visually — it only manages <head> and <body> scripts.
 */
export function SeoHead() {
  useSeoMeta();
  return null;
}
