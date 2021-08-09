import { Inject, Injectable, Injector } from '@angular/core';
import tippy from 'tippy.js';
import { isComponent, isTemplateRef, ViewService } from '@ngneat/overview';
import { Content } from '@ngneat/overview';
import { CreateOptions, TIPPY_CONFIG, TIPPY_REF, TippyConfig, TippyInstance } from './tippy.types';
import { normalizeClassName, onlyTippyProps } from './utils';

@Injectable({ providedIn: 'root' })
export class TippyService {
  constructor(
    @Inject(TIPPY_CONFIG) private globalConfig: TippyConfig,
    private view: ViewService,
    private injector: Injector
  ) {}

  create(host: Element, content: Content, options: Partial<CreateOptions> = {}): TippyInstance {
    const config = {
      onShow: instance => {
        if (!instance.$viewOptions) {
          instance.$viewOptions = {};

          if (isTemplateRef(content)) {
            instance.$viewOptions.context = {
              $implicit: instance.hide.bind(instance),
              ...options.context
            };
          } else if (isComponent(content)) {
            instance.context = options.context;
            instance.$viewOptions.injector = Injector.create({
              providers: [{ provide: TIPPY_REF, useValue: instance }],
              parent: options.injector || this.injector
            });
          }
        }
        instance.view = this.view.createView(content, { ...options, ...instance.$viewOptions });
        instance.setContent(instance.view.getElement());
        options?.onShow?.(instance);
      },
      onHidden: instance => {
        instance.view.destroy();
        options?.onHidden?.(instance);
        instance.view = null;
      },
      ...onlyTippyProps(this.globalConfig),
      ...this.globalConfig.variations[options.variation || this.globalConfig.defaultVariation],
      ...onlyTippyProps(options),
      onCreate: instance => {
        if (options.className) {
          for (const klass of normalizeClassName(options.className)) {
            instance.popper.classList.add(klass);
          }
        }
        this.globalConfig.onCreate?.(instance);
        options.onCreate?.(instance);
      }
    };

    return tippy(host, config);
  }
}
