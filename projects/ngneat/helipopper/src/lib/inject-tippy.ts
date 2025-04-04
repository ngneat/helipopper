import { inject, InjectionToken } from '@angular/core';
import type { TippyInstance } from '@ngneat/helipopper/config';

import { TippyErrorCode } from './utils';

export const TIPPY_REF = /* @__PURE__ */ new InjectionToken<TippyInstance>(
  typeof ngDevMode !== 'undefined' && ngDevMode ? 'TIPPY_REF' : ''
);

export function injectTippyRef(): TippyInstance {
  const instance = inject(TIPPY_REF, { optional: true });

  if (!instance) {
    if (typeof ngDevMode !== 'undefined' && ngDevMode) {
      throw new Error(
        'tp is not provided in the current context or on one of its ancestors'
      );
    } else {
      throw new Error(`[tp]: ${TippyErrorCode.TippyNotProvided}`);
    }
  }

  return instance;
}
