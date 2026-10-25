import { useEffect } from 'react';
import { listingSectionElementId, type ListingSection } from '../data/listings/listingInfo';

function scrollableParent(node: HTMLElement): HTMLElement | null {
  let current = node.parentElement;
  while (current) {
    const style = getComputedStyle(current);
    const overflow = `${style.overflow} ${style.overflowY}`;
    if (/(auto|scroll)/.test(overflow) && current.scrollHeight > current.clientHeight + 4) {
      return current;
    }
    current = current.parentElement;
  }
  return document.scrollingElement instanceof HTMLElement ? document.scrollingElement : null;
}

export function scrollToListingSection(section: ListingSection) {
  const target = document.getElementById(listingSectionElementId(section));
  if (!target) return;
  const scroller = scrollableParent(target);
  if (!scroller) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  const page =
    scroller === document.scrollingElement ||
    scroller === document.documentElement ||
    scroller === document.body;
  const offset = page ? 88 : 12;
  const top =
    target.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - offset;
  scroller.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
}

/** Scrolls twice so a late-loading photo or contact block does not leave the section off-screen. */
export function useScrollToListingSection(
  section: ListingSection | null | undefined,
  ready: boolean,
  token = 0,
) {
  useEffect(() => {
    if (!section || !ready) return;
    const first = window.setTimeout(() => scrollToListingSection(section), 80);
    const second = window.setTimeout(() => scrollToListingSection(section), 450);
    const third = window.setTimeout(() => scrollToListingSection(section), 900);
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(second);
      window.clearTimeout(third);
    };
  }, [ready, section, token]);
}
