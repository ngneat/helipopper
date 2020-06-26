import { Instance } from 'tippy.js';
import { Subscription } from 'rxjs';
import { ElementRef, InjectionToken } from '@angular/core';

export type Variation = 'popper' | 'tooltip';
export type InstanceWithClose = Instance & { closeButtonElement: HTMLElement; closeButtonSubscription: Subscription };
export type Element = HTMLElement | ElementRef | undefined;

export type HelipopperConfig = {
  beforeRender?(content: string): string;
  closeIcon?: string;
  helipopperClass?: string | Array<string>;
  allowHtml?: boolean;
};

export const HELIPOPPER_CONFIG = new InjectionToken<HelipopperConfig>('HELIPOPPER_CONFIG');
