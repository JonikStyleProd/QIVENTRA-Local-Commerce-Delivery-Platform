/**
 * Moves focus to the visible page heading after a screen change, so keyboard and screen-reader
 * users continue from the new content. Each screen has one visible h1 per breakpoint.
 */
export const focusPageHeading = () => {
  const heading = Array.from(document.querySelectorAll<HTMLElement>('h1')).find((h) => h.offsetParent !== null);
  if (!heading) return;
  heading.setAttribute('tabindex', '-1');
  heading.focus({ preventScroll: true });
};
