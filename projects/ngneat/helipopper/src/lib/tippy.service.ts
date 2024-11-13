import { inject, Inject, Injectable, Injector } from '@angular/core';
import { isComponent, isTemplateRef, ViewService } from '@ngneat/overview';
import { Content } from '@ngneat/overview';
import type { Observable } from 'rxjs';

import { CreateOptions, ExtendedTippyInstance, TIPPY_CONFIG, TIPPY_REF, TippyConfig } from './tippy.types';
import { normalizeClassName, onlyTippyProps } from './utils';
import { TippyFactory } from './tippy.factory';

@Injectable({ providedIn: 'root' })
export class TippyService {
  private readonly _tippyFactory = inject(TippyFactory);

  constructor(
    @Inject(TIPPY_CONFIG) private globalConfig: TippyConfig,
    private view: ViewService,
    private injector: Injector
  ) {}

  create<T extends Content>(
    host: HTMLElement,
    content: T,
    options: Partial<CreateOptions> = {}
  ): Observable<ExtendedTippyInstance<T>> {
    const variation = options.variation || this.globalConfig.defaultVariation;
    const config = {
      onShow: (instance) => {
        host.setAttribute('data-tippy-open', '');
        if (!instance.$viewOptions) {
          instance.$viewOptions = {};

          const injector = Injector.create({
            providers: [
              {
                provide: TIPPY_REF,
                useValue: instance,
              },
            ],
            parent: options.injector || this.injector,
          });

          instance.$viewOptions.injector = injector;

          if (isTemplateRef(content)) {
            instance.$viewOptions.context = {
              $implicit: instance.hide.bind(instance),
              ...options.context,
            };
          } else if (isComponent(content)) {
            instance.context = options.context;
            instance.data = options.data;
          }
        }
        if (!instance.view) {
          instance.view = this.view.createView(content, { ...options, ...instance.$viewOptions });
        }
        instance.setContent(instance.view.getElement());
        options?.onShow?.(instance);
      },
      onHidden: (instance) => {
        host.removeAttribute('data-tippy-open');

        if (!options.preserveView) {
          instance.view.destroy();
          instance.view = null;
        }
        options?.onHidden?.(instance);
      },
      ...onlyTippyProps(this.globalConfig),
      ...this.globalConfig.variations[variation],
      ...onlyTippyProps(options),
      onCreate: (instance) => {
        instance.popper.classList.add(`tippy-variation-${variation}`);
        if (options.className) {
          for (const klass of normalizeClassName(options.className)) {
            instance.popper.classList.add(klass);
          }
        }
        this.globalConfig.onCreate?.(instance);
        options.onCreate?.(instance);
      },
    };

    return this._tippyFactory.create(host, config) as Observable<ExtendedTippyInstance<T>>;
  }
}
