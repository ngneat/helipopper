// Let's retrieve the native `IntersectionObserver` implementation hidden by
// `__zone_symbol__IntersectionObserver`. This would be the unpatched version of
// the observer present in zone.js environments.
// Otherwise, if the user is using zoneless change detection (and zone.js is not included),
// we fall back to the native implementation. Accessing the native implementation
// allows us to remove `runOutsideAngular` calls and reduce indentation,
// making the code a bit more readable.
export const IntersectionObserver: typeof globalThis.IntersectionObserver =
  globalThis['__zone_symbol__IntersectionObserver'] || globalThis.IntersectionObserver;
