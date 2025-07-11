import type tippy from 'tippy.js';
import { inject, Injectable, NgZone, ɵisPromise as isPromise } from '@angular/core';
import { defer, map, Observable, of, tap } from 'rxjs';
import { TIPPY_LOADER, type TippyProps } from '@ngneat/helipopper/config';

@Injectable({ providedIn: 'root' })
export class TippyFactory {
  private readonly _ngZone = inject(NgZone);

  private readonly _loader = inject(TIPPY_LOADER);

  private _tippyImpl$: Observable<typeof tippy> | null = null;
  private _tippy: typeof tippy | null = null;

  /**
   * This returns an observable because the user should provide a `loader`
   * function, which may return a promise if the tippy.js library is to be
   * loaded asynchronously.
   */
  create(target: HTMLElement, props?: Partial<TippyProps>) {
    this._tippyImpl$ ||= defer(() => {
      if (this._tippy) return of(this._tippy);

      // Call the `loader` function lazily — only when a subscriber
      // arrives — to avoid importing `tippy.js` on the server.
      const maybeTippy = this._ngZone.runOutsideAngular(() => this._loader());

      let tippy$: Observable<typeof tippy>;
      // We need to use `isPromise` instead of checking whether
      // `result instanceof Promise`. In zone.js patched environments, `global.Promise`
      // is the `ZoneAwarePromise`. Some APIs, which are likely not patched by zone.js
      // for certain reasons, might not work with `instanceof`. For instance, the dynamic
      // import `() => import('./chunk.js')` returns a native promise (not a `ZoneAwarePromise`),
      // causing this check to be falsy.
      if (isPromise(maybeTippy)) {
        // This pulls less RxJS symbols compared to using `from()` to resolve a promise value.
        tippy$ = new Observable((subscriber) => {
          maybeTippy.then((tippy) => {
            subscriber.next(tippy.default);
            subscriber.complete();
          });
        });
      } else {
        tippy$ = of(maybeTippy);
      }

      return tippy$.pipe(
        tap((tippy) => {
          this._tippy = tippy;
        })
      );
    });

    return this._tippyImpl$.pipe(
      map((tippy) => {
        return this._ngZone.runOutsideAngular(() => tippy(target, props));
      })
    );
  }
}
