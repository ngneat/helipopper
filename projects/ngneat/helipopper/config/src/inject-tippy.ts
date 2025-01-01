import { inject } from '@angular/core';

import { TIPPY_REF, TippyErrorCode, type TippyInstance } from './tippy.types';

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
