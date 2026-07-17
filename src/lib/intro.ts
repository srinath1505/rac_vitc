/**
 * In-memory "intro finished" flag. Resets on every full page load (so the
 * preloader + scribble reveal replay on reload) but persists across client-side
 * route changes (so interior pages don't wait for an intro that already ran).
 */
let introDone = false;
export const isIntroDone = () => introDone;
export const setIntroDone = () => {
  introDone = true;
};
