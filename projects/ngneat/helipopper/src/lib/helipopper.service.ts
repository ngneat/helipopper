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

    directive.tippyOptions = options?.options || this.initialOptions.options;
    directive.showOnlyOnTextOverflow = isDefined(options?.textOverflow)
      ? options?.textOverflow
      : this.initialOptions.textOverflow;
    directive.popperTriggerTarget = options?.triggerTarget;
    directive.popperAppendTo = options?.appendTo || this.initialOptions.appendTo;
    directive.popperTrigger = options?.trigger;
    // directive.popperClassName = options?.class;
    directive.popperOffset = options?.offset;
    directive.injector = options?.injector;
    directive.placement = options?.placement || this.initialOptions.placement;
    directive.variation = options?.variation || this.initialOptions.variation;
    directive.disabled = isDefined(options?.disabled) ? options?.disabled : this.initialOptions.disabled;
    directive.sticky = options?.sticky;
    directive.popperAllowClose = isDefined(options?.allowClose) ? options?.allowClose : this.initialOptions.allowClose;

    directive.whenStable.subscribe(() => directive.show());

    return directive;
  }
}

function isDefined(value: any) {
  return value !== undefined;
}
