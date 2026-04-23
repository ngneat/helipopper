import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-lazy-dummy',
  template: `<p data-cy="lazy-dummy-content">Lazy loaded!</p>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyDummyComponent {}
