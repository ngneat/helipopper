import { inject, Injectable, NgZone, ɵisPromise as isPromise } from '@angular/core';
import { defer, Observable, of, tap } from 'rxjs';

import { FLOATING_LOADER } from '@ngneat/helipopper/config';
import type { FloatingUIModule } from './floating-instance';

@Injectable({ providedIn: 'root' })
export class FloatingFactory {
  private readonly _ngZone = inject(NgZone);
  private readonly _loader = inject(FLOATING_LOADER);

  private _module$: Observable<FloatingUIModule> | null = null;
  private _module: FloatingUIModule | null = null;

  getFloatingImpl(): Observable<FloatingUIModule> {
    this._module$ ??= defer(() => {
      if (this._module) return of(this._module);

      const maybeModule = this._ngZone.runOutsideAngular(() => this._loader());

      let module$: Observable<FloatingUIModule>;
      if (isPromise(maybeModule)) {
        module$ = new Observable((subscriber) => {
          (maybeModule as Promise<FloatingUIModule>).then((m) => {
            subscriber.next(m);
            subscriber.complete();
          });
        });
      } else {
        module$ = of(maybeModule as FloatingUIModule);
      }

      return module$.pipe(tap((m) => (this._module = m)));
    });

    return this._module$;
  }
}
