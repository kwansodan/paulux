import { useEffect } from "react";

export interface SeoProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  ogImage?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function SeoHead({
  title,
  description,
  keywords,
  canonicalPath = "",
  ogImage = "https://paulux.app/og-image.png",
  schema,
}: SeoProps) {
  useEffect(() => {
    // 1. Update Title
    document.title = title;

    // 2. Helper to set/create meta tags
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);

    // OpenGraph
    setMeta("og:title", title, true);
    setMeta("og:description", description, true);
    setMeta("og:image", ogImage, true);
    const fullUrl = `https://paulux.app${canonicalPath}`;
    setMeta("og:url", fullUrl, true);

    // Twitter
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage);

    // Canonical link
    let canonicalLink = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", fullUrl);

    // Route-specific JSON-LD
    const SCRIPT_ID = "route-json-ld";
    let scriptEl = document.getElementById(SCRIPT_ID);
    if (schema) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.id = SCRIPT_ID;
        scriptEl.setAttribute("type", "application/ld+json");
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(schema);
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [title, description, keywords, canonicalPath, ogImage, schema]);

  return null;
}
