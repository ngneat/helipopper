import { Inject, Injectable, Injector } from '@angular/core';
import tippy from 'tippy.js';
import { Content, isComponent, isTemplateRef, ViewService } from '@ngneat/overview';
import { CreateOptions, ExtendedTippyInstance, TIPPY_CONFIG, TIPPY_REF, TippyConfig } from './tippy.types';
import { normalizeClassName, onlyTippyProps } from './utils';

@Injectable({ providedIn: 'root' })
export class TippyService {
  constructor(
    @Inject(TIPPY_CONFIG) private globalConfig: TippyConfig,
    private view: ViewService,
    private injector: Injector
  ) {}

  create<T extends Content>(host: Element, content: T, options: Partial<CreateOptions> = {}): ExtendedTippyInstance<T> {
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
            instance.data = options.data;
            instance.$viewOptions.injector = Injector.create({
              providers: [
                {
                  provide: TIPPY_REF,
                  useValue: instance
                }
              ],
              parent: options.injector || this.injector
            });
          }
        }
        if (!instance.view) {
          instance.view = this.view.createView(content, { ...options, ...instance.$viewOptions });
        }
        instance.setContent(instance.view.getElement());
        options?.onShow?.(instance);
      },
      onHidden: instance => {
        if (!options.preserveView) {
          instance.view.destroy();
          instance.view = null;
        }
        options?.onHidden?.(instance);
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

    return tippy(host, config) as ExtendedTippyInstance<T>;
  }
}
