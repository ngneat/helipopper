import { Instance, Props } from 'tippy.js';
import { Subscription } from 'rxjs';
import { ElementRef, InjectionToken } from '@angular/core';
import { Options as PopperOptions } from '@popperjs/core';

export type Variation = 'popper' | 'tooltip';
export type InstanceWithClose = Instance & { closeButtonElement: HTMLElement; closeButtonSubscription: Subscription };
export type Element = HTMLElement | ElementRef | undefined;

export type HelipopperConfig = {
  beforeRender?(content: string): string;
  closeIcon?: string;
};

export interface HelipopperOptions {
  helipopperVariation: Variation;
  helipopperPlacement: PopperOptions['placement'];
  helipopperClass: string | Array<string> | undefined;
  helipopperOffset: [number, number] | undefined;
  helipopperDisabled: boolean;
  helipopperAppendTo: string | HTMLElement;
  helipopperOptions: Partial<Props>;
  helipopperTextOverflow: boolean;
  helipopperSticky: boolean;
}

export const HELIPOPPER_CONFIG = new InjectionToken<HelipopperConfig>('HELIPOPPER_CONFIG');
