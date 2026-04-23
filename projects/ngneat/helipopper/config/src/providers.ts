import { EnvironmentProviders, makeEnvironmentProviders, Type } from '@angular/core';

import {
  TIPPY_CONFIG,
  TIPPY_LOADER,
  TIPPY_LOADER_COMPONENT,
  TIPPY_LOADER_TIMING,
  type TippyLoader,
  type TippyConfig,
  type TippyLoaderTiming,
} from './tippy.types';

export function provideTippyLoader(loader: TippyLoader) {
  return makeEnvironmentProviders([{ provide: TIPPY_LOADER, useValue: loader }]);
}

export function provideTippyConfig(
  config: TippyConfig,
  ...features: EnvironmentProviders[]
): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TIPPY_CONFIG, useValue: config },
    ...features,
  ]);
}

export function withTippyLoaderComponent(component: Type<unknown>): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: TIPPY_LOADER_COMPONENT, useValue: component },
  ]);
}

export function withTippyLoaderTiming(timing: TippyLoaderTiming): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: TIPPY_LOADER_TIMING, useValue: timing }]);
}
