import { makeEnvironmentProviders } from '@angular/core';
import { TIPPY_CONFIG, TippyConfig } from './tippy.types';

export function provideTippyConfig(config: Partial<TippyConfig> = {}) {
  return makeEnvironmentProviders([{ provide: TIPPY_CONFIG, useValue: config }]);
}
