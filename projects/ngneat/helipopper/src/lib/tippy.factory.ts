import type tippy from 'tippy.js';
import { inject, Injectable, NgZone } from '@angular/core';
import { defer, from, map, type Observable, of, shareReplay } from 'rxjs';

import { TIPPY_CONFIG, type TippyProps } from './tippy.types';

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

  private readonly _config = inject(TIPPY_CONFIG);

  private _tippy$: Observable<typeof tippy> | null = null;

  create(target: HTMLElement, props?: Partial<TippyProps>) {
    this._tippy$ = defer(() => {
      const maybeTippy = this._ngZone.runOutsideAngular(() => this._config.loader());
      return isPromise(maybeTippy) ? from(maybeTippy).pipe(map((tippy) => tippy.default)) : of(maybeTippy);
    }).pipe(shareReplay());

    return this._tippy$.pipe(
      map((tippy) => {
        return this._ngZone.runOutsideAngular(() => tippy(target, props));
      })
    );
  }
}
