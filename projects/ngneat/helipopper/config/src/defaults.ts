import type { TippyProps } from './tippy.types';

// A variation is a set of predefined tippy properties.
type Variation = Partial<TippyProps>;

export const tooltipVariation: Variation = {
  theme: undefined,
  arrow: false,
  animation: 'scale',
  trigger: 'mouseenter',
  offset: [0, 5],
};

export const popperVariation: Variation = {
  theme: 'light',
  arrow: true,
  offset: [0, 10],
  animation: undefined,
  trigger: 'click',
  interactive: true,
};

export function withContextMenuVariation(baseVariation: Variation): Variation {
  return {
    ...baseVariation,
    placement: 'right-start',
    trigger: 'manual',
    arrow: false,
    offset: [0, 0],
  };
}
