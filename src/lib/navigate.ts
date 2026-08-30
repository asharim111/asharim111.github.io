/**
 * Section navigation.
 *
 * The old `location.hash = ""` then `location.hash = "#id"` trick re-navigated
 * to the top of the document between the two assignments (a visible jump in
 * Safari and Firefox) and pushed two entries onto the history stack. This
 * scrolls the element directly and rewrites the URL in place, so the address
 * bar still deep-links but the back button isn't polluted.
 */
export function goToSection(id: string) {
  const el = document.getElementById(id);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (el) {
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
    return true;
  }

  // Section hasn't mounted yet (lazy boundary) — let the browser resolve it
  // once the chunk lands.
  window.location.hash = `#${id}`;
  return false;
}
