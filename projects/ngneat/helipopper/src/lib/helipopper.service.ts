import {
  ApplicationRef,
  ComponentFactoryResolver,
  ElementRef,
  Inject,
  Injectable,
  Injector,
  NgZone,
  PLATFORM_ID,
  TemplateRef
} from '@angular/core';
import { Type } from '@angular/core';
import { HELIPOPPER_CONFIG, HelipopperConfig } from './helipopper.types';
import { HelipopperDirective } from './helipopper.directive';
import { INITIAL_HELIPOPPER_OPTIONS, PartialHelipopperOptions } from './helipopper-options';

@Injectable({
  providedIn: 'root'
})
export class HelipopperService {
  constructor(
    private appRef: ApplicationRef,
    private zone: NgZone,
    private resolver: ComponentFactoryResolver,
    private hostInjector: Injector,
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(HELIPOPPER_CONFIG) private config: HelipopperConfig,
    @Inject(INITIAL_HELIPOPPER_OPTIONS) private initialOptions: PartialHelipopperOptions
  ) {}

  open(host: ElementRef, helipopper: string | TemplateRef<any> | Type<any>, options?: PartialHelipopperOptions) {
    let directive: HelipopperDirective = new HelipopperDirective(
      host,
      this.appRef,
      this.zone,
      this.resolver,
      this.hostInjector,
      this.platformId,
      this.config,
      this.initialOptions
    );

    directive.helipopper = helipopper;

    directive.helipopperOptions = options?.options || this.initialOptions.options;
    directive.showOnlyOnTextOverflow = isDefined(options?.textOverflow)
      ? options?.textOverflow
      : this.initialOptions.textOverflow;
    directive.triggerTarget = options?.triggerTarget;
    directive.helipopperAppendTo = options?.appendTo || this.initialOptions.appendTo;
    directive.helipopperTrigger = options?.trigger;
    directive.helipopperClass = options?.class;
    directive.helipopperOffset = options?.offset;
    directive.injector = options?.injector;
    directive.placement = options?.placement || this.initialOptions.placement;
    directive.variation = options?.variation || this.initialOptions.variation;
    directive.disabled = isDefined(options?.disabled) ? options?.disabled : this.initialOptions.disabled;
    directive.sticky = options?.sticky;
    directive.helipopperAllowClose = isDefined(options?.allowClose)
      ? options?.allowClose
      : this.initialOptions.allowClose;

    directive.whenStable.subscribe(() => directive.show());

    return directive;
  }
}

function isDefined(value: any) {
  return value !== undefined;
}
