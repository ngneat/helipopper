import { TippyConfig } from './tippy.types';

export const tooltipVariation: TippyConfig['variations'][0] = {
  theme: null,
  arrow: false,
  animation: 'scale',
  trigger: 'mouseenter',
  offset: [0, 5]
};

export const popperVariation: TippyConfig['variations'][0] = {
  theme: 'light',
  arrow: true,
  offset: [0, 10],
  animation: null,
  trigger: 'click',
  interactive: true
};
