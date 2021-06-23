import { TippyConfig } from './tippy.types';

type Variation = TippyConfig['variations'][0];

const defaultsProps: Variation = {
  hideOnEscape: false
};

export const tooltipVariation: Variation = {
  ...defaultsProps,
  theme: null,
  arrow: false,
  animation: 'scale',
  trigger: 'mouseenter',
  offset: [0, 5]
};

export const popperVariation: Variation = {
  ...defaultsProps,
  theme: 'light',
  arrow: true,
  offset: [0, 10],
  animation: null,
  trigger: 'click',
  interactive: true
};

export function withContextMenuVariation(baseVariation: Variation): Variation {
  return {
    ...defaultsProps,
    ...baseVariation,
    placement: 'right-start',
    trigger: 'manual',
    arrow: false,
    offset: [0, 0]
  };
}
