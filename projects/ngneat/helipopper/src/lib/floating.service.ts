import { inject, Injectable, Injector, NgZone, signal } from '@angular/core';
import {
  isComponent,
  isTemplateRef,
  ResolveViewRef,
  ViewService,
} from '@ngneat/overview';
import { Content } from '@ngneat/overview';
import { map, Observable } from 'rxjs';

import {
  CreateOptions,
  ExtendedFloatingInstance,
  FLOATING_CONFIG,
  FloatingInstance,
} from '@ngneat/helipopper/config';

import { FLOATING_REF } from './inject-floating';
import { FloatingFactory } from './floating.factory';
import { FloatingInstanceImpl } from './floating-instance';
import { normalizeClassName, onlyFloatingProps } from './utils';

@Injectable({ providedIn: 'root' })
export class FloatingService {
  private readonly _ngZone = inject(NgZone);
  private readonly _injector = inject(Injector);
  private readonly _globalConfig = inject(FLOATING_CONFIG, { optional: true });
  private readonly _viewService = inject(ViewService);
  private readonly _floatingFactory = inject(FloatingFactory);

  readonly enabled = signal(true);

  enableAll(): void {
    this.enabled.set(true);
  }

  disableAll(): void {
    this.enabled.set(false);
  }

  create<T extends Content>(
    host: HTMLElement,
    content: T,
    options: Partial<CreateOptions> = {},
  ): Observable<ExtendedFloatingInstance<T>> {
    const variation = options.variation || this._globalConfig?.defaultVariation || '';
    const config = {
      onShow: (instance: ExtendedFloatingInstance<T>) => {
        host.setAttribute('data-tippy-open', '');
        if (!instance.$viewOptions) {
          instance.$viewOptions = {
            injector: Injector.create({
              providers: [
                {
                  provide: FLOATING_REF,
                  useValue: instance,
                },
              ],
              parent: options.injector || this._injector,
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

        instance.view ||= this._viewService.createView(content, {
          ...options,
          ...instance.$viewOptions,
        }) as ResolveViewRef<T>;

        instance.setContent(instance.view.getElement());
        options?.onShow?.(instance);
      },
      onHidden: (instance: ExtendedFloatingInstance<T>) => {
        host.removeAttribute('data-tippy-open');

        if (!options.preserveView) {
          instance.view?.destroy();
          instance.view = null;
        }
        options?.onHidden?.(instance);
      },
      ...onlyFloatingProps(this._globalConfig),
      ...this._globalConfig?.variations?.[variation],
      ...onlyFloatingProps(options),
      onCreate: (instance: FloatingInstance) => {
        instance.popper.classList.add(`tippy-variation-${variation}`);
        if (options.className) {
          for (const klass of normalizeClassName(options.className)) {
            instance.popper.classList.add(klass);
          }
        }
        this._globalConfig?.onCreate?.(instance);
        options.onCreate?.(instance);
      },
    };

    return this._floatingFactory
      .getFloatingImpl()
      .pipe(
        map((ui) =>
          this._ngZone.runOutsideAngular(
            () =>
              new FloatingInstanceImpl(
                host,
                config,
                ui,
              ) as unknown as ExtendedFloatingInstance<T>,
          ),
        ),
      );
  }
}

// ---------------------------------------------------------------------------
// Deprecated alias kept for backwards compatibility
// ---------------------------------------------------------------------------

/** @deprecated Use `FloatingService` instead. */
export { FloatingService as TippyService };
