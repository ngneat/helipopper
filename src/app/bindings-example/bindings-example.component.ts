import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-bindings-example',
  template: '<p>Greeting: {{ greeting() }}</p>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class BindingsExampleComponent {
  readonly greeting = input<string>('');
}
