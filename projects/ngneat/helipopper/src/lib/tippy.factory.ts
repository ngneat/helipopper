import type tippy from 'tippy.js';
import { inject, Injectable, NgZone } from '@angular/core';
import { defer, from, map, type Observable, of, shareReplay } from 'rxjs';
import { TIPPY_LOADER, type TippyProps } from '@ngneat/helipopper/config';

// We need to use `isPromise` instead of checking whether
// `value instanceof Promise`. In zone.js patched environments, `global.Promise`
// is the `ZoneAwarePromise`.
// `import(...)` returns a native promise (not a `ZoneAwarePromise`), causing
// `instanceof` check to be falsy.
function isPromise<T>(value: any): value is Promise<T> {
  return typeof value?.then === 'function';
}

@Injectable({ providedIn: 'root' })
export class TippyFactory {
  private readonly _ngZone = inject(NgZone);

  private readonly _loader = inject(TIPPY_LOADER);

  private _tippyImpl$: Observable<typeof tippy> | null = null;

  /**
   * This returns an observable because the user should provide a `loader`
   * function, which may return a promise if the tippy.js library is to be
   * loaded asynchronously.
   */
  create(target: HTMLElement, props?: Partial<TippyProps>) {
    // We use `shareReplay` to ensure that subsequent emissions are
    // synchronous and to avoid triggering the `defer` callback repeatedly
    // when new subscribers arrive.
    this._tippyImpl$ ||= defer(() => {
      const maybeTippy = this._ngZone.runOutsideAngular(() => this._loader());
      return isPromise(maybeTippy)
        ? from(maybeTippy).pipe(map((tippy) => tippy.default))
        : of(maybeTippy);
    }).pipe(shareReplay());

    return this._tippyImpl$.pipe(
      map((tippy) => {
        return this._ngZone.runOutsideAngular(() => tippy(target, props));
      })
    );
  }
}
