import {
  ApplicationRef,
  ComponentFactoryResolver,
  ElementRef,
  Inject,
  Injectable,
  Injector,
  NgZone,
  TemplateRef,
  Type
} from '@angular/core';
import { HELIPOPPER_CONFIG, HelipopperConfig } from './helipopper.types';
import { HelipopperDirective } from './helipopper.directive';
import { HelipopperOptions, initialHelipopperOptions as initialOptions } from './helipopper-options';

@Injectable({
  providedIn: 'root'
})
export class HelipopperService {
  constructor(
    private appRef: ApplicationRef,
    private zone: NgZone,
    private resolver: ComponentFactoryResolver,
    private hostInjector: Injector,
    @Inject(HELIPOPPER_CONFIG) private config: HelipopperConfig
  ) {}

  open(host: ElementRef, helipopper: string | TemplateRef<any> | Type<any>, options?: Partial<HelipopperOptions>) {
    let directive: HelipopperDirective = new HelipopperDirective(
      host,
      this.appRef,
      this.zone,
      this.resolver,
      this.hostInjector,
      this.config
    );

    directive.helipopper = helipopper;

    directive.helipopperOptions = options?.options || initialOptions.options;
    directive.showOnlyOnTextOverflow = isDefined(options?.textOverflow)
      ? options?.textOverflow
      : initialOptions.textOverflow;
    directive.triggerTarget = options?.triggerTarget;
    directive.helipopperAppendTo = options?.appendTo || initialOptions.appendTo;
    directive.helipopperTrigger = options?.trigger;
    directive.helipopperClass = options?.class;
    directive.helipopperOffset = options?.offset;
    directive.injector = options?.injector;
    directive.placement = options?.placement || initialOptions.placement;
    directive.variation = options?.variation || initialOptions.variation;
    directive.disabled = isDefined(options?.disabled) ? options?.disabled : initialOptions.disabled;
    directive.sticky = options?.sticky;
    directive.helipopperAllowClose = isDefined(options?.allowClose) ? options?.allowClose : initialOptions.allowClose;

    directive.whenStable.subscribe(() => directive.show());

    return directive;
  }
}

function isDefined(value: any) {
  return value !== undefined;
}
