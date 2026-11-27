'use client';

const WISHLIST_KEY = 'harvest_studio_wishlist';

export function getWishlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(WISHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function toggleWishlist(packageId: string): string[] {
  if (typeof window === 'undefined') return [];
  const current = getWishlist();
  let updated: string[];
  if (current.includes(packageId)) {
    updated = current.filter((id) => id !== packageId);
  } else {
    updated = [...current, packageId];
  }
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('wishlist-updated'));
  return updated;
}

export function isInWishlist(packageId: string): boolean {
  if (typeof window === 'undefined') return false;
  const current = getWishlist();
  return current.includes(packageId);
}
