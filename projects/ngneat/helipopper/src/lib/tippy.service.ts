import { inject, Inject, Injectable, Injector } from '@angular/core';
import {
  isComponent,
  isTemplateRef,
  ResolveViewRef,
  ViewService,
} from '@ngneat/overview';
import { Content } from '@ngneat/overview';
import type { Observable } from 'rxjs';

import {
  CreateOptions,
  ExtendedTippyInstance,
  TIPPY_CONFIG,
  TippyConfig,
  TippyInstance,
} from '@ngneat/helipopper/config';

import { TIPPY_REF } from './inject-tippy';
import { TippyFactory } from './tippy.factory';
import { normalizeClassName, onlyTippyProps } from './utils';

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
    const variation = options.variation || this.globalConfig.defaultVariation || '';
    const config = {
      onShow: (instance: ExtendedTippyInstance<T>) => {
        host.setAttribute('data-tippy-open', '');
        if (!instance.$viewOptions) {
          instance.$viewOptions = {
            injector: Injector.create({
              providers: [
                {
                  provide: TIPPY_REF,
                  useValue: instance,
                },
              ],
              parent: options.injector || this.injector,
            }),
          };

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

        instance.view ||= this.view.createView(content, {
          ...options,
          ...instance.$viewOptions,
        }) as ResolveViewRef<T>;

        instance.setContent(instance.view.getElement());
        options?.onShow?.(instance);
      },
      onHidden: (instance: ExtendedTippyInstance<T>) => {
        host.removeAttribute('data-tippy-open');

        if (!options.preserveView) {
          instance.view?.destroy();
          instance.view = null;
        }
        options?.onHidden?.(instance);
      },
      ...onlyTippyProps(this.globalConfig),
      ...this.globalConfig.variations?.[variation],
      ...onlyTippyProps(options),
      onCreate: (instance: TippyInstance) => {
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

    return this._tippyFactory.create(host, config) as Observable<
      ExtendedTippyInstance<T>
    >;
  }
}
