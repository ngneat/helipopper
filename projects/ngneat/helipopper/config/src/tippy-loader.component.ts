import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tippy-loader',
  template: `<div class="tippy-loader" data-cy="tippy-loader"></div>`,
  styles: [
    `
      .tippy-loader {
        width: 20px;
        height: 20px;
        margin: 2px;
        border: 2px solid currentColor;
        border-top-color: transparent;
        border-radius: 50%;
        animation: tippy-spin 0.6s linear infinite;
      }

      @keyframes tippy-spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TippyLoaderComponent {}
