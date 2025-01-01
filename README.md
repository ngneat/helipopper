<p align="center">
 <img width="20%" height="20%" src="./logo.svg">
</p>

<br />

[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
[![ngneat](https://img.shields.io/badge/@-ngneat-383636?style=flat-square&labelColor=8f68d4)](https://github.com/ngneat/)
[![spectator](https://img.shields.io/badge/tested%20with-spectator-2196F3.svg?style=flat-square)]()
[![@ngneat/helipopper](https://github.com/ngneat/helipopper/workflows/@ngneat/helipopper/badge.svg)]()

> A Powerful Tooltip and Popover for Angular Applications

[Tippy.js](https://atomiks.github.io/tippyjs/v6/getting-started/) is the complete tooltip, popover, dropdown, and menu
solution for the web, powered by Popper.js.

It is an abstraction over Popper that provides the logic and optionally the styling involved in all types of elements
that pop out from the flow of the document and get overlaid on top of the UI, positioned next to a reference element.

This is a lightweight wrapper with additional features that lets you use it declaratively in Angular. Tippy has
virtually no restrictions over Popper and gives you limitless control while providing useful behavior and defaults.

If you're using v1 and don't want to migrate, you can find it [here](https://github.com/ngneat/helipopper/tree/v1).

## Features

✅ Position Tooltips, Menus, Dropdowns, and Popovers <br>
✅ Predefined Variations <br>
✅ TemplateRef/Component Support<br>
✅ Lazy Registration<br>
✅ Manual Trigger Support<br>
✅ Text Overflow Support<br>
✅ Context Menu Support<br>

### Installation

```sh
$ npm i @ngneat/helipopper
# Or if you're using yarn
$ yarn add @ngneat/helipopper
# Or if you're using pnpm
$ pnpm i @ngneat/helipopper
```

Configure it as shown below:

```ts
import { provideTippyLoader provideTippyConfig, tooltipVariation, popperVariation } from '@ngneat/helipopper/config';

bootstrapApplication(AppComponent, {
  providers: [
    provideTippyLoader(() => import('tippy.js')),
    provideTippyConfig({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
      },
    }),
  ],
});
```

Please note that the `provideTippyLoader` is required, as it specifies how Tippy is loaded - either synchronously or asynchronously. When dynamic import is used, the library will load only when the first Tippy directive is rendered. If we want it to load synchronously, we use the following:

```ts
import tippy from 'tippy.js';

provideTippyLoader(() => tippy);
```

Add the styles you want to `styles.scss`:

```scss
@import 'tippy.js/dist/tippy.css';
@import 'tippy.js/themes/light.css';
@import 'tippy.js/animations/scale.css';
```

You have the freedom to [customize](https://atomiks.github.io/tippyjs/v6/themes/) it if you need to.

Import the standalone `TippyDirective` in your components:

```ts
import { TippyDirective } from '@ngneat/helipopper';

@Component({
  standalone: true,
  imports: [TippyDirective],
})
class ExampleComponent {}
```

And use it in your templates:

```html
<button tp="Helpful Message">I have a tooltip</button>
```

The library exposes default variations for `tooltip` and `popper`. You can use them, extend them, or pass your own
variations. A `variation` is a set of predefined `tippy` properties. For example, here's how the built-in `tooltip`
variation looks like:

```ts
export const tooltipVariation = {
  theme: null,
  arrow: false,
  animation: 'scale',
  trigger: 'mouseenter',
  offset: [0, 5],
};
```

### Use `TemplateRef` as content

```html
<button [tp]="tpl" tpVariation="popper">Click Me</button>

<ng-template #tpl let-hide>
  <h6>Popover title</h6>
  <p>And here's some amazing content. It's very engaging. Right?</p>
</ng-template>
```

### Use `Component` as content

```ts
import type { TippyInstance } from '@ngneat/helipopper/config';
import { injectTippyRef } from '@ngneat/helipopper';

@Component()
class MyComponent {
  tippy = injectTippyRef();
}
```

```html
<button [tp]="MyComponent">Click Me</button>
```

### Text Overflow

You can pass the `onlyTextOverflow` input to show the tooltip only when the host overflows its container:

```html
<div style="max-width: 100px;" class="overflow-hidden flex">
  <p class="ellipsis" [tp]="text" tpPlacement="right" [tpOnlyTextOverflow]="true">
    {{ text }}
  </p>
</div>
```

Note: this feature is using [`ResizeObserver`](https://caniuse.com/resizeobserver) api.

You might have cases where the host has a static width and the content is dynamic. In this case, use the `tpStaticWidthHost` input with combination with `tpOnlyTextOverflow`:

```html
<div style="max-width: 100px;" class="overflow-hidden flex">
  <p
    style="width: 100px"
    class="ellipsis"
    [tp]="dynamicText"
    tpPlacement="right"
    [tpOnlyTextOverflow]="true"
    tpStaticWidthHost
  >
    {{ dynamicText }}
  </p>
</div>
```

Note: when using `tpStaticWidthHost` you can't use `tpUseTextContent`, you need to explicitly pass the content to `tp` in order to trigger content change.

### Use Text Content

You can instruct tippy to use the element textContent as the tooltip content:

```html
<p tp tpUseTextContent>{{ text }}</p>
```

### Lazy

You can pass the `tpIsLazy` input when you want to defer the creation of tippy only when the element is in the view:

```html
<div *ngFor="let item of items" [tp]="item.label" [tpIsLazy]="true">{{ item.label }}</div>
```

Note that it's using [`IntersectionObserver`](https://caniuse.com/intersectionobserver) api.

### Context Menu

First, define the `contextMenu` variation:

```ts
import {
  popperVariation,
  tooltipVariation,
  provideTippyConfig,
  withContextMenuVariation,
} from '@ngneat/helipopper/config';

bootstrapApplication(AppComponent, {
  providers: [
    provideTippyConfig({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
        contextMenu: withContextMenuVariation(popperVariation),
      },
    }),
  ],
});
```

Now you can use it in your template:

```html
<ng-template #contextMenu let-hide let-item="data">
  <ul>
    <li (click)="copy(item); hide()">Copy</li>
    <li (click)="duplicate(item); hide()">Duplicate</li>
  </ul>
</ng-template>

<ul>
  <li
    *ngFor="let item of list"
    [tp]="contextMenu"
    [tpData]="item"
    tpVariation="contextMenu"
  >
    {{ item.label }}
  </li>
</ul>
```

### Manual Trigger

```html
<div tp="Helpful Message" tpTrigger="manual" #tooltip="tippy">Click Open to see me</div>

<button (click)="tooltip.show()">Open</button>
<button (click)="tooltip.hide()">Close</button>
```

### Declarative show/hide

Use isVisible to trigger show and hide. Set trigger to manual.

```html
<div tp="Helpful Message" tpTrigger="manual" [tpIsVisible]="visibility">
  Click Open to see me
</div>

<button (click)="visibility = true">Open</button>
<button (click)="visibility = false">Close</button>
```

You can see more examples in
our [playground](https://github.com/ngneat/helipopper/blob/master/src/app/app.component.html), or
live [here](https://ngneat.github.io/helipopper/).

### Inputs

```ts
tp: string | TemplateRef<any> | Type<any> | undefined | null;
tpAppendTo: TippyProps['appendTo'];
tpDelay: TippyProps['delay'];
tpDuration: TippyProps['duration'];
tpHideOnClick: TippyProps['hideOnClick'];
tpInteractive: TippyProps['interactive'];
tpInteractiveBorder: TippyProps['interactiveBorder'];
tpMaxWidth: TippyProps['maxWidth'];
tpOffset: TippyProps['offset'];
tpPlacement: TippyProps['placement'];
tpPopperOptions: TippyProps['popperOptions'];
tpShowOnCreate: TippyProps['showOnCreate'];
tpTrigger: TippyProps['trigger'];
tpTriggerTarget: TippyProps['triggerTarget'];
tpZIndex: TippyProps['zIndex'];
tpAnimation: TippyProps['animation'];
tpUseTextContent: boolean;
tpIsLazy: boolean;
tpVariation: string;
tpIsEnabled: boolean;
tpIsVisible: boolean;
tpClassName: string;
tpOnlyTextOverflow: boolean;
tpData: any;
tpUseHostWidth: boolean;
tpHideOnEscape: boolean;
tpDetectChangesComponent: boolean;
tpPopperWidth: number | string;
tpHost: HTMLElement;
tpIsVisible: boolean;
```

### Outputs

```ts
tpVisible = new EventEmitter<boolean>();
```

### Global Config

- You can pass any `tippy` option at global config level.
- `beforeRender` - Hook that'll be called before rendering the tooltip content ( applies only for string )

### Create `tippy` Programmatically

```typescript
import type { TippyInstance } from '@ngneat/helipopper/config';
import { TippyService } from '@ngneat/helipopper';

class Component {
  @ViewChild('inputName') inputName: ElementRef;
  tippy: TippyInstance;
  private tippyService = inject(TippyService);

  async show() {
    if (!this.tippy) {
      this.tippy = await firstValueFrom(
        this.tippyService.create(this.inputName, 'this field is required')
      );
    }

    this.tippy.show();
  }

  ngOnDestroy() {
    this.tippy?.destroy();
  }
}
```

## Contributors ✨

Thank goes to all these wonderful [people who contributed](https://github.com/ngneat/helipopper/graphs/contributors) ❤️
