import { useEffect, useRef } from "react";
import { api } from "../lib/api";

type SeoData = Record<string, string>;
type SeoResponse = { status: "ok"; data: SeoData };

/**
 * Fetches SEO settings from the API and dynamically injects
 * meta tags and tracking scripts into the document.
 *
 * Tracking scripts are injected using createContextualFragment()
 * so that <script> tags are properly executed by the browser.
 */
export function useSeoMeta() {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;

    api
      .get<SeoResponse>("/api/v1/seo")
      .then((r) => {
        if (cancelled) return;
        const data = r.data;
        const cleanupFns: (() => void)[] = [];

        // --- Meta tags ---
        if (data.meta_title) {
          const prev = document.title;
          document.title = data.meta_title;
          cleanupFns.push(() => { document.title = prev; });
        }

        const metaTags: Array<{ name?: string; property?: string; content: string }> = [];
        if (data.meta_description) metaTags.push({ name: "description", content: data.meta_description });
        if (data.meta_keywords) metaTags.push({ name: "keywords", content: data.meta_keywords });
        if (data.og_image) metaTags.push({ property: "og:image", content: data.og_image });
        if (data.meta_title) metaTags.push({ property: "og:title", content: data.meta_title });
        if (data.meta_description) metaTags.push({ property: "og:description", content: data.meta_description });

        for (const tag of metaTags) {
          const el = document.createElement("meta");
          if (tag.name) el.setAttribute("name", tag.name);
          if (tag.property) el.setAttribute("property", tag.property);
          el.setAttribute("content", tag.content);
          // Remove existing tag with same name/property first
          const selector = tag.name
            ? `meta[name="${tag.name}"]`
            : `meta[property="${tag.property}"]`;
          const existing = document.head.querySelector(selector);
          if (existing) existing.remove();
          document.head.appendChild(el);
          cleanupFns.push(() => el.remove());
        }

        // --- Tracking: <head> scripts ---
        if (data.tracking_head?.trim()) {
          const container = document.createElement("div");
          container.setAttribute("data-seo-tracking", "head");
          document.head.appendChild(container);
          // Use createContextualFragment to execute <script> tags
          const range = document.createRange();
          range.selectNode(container);
          const fragment = range.createContextualFragment(data.tracking_head);
          container.appendChild(fragment);
          cleanupFns.push(() => container.remove());
        }

        // --- Tracking: <body> scripts ---
        if (data.tracking_body?.trim()) {
          const container = document.createElement("div");
          container.setAttribute("data-seo-tracking", "body");
          // Insert at the beginning of body (after root div)
          const root = document.getElementById("root");
          if (root && root.nextSibling) {
            document.body.insertBefore(container, root.nextSibling);
          } else {
            document.body.appendChild(container);
          }
          const range = document.createRange();
          range.selectNode(container);
          const fragment = range.createContextualFragment(data.tracking_body);
          container.appendChild(fragment);
          cleanupFns.push(() => container.remove());
        }

        cleanupRef.current = () => {
          for (const fn of cleanupFns) fn();
        };
      })
      .catch(() => {
        // SEO fetch failed — non-critical, don't break the app
      });

    return () => {
      cancelled = true;
      cleanupRef.current?.();
    };
  }, []);
}
