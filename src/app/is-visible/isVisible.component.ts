import { Component } from '@angular/core';
import { FloatingDirective } from '@ngneat/helipopper';

@Component({
  selector: 'app-is-visible',
  templateUrl: './isVisible.component.html',
  standalone: true,
  imports: [FloatingDirective],
})
export class IsVisibleComponent {
  visibility = true;
}
