import { inject, makeEnvironmentProviders } from '@angular/core';
import { TIPPY_CONFIG, TIPPY_REF, TippyConfig, TippyInstance } from './tippy.types';

export function provideTippyConfig(config: TippyConfig) {
  return makeEnvironmentProviders([{ provide: TIPPY_CONFIG, useValue: config }]);
}

export function injectTippyRef(): TippyInstance {
  const instance = inject(TIPPY_REF, { optional: true });

  if (instance) {
    return instance;
  }

  throw new Error('tp is not provided in the current context or on one of its ancestors');
}
