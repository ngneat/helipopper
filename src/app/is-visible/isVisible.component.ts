import { Component } from '@angular/core';
import { TippyDirective } from '@ngneat/helipopper';

@Component({
  selector: 'app-is-visible',
  templateUrl: './isVisible.component.html',
  standalone: true,
  imports: [TippyDirective],
})
export class IsVisibleComponent {
  visibility = true;
}
