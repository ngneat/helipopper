import { ModuleWithProviders, NgModule } from '@angular/core';
import { HelipopperDirective } from './helipopper.directive';
import { HELIPOPPER_CONFIG, HelipopperConfig } from './helipopper.types';

@NgModule({
  declarations: [HelipopperDirective],
  exports: [HelipopperDirective]
})
export class HelipopperModule {
  static forRoot(config: HelipopperConfig = {}): ModuleWithProviders {
    return {
      ngModule: HelipopperModule,
      providers: [
        {
          provide: HELIPOPPER_CONFIG,
          useValue: config
        }
      ]
    };
  }
}
