import { inject, InjectionToken } from '@angular/core';
import type { FloatingInstance } from '@ngneat/helipopper/config';

import { TippyErrorCode } from './utils';

export const FLOATING_REF = /* @__PURE__ */ new InjectionToken<FloatingInstance>(
  ngDevMode ? 'FLOATING_REF' : '',
);

export function injectFloatingRef(): FloatingInstance {
  const instance = inject(FLOATING_REF, { optional: true });

  if (!instance) {
    if (ngDevMode) {
      throw new Error(
        'tp is not provided in the current context or on one of its ancestors',
      );
    } else {
      throw new Error(`[tp]: ${TippyErrorCode.TippyNotProvided}`);
    }
  }

  return instance;
}

// ---------------------------------------------------------------------------
// Deprecated aliases kept for backwards compatibility
// ---------------------------------------------------------------------------

/** @deprecated Use `FLOATING_REF` instead. */
export const TIPPY_REF = FLOATING_REF;
/** @deprecated Use `injectFloatingRef` instead. */
export const injectTippyRef = injectFloatingRef;
