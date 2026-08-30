import { useEffect } from "react";

let locks = 0;
let restore = "";

/**
 * Reference-counted body scroll lock.
 *
 * Four surfaces used to each write `document.body.style.overflow` directly and
 * each reset it to `""` on close — so whichever closed first unlocked the page
 * underneath the one still open (open the mobile menu, open something modal
 * from it, close the modal, and the page scrolls behind the menu). Counting the
 * locks means the page only unlocks when the last holder lets go, and the
 * original inline value is restored rather than assumed empty.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    if (locks === 0) {
      restore = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    locks += 1;

    return () => {
      locks -= 1;
      if (locks === 0) document.body.style.overflow = restore;
    };
  }, [locked]);
}
