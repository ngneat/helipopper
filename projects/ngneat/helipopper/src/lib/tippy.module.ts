import { ModuleWithProviders, NgModule } from '@angular/core';
import { TippyDirective } from './tippy.directive';
import { TIPPY_CONFIG, TippyConfig } from './tippy.types';

@NgModule({
  declarations: [TippyDirective],
  exports: [TippyDirective]
})
export class TippyModule {
  static forRoot(config: Partial<TippyConfig> = {}): ModuleWithProviders<TippyModule> {
    return {
      ngModule: TippyModule,
      providers: [
        {
          provide: TIPPY_CONFIG,
          useValue: config
        }
      ]
    };
  }
}
