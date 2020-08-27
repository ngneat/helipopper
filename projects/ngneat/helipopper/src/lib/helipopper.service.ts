import {
  ApplicationRef,
  ComponentFactoryResolver,
  ElementRef,
  Inject,
  Injectable,
  Injector,
  NgZone,
  TemplateRef
} from '@angular/core';
import { HELIPOPPER_CONFIG, HelipopperConfig, HelipopperOptions } from './helipopper.types';
import { HelipopperDirective } from './helipopper.directive';

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

  open(host: ElementRef, helipopper: string | TemplateRef<any>, options?: HelipopperOptions) {
    let directive: HelipopperDirective = new HelipopperDirective(
      host,
      this.appRef,
      this.zone,
      this.resolver,
      this.hostInjector,
      this.config
    );

    //todo :  if helipopperAppendTo === undefined then document.body;
    //todo :  if helipopperOptions === undeifned then {}
    // todo : if helipopperTextOverflow === undefined then showOnlyOnTextOverflow = false
    directive.helipopper = helipopper;

    directive.whenStable.subscribe(() => {
      directive.show();
    });

    return directive;
  }
}
