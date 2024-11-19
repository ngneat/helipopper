import { makeEnvironmentProviders, type Provider } from '@angular/core';

import {
  TIPPY_CONFIG,
  TIPPY_LOADER,
  type TippyLoader,
  type TippyConfig,
} from './tippy.types';

export function provideTippyLoader(loader: TippyLoader) {
  return makeEnvironmentProviders([{ provide: TIPPY_LOADER, useValue: loader }]);
}

export function provideTippyConfig(config: TippyConfig): Provider {
  return { provide: TIPPY_CONFIG, useValue: config };
}
