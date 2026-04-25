import { EnvironmentProviders, makeEnvironmentProviders, Type } from '@angular/core';

import {
  FLOATING_CONFIG,
  FLOATING_LOADER,
  FLOATING_LOADER_COMPONENT,
  FLOATING_LOADER_TIMING,
  type FloatingLoader,
  type FloatingConfig,
  type FloatingLoaderTiming,
} from './floating.types';

export function provideFloatingLoader(loader: FloatingLoader) {
  return makeEnvironmentProviders([{ provide: FLOATING_LOADER, useValue: loader }]);
}

export function provideFloatingConfig(
  config: FloatingConfig,
  ...features: EnvironmentProviders[]
): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FLOATING_CONFIG, useValue: config },
    ...features,
  ]);
}

export function withFloatingLoaderComponent(
  component: Type<unknown>,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FLOATING_LOADER_COMPONENT, useValue: component },
  ]);
}

export function withFloatingLoaderTiming(
  timing: FloatingLoaderTiming,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: FLOATING_LOADER_TIMING, useValue: timing },
  ]);
}

// ---------------------------------------------------------------------------
// Deprecated aliases kept for backwards compatibility
// ---------------------------------------------------------------------------

/** @deprecated Use `provideFloatingLoader` instead. */
export const provideTippyLoader = provideFloatingLoader;
/** @deprecated Use `provideFloatingConfig` instead. */
export const provideTippyConfig = provideFloatingConfig;
/** @deprecated Use `withFloatingLoaderComponent` instead. */
export const withTippyLoaderComponent = withFloatingLoaderComponent;
/** @deprecated Use `withFloatingLoaderTiming` instead. */
export const withTippyLoaderTiming = withFloatingLoaderTiming;
