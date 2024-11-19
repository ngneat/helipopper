import { inject } from '@angular/core';

import { TIPPY_REF, type TippyInstance } from './tippy.types';

export function injectTippyRef(): TippyInstance {
  const instance = inject(TIPPY_REF, { optional: true });

  if (instance) {
    return instance;
  }

  throw new Error('tp is not provided in the current context or on one of its ancestors');
}
