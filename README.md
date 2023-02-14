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

```
npm install @ngneat/helipopper @ngneat/overview
```

Configure it as shown below:

```ts
import { provideTippyConfig, tooltipVariation, popperVariation } from '@ngneat/helipopper';

bootstrapApplication(AppComponent, {
  providers: [
    provideTippyConfig({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
      }
    })
  ]
})
```

Add the styles you want to `styles.scss`:

```scss
@import '~tippy.js/dist/tippy.css';
@import '~tippy.js/themes/light.css';
@import '~tippy.js/animations/scale.css';
```

You have the freedom to [customize](https://atomiks.github.io/tippyjs/v6/themes/) it if you need to.

Import the standalone `TippyDirective` and use it in your templates:

```html
<button tippy="Helpful Message">
  I have a tooltip
</button>
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
  offset: [0, 5]
};
```

### Use `TemplateRef` as content

```html
<button [tippy]="tpl" variation="popper">
  Click Me
</button>

<ng-template #tpl let-hide>
  <h6>Popover title</h6>
  <p>And here's some amazing content. It's very engaging. Right?</p>
</ng-template>
```

### Use `Component` as content

```ts
import { TIPPY_REF, TippyInstance } from '@ngneat/helipopper';

@Component()
class MyComponent {
  tippy = inject(TIPPY_REF);
}
```

```html
<button [tippy]="MyComponent">
  Click Me
</button>
```

### Text Overflow

You can pass the `onlyTextOverflow` input to show the tooltip only when the host overflows its container:

```html
<div style="max-width: 100px;" class="overflow-hidden flex">
  <p class="ellipsis" [tippy]="text" placement="right" [onlyTextOverflow]="true">
    {{ text }}
  </p>
</div>
```

Note that it's using [`ResizeObserver`](https://caniuse.com/resizeobserver) api.

### Use Text Content

You can instruct tippy to use the element textContent as the tooltip content:

```html
<p tippy useTextContent>
  {{ text }}
</p>
```


### Lazy

You can pass the `lazy` input when you want to defer the creation of tippy only when the element is in the view:

```html
<div *ngFor="let item of items" 
     [tippy]="item.label" 
     [lazy]="true">{{ item.label }}
</div>
```

Note that it's using [`IntersectionObserver`](https://caniuse.com/intersectionobserver) api.

### Context Menu
First, define the `contextMenu` variation:
```ts
import { 
  popperVariation, 
  tooltipVariation, 
  provideTippyConfig,
  withContextMenuVariation 
} from '@ngneat/helipopper';

bootstrapApplication(AppComponent, {
  providers: [
    provideTippyConfig({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
        contextMenu: withContextMenuVariation(popperVariation),
      }
    })
  ]
})
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
  <li *ngFor="let item of list" 
      [tippy]="contextMenu" 
      [data]="item" 
      variation="contextMenu">
    {{ item.label }}
  </li>
</ul>
```

### Manual Trigger

```html
<div tippy="Helpful Message" trigger="manual" #tooltip="tippy">
  Click Open to see me
</div>

<button (click)="tooltip.show()">Open</button>
<button (click)="tooltip.hide()">Close</button>
```

### Show/hide declarativly

Use isVisible to trigger show and hide. Set trigger to manual.

```html
<div tippy="Helpful Message" trigger="manual" [isVisible]="visibility">
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
appendTo: TippyProps['appendTo'];
delay: TippyProps['delay'];
duration: TippyProps['duration'];
hideOnClick: TippyProps['hideOnClick'];
interactive: TippyProps['interactive'];
interactiveBorder: TippyProps['interactiveBorder'];
maxWidth: TippyProps['maxWidth'];
offset: TippyProps['offset'];
placement: TippyProps['placement'];
popperOptions: TippyProps['popperOptions'];
showOnCreate: TippyProps['showOnCreate'];
trigger: TippyProps['trigger'];
triggerTarget: TippyProps['triggerTarget'];
zIndex: TippyProps['zIndex'];
tippyHost: HTMLElement;

useTextContent: boolean;
lazy: boolean;
variation: string;
isEnabled: boolean;
isVisible: boolean;
className: string;
onlyTextOverflow: boolean;
useHostWidth: boolean;
hideOnEscape: boolean;
data: any;
```

### Outputs

```ts
visible = new EventEmitter<boolean>();
```

### Global Config
- You can pass any `tippy` option at global config level. 
- `beforeRender` - Hook that'll be called before rendering the tooltip content ( applies only for string )

### Create `tippy` Programmatically

```typescript
import { TippyService, TippyInstance } from '@ngneat/helipopper';

class Component {
  @ViewChild('inputName') inputName: ElementRef;
  private tippy = inject(TippyService);

  show() {
    if(!this.tippy) {
      this.tippy = this.tippy.create(this.inputName, 'this field is required');
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
