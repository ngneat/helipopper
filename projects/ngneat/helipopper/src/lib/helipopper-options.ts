import { Props } from 'tippy.js';
import { Variation } from './helipopper.types';
import { Options as PopperOptions } from '@popperjs/core';
import { Injector } from '@angular/core';

export const initialHelipopperOptions: Partial<HelipopperOptions> = {
  options: {},
  textOverflow: false,
  appendTo: document.body,
  placement: 'top',
  variation: 'tooltip',
  disabled: false,
  allowClose: true
};

export interface HelipopperOptions {
  options: Partial<Props>;
  textOverflow: boolean;
  triggerTarget: Element;
  appendTo: string | HTMLElement;
  trigger: string | undefined;
  class: string | Array<string> | undefined;
  offset: [number, number] | undefined;
  injector: Injector | undefined;
  placement: PopperOptions['placement'];
  variation: Variation;
  disabled: boolean;
  sticky: boolean;
  allowClose: boolean;
}
