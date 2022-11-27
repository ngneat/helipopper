import { TippyConfig, TIPPY_CONFIG } from './tippy.types';

export function provideTippyConfig(config: Partial<TippyConfig> = {}) {
  return {
    provide: TIPPY_CONFIG,
    useValue: config
  };
}
