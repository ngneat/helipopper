import { TippyConfig } from './tippy.types';

type Variation = TippyConfig['variations'][0];

export const tooltipVariation: Variation = {
  theme: null,
  arrow: false,
  animation: 'scale',
  trigger: 'mouseenter',
  offset: [0, 5]
};

export const popperVariation: Variation = {
  theme: 'light',
  arrow: true,
  offset: [0, 10],
  animation: null,
  trigger: 'click',
  interactive: true
};

export function withContextMenuVariation(baseVariation: Variation): Variation {
  return {
    ...baseVariation,
    placement: 'right-start',
    trigger: 'manual',
    arrow: false,
    offset: [0, 0]
  };
}
