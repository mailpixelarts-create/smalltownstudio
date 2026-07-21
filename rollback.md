# Rollback Instructions

**Date**: 2025-07-21
**Reason**: Revert all system debug fixes (TS types, preloader interval, page transitions, cursor cleanup, double-click guard)

---

## Quick Rollback (all changes)

Run from project root:

```bash
# Restore js/main.ts to its pre-fix state
git checkout HEAD -- js/main.ts
```

If not in a git repo, manually restore each section below.

---

## File-by-File Rollback

### 1. js/main.ts

**Revert Fix 1 (TS types)** — Remove the `as HTMLElement[]` casts:

```typescript
// Line 124 — change back to:
gsap.utils.toArray('.section-label').forEach((el) => {

// Line 139 — change back to:
gsap.utils.toArray('[data-split="chars"]').forEach((el) => {

// Line 156 — change back to:
gsap.utils.toArray('[data-split="lines"]').forEach((el) => {
```

**Revert Fix 2 (preloader interval)** — Remove `clearInterval(countInterval)` from timeline's top-level `onComplete`:

```typescript
// Restore to:
const tl = gsap.timeline({
  onComplete: () => {
    this.onLoaderComplete();
  }
});
```

**Revert Fix 3 (page transition RAF)** — Restore double-RAF pattern:

```typescript
// Restore to:
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.body.classList.remove('is-loading');
  });
});
```

**Revert Fix 4 (cursor cleanup)** — Remove `cursorRafId` field and `cancelAnimationFrame` call:

```typescript
// Remove this field from the class:
private cursorRafId: number = 0;

// In initCursor animate loop, restore to:
const animate = () => {
  cursorX += (mouseX - cursorX) * 0.15;
  cursorY += (mouseY - cursorY) * 0.15;
  cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
  requestAnimationFrame(animate);
};

// Remove this line from initPageTransitions:
cancelAnimationFrame(this.cursorRafId);
```

**Revert Fix 5 (double-click guard)** — Remove the `is-leaving` early return:

```typescript
// Restore to:
link.addEventListener('click', (e) => {
  e.preventDefault();
  document.body.classList.add('is-leaving');
  setTimeout(() => {
    window.location.href = href;
  }, 400);
});
```

---

## Verification After Rollback

1. Run `npx tsc --noEmit` — should show 3 TS errors (TS2345, TS18046 x2)
2. Open dev server — preloader count interval may tick after timeline completes (minor)
3. Page load may flash visible before `is-loading` is removed (timing-dependent)
4. Cursor animation loop runs indefinitely on page leave (no cleanup)
5. Rapid double-clicks on internal links trigger fade-out twice (no guard)
