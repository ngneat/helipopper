import { TippyConfig } from './tippy.types';

export function defaultVariations(): Partial<TippyConfig> {
  return {
    defaultVariation: 'tooltip',
    variations: {
      tooltip: {
        theme: null,
        arrow: false,
        animation: 'scale',
        trigger: 'mouseenter',
        offset: [0, 5]
      },
      popper: {
        theme: 'light',
        arrow: true,
        offset: [0, 10],
        animation: null,
        trigger: 'click',
        interactive: true
      }
    }
  };
}
