import { useEffect } from "react";

// Canonical mapping of section aliases to official element IDs in the DOM
export const SECTION_ALIASES: Record<string, string> = {
  // Field stories / Notes
  "field-stories": "field-stories",
  "field-notes": "field-stories",
  "fieldstories": "field-stories",
  "fieldnotes": "field-stories",
  "stories": "field-stories",
  "story": "field-stories",
  "blog": "field-stories",
  "dispatch": "field-stories",
  "dispatches": "field-stories",

  // Experiences & Circuits
  "experiences": "experiences",
  "circuits": "experiences",
  "safaris": "experiences",
  "climbs": "experiences",
  "routes": "experiences",
  "tours": "experiences",

  // Destinations & Landmarks
  "landmarks": "landmarks",
  "destinations": "landmarks",
  "parks": "landmarks",
  "places": "landmarks",

  // Fleet
  "fleet": "fleet",
  "landcruisers": "fleet",
  "cruisers": "fleet",
  "vehicles": "fleet",
  "cars": "fleet",

  // Weather Telemetry
  "weather": "weather",
  "forecast": "weather",
  "telemetry": "weather",
  "climate": "weather",

  // Expedition Architect / Calculator
  "builder": "builder",
  "calculator": "builder",
  "pricing": "builder",
  "quote": "builder",
  "cost": "builder",
  "planner": "builder",
  "itinerary": "builder",

  // Resources / Field Guides
  "resources": "resources",
  "guides": "resources",
  "field-guides": "resources",
  "packing": "resources",
  "gear": "resources",

  // About Cool J
  "about": "about",
  "cool-j": "about",
  "coolj": "about",
  "guide": "about",
  "founder": "about",
  "team": "about",

  // Testimonials / Reviews
  "testimonials": "testimonials",
  "reviews": "testimonials",
  "social-proof": "testimonials",

  // Gallery
  "gallery": "gallery",
  "photos": "gallery",

  // FAQ
  "faq": "faq",
  "faqs": "faq",
  "questions": "faq",

  // Home / Top
  "home": "home",
  "top": "home"
};

/**
 * Resolves a given hash or query parameter to a canonical DOM element ID
 */
export function resolveTargetId(rawInput: string | null | undefined): string | null {
  if (!rawInput) return null;

  // Clean raw input: strip hashes, slashes, and query params
  const clean = decodeURIComponent(rawInput)
    .replace(/^#+/, "")
    .replace(/^\/+/, "")
    .split("?")[0]
    .split("&")[0]
    .trim()
    .toLowerCase();

  if (!clean) return null;

  // Check alias lookup table
  if (SECTION_ALIASES[clean]) {
    return SECTION_ALIASES[clean];
  }

  // Check direct element match in DOM
  if (typeof document !== "undefined" && document.getElementById(clean)) {
    return clean;
  }

  return clean;
}

/**
 * Smoothly scrolls to a given section ID, offsetting for the sticky 80px navigation bar
 */
export function scrollToTargetSection(target: string, smooth: boolean = true): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;

  const targetId = resolveTargetId(target);
  if (!targetId) return false;

  const element = document.getElementById(targetId);
  if (!element) return false;

  // Sticky header height (80px) + 12px breathing margin
  const headerOffset = 92;
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

  window.scrollTo({
    top: Math.max(0, offsetPosition),
    behavior: smooth ? "smooth" : "auto"
  });

  // If a mobile dropdown or layout collapse just triggered, re-align after 100ms
  setTimeout(() => {
    const elAfter = document.getElementById(targetId);
    if (elAfter) {
      const posAfter = elAfter.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      if (Math.abs(window.pageYOffset - posAfter) > 15) {
        window.scrollTo({
          top: Math.max(0, posAfter),
          behavior: "smooth"
        });
      }
    }
  }, 120);

  return true;
}

/**
 * Global Hook to handle initial URL deep-links, browser back/forward, and smooth in-page navigation
 */
export function useHashNavigation() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let userHasScrolledManually = false;

    // Detect user manual scroll to avoid unexpected jumps once the user has taken control
    const markUserScroll = () => {
      userHasScrolledManually = true;
    };

    // Helper to extract desired section from URL hash or query params
    const getTargetFromUrl = (): string | null => {
      const hash = window.location.hash;
      if (hash && hash.length > 1) {
        return hash;
      }
      const searchParams = new URLSearchParams(window.location.search);
      const sectionParam = searchParams.get("section") || searchParams.get("tab") || searchParams.get("page");
      if (sectionParam) {
        return sectionParam;
      }
      return null;
    };

    const initialTarget = getTargetFromUrl();

    if (initialTarget) {
      // In a client-rendered React SPA, elements may take several milliseconds to mount,
      // and child components (such as stories or reviews) can cause layout shifts as they load.
      // We run a staged sequence of scroll attempts to ensure the user lands precisely on the section.
      const retryDelays = [20, 80, 200, 450, 800, 1400, 2200];
      const timers: number[] = [];

      // Instant jump first (auto) to position roughly, then smooth micro-adjustments
      scrollToTargetSection(initialTarget, false);

      retryDelays.forEach((delay, idx) => {
        const tid = window.setTimeout(() => {
          if (!userHasScrolledManually) {
            scrollToTargetSection(initialTarget, idx > 1);
          }
        }, delay);
        timers.push(tid);
      });

      // Window load listener for when slow images and external assets finish loading
      const handleWindowLoad = () => {
        if (!userHasScrolledManually) {
          scrollToTargetSection(initialTarget, true);
        }
      };
      window.addEventListener("load", handleWindowLoad);

      // Give 500ms initial grace period before tracking manual scroll
      const userScrollListenerTimeout = setTimeout(() => {
        window.addEventListener("wheel", markUserScroll, { passive: true });
        window.addEventListener("touchmove", markUserScroll, { passive: true });
      }, 500);

      // Listen to browser navigation (back/forward and hash changes)
      const handleLocationChange = () => {
        const newTarget = getTargetFromUrl();
        if (newTarget) {
          userHasScrolledManually = false;
          scrollToTargetSection(newTarget, true);
        }
      };

      window.addEventListener("hashchange", handleLocationChange);
      window.addEventListener("popstate", handleLocationChange);

      return () => {
        timers.forEach(t => clearTimeout(t));
        clearTimeout(userScrollListenerTimeout);
        window.removeEventListener("load", handleWindowLoad);
        window.removeEventListener("wheel", markUserScroll);
        window.removeEventListener("touchmove", markUserScroll);
        window.removeEventListener("hashchange", handleLocationChange);
        window.removeEventListener("popstate", handleLocationChange);
      };
    } else {
      // If there was no initial hash, just listen for subsequent hashchange and popstate events
      const handleLocationChange = () => {
        const newTarget = getTargetFromUrl();
        if (newTarget) {
          scrollToTargetSection(newTarget, true);
        }
      };

      window.addEventListener("hashchange", handleLocationChange);
      window.addEventListener("popstate", handleLocationChange);

      return () => {
        window.removeEventListener("hashchange", handleLocationChange);
        window.removeEventListener("popstate", handleLocationChange);
      };
    }
  }, []);

  // Global anchor click listener: intercepts internal "#..." links for silk-smooth offset scrolling
  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleAnchorClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      const targetId = resolveTargetId(href);
      if (!targetId) return;

      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        e.preventDefault();

        // Update browser URL address without default abrupt jump
        window.history.pushState(null, "", `#${targetId}`);

        // Smoothly scroll to the target section with sticky header offset
        scrollToTargetSection(targetId, true);
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
    };
  }, []);
}
