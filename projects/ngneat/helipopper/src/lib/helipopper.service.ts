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
import { HelipopperOptions } from './helipopper-options';

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

    directive.helipopperOptions = options?.helipopperOptions || {};
    directive.showOnlyOnTextOverflow = options?.helipopperTextOverflow || false;
    directive.triggerTarget = options?.triggerTarget;
    directive.helipopperAppendTo = options?.helipopperAppendTo || document.body;
    directive.helipopperTrigger = options?.helipopperTrigger;
    directive.helipopperClass = options?.helipopperClass;
    directive.helipopperOffset = options?.helipopperOffset;
    directive.injector = options?.helipopperInjector;
    directive.placement = options?.helipopperPlacement;
    directive.variation = options?.helipopperVariation;
    directive.disabled = options?.helipopperDisabled;
    directive.sticky = options?.helipopperSticky;

    directive.whenStable.subscribe(() => directive.show());

    return directive;
  }
}
