import { Inject, Injectable, Injector } from '@angular/core';
import tippy from 'tippy.js';
import { Content, isComponent, isTemplateRef, ViewRef, ViewService } from '@ngneat/overview';
import { CreateOptions, TIPPY_CONFIG, TIPPY_REF, TippyConfig, TippyInstance } from './tippy.types';

@Injectable({ providedIn: 'root' })
export class TippyService {
  constructor(
    @Inject(TIPPY_CONFIG) private globalConfig: Partial<TippyConfig>,
    private view: ViewService,
    private injector: Injector
  ) {}

  create(host: Element, content: Content, options: Partial<CreateOptions> = {}): TippyInstance {
    let view: ViewRef;

    const config = {
      $viewOptions: undefined,
      onShow: instance => {
        if (!config.$viewOptions) {
          config.$viewOptions = {};

          if (isTemplateRef(content)) {
            config.$viewOptions.context = {
              $implicit: instance.hide.bind(instance)
            };
          } else if (isComponent(content)) {
            config.$viewOptions.injector = Injector.create({
              providers: [{ provide: TIPPY_REF, useValue: instance }],
              parent: options.injector || this.injector
            });
          }
        }
        view = this.view.createView(content, { ...options, ...config.$viewOptions });
        instance.setContent(view.getElement());
        options?.onShow?.(instance);
      },
      onHidden: instance => {
        view.destroy();
        options?.onHidden?.(instance);
        view = null;
      },
      ...this.globalConfig,
      ...this.globalConfig.variations[options.variation || this.globalConfig.defaultVariation],
      ...options
    };

    const instance = tippy(host, config);

    const original = instance.destroy;

    instance.destroy = () => {
      original.call(tippy);
      view?.destroy();
      view = null;
    };

    return instance;
  }
}
