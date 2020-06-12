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

> A Powerful Tooltip and Popover for Angular Applications

[Tippy.js](https://atomiks.github.io/tippyjs/v6/getting-started/) is the complete tooltip, popover, dropdown, and menu solution for the web, powered by Popper.js.

It is an abstraction over Popper that provides the logic and optionally the styling involved in all types of elements that pop out from the flow of the document and get overlaid on top of the UI, positioned next to a reference element.

This is a lightweight wrapper with additional features that lets you use it declaratively in Angular. Tippy has virtually no restrictions over Popper and gives you limitless control while providing useful behavior and defaults.

## Features

✅ Tooltip & Popover Variations <br>
✅ TemplateRef Support<br>
✅ Lazy Registration<br>
✅ Manual Trigger Support<br>
✅ Text Overflow Support<br>
✅ Sticky Support

## Installation
```
npm install @ngneat/helipopper
```

Add the `HelipopperModule` to your `AppModule`:

```ts
import { HelipopperModule } from '@ngneat/helipopper';

@NgModule({
  declarations: [AppComponent],
  imports: [HelipopperModule.forRoot()],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

Now you can use it:

```html
<button helipopper="Helpful Message">
  I have a tooltip
</button>
```

#### TemplateRef:

```html
<button [helipopper]="tpl" helipopperVariation="popper">
  Click Me
</button>

<ng-template #tpl>
  <div *ngFor="let msg of messages">{{ msg }}</div>
  <button (click)="talk()">Click to talk ☮️️</button>
</ng-template>
```

#### Text Overflow:

```html
<ul style="max-width: 100px;">
  <li class="ellipsis"
      [helipopper]="text"
      helipopperPlacement="right"
      [helipopperTextOverflow]="true">
      {{ text }}
  </li>
</ul>
```

#### Manual Trigger:

```html
<span helipopper="Helpful Message" 
      helipopperTrigger="manual" 
      #tooltip="helipopper">Click Open to see me</span>

<button (click)="tooltip.show()">Open</button>
<button (click)="tooltip.hide()">Close</button>
```

You can see more examples in our [playground](https://github.com/ngneat/helipopper/blob/master/src/app/app.component.html).

## Styling
Add the following style to your main `scss` file:

```scss
@import '~tippy.js/dist/tippy.css';
@import '~tippy.js/themes/light.css';
@import '~tippy.js/animations/scale.css';

.tippy-content {
  position: relative;
}

.tippy-close {
  position: absolute;
  width: 24px;
  height: 24px;
  top: 9px;
  right: 9px;
  fill: rgb(158, 160, 165);
  cursor: pointer;
}

.tippy-box {
  border-radius: 4px;
  font-size: 11px;

  .tippy-content {
    padding: 4px 6px;
  }
}

.tippy-box[data-theme~='light'] {
  font-size: 12px;
  word-break: break-word;
  border-radius: 0;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.2);
  color: rgb(79, 80, 83);

  .tippy-content {
    padding: 13px 48px 13px 20px;
  }
}

.tippy-arrow::before {
  box-shadow: -4px 4px 14px -4px rgba(0, 0, 0, 0.2);
}
```

You have the freedom to [customize](https://atomiks.github.io/tippyjs/v6/themes/) it if you need to.

## Inputs

| @Input                 | Type                      | Description                                                  | Default                                                                |
|------------------------|---------------------------|--------------------------------------------------------------|------------------------------------------------------------------------|
| helipopperVariation    | `tooltip` \| `popper`     | The tooltip type                                             | `tooltip`                                                              |
| helipopper             | `string` \| `TemplateRef` | The tooltip content                                          | `none`                                                                 |
| helipopperPlacement    | `Popper placement`        | The tooltip placement                                        | `bottom`                                                               |
| helipopperClass        | `string` \| `string[]`    | Custom class that'll be added to the tooltip                 | `none`                                                                 |
| helipopperOffset       | `[number, number]`        | Set tooltip offset position                                  | `[0, 10]`                                                              |
| helipopperDisabled     | `Boolean`                 | Whether to disabled the tooltip                              | `false`                                                                |
| helipopperHost         | `ElementRef` \| `Element` | The target element                                           | `Host`                                                                 |
| helipopperAppendTo     | `string`\| `Element`      | The element to append the tooltip to                         | [`appendTo`](https://atomiks.github.io/tippyjs/v6/all-props/#appendto) |
| helipopperOptions      | `tippy` options           | `tippy` options                                              | [docs](https://atomiks.github.io/tippyjs/v6/all-props)                 |
| helipopperTextOverflow | `Boolean`                 | Show the tooltip only when the text overflows its container  | `false`                                                                |
| helipopperSticky       | `Boolean`                 | Whether the tooltip should be sticky (i.e. always displayed) | `false`                                                                |
| helipopperTarget       | `ElementRef` \| `Element` | The element(s) that the trigger event listeners are added to | `Host`                                                                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Ex: `{ width: '100%', height: '70px' }`                                                                                         |

## Config

- `beforeRender` - Hook that'll be called before rendering the tooltip content: ( applies only for string )
```ts
import { HelipopperModule } from '@ngneat/helipopper';

@NgModule({
  imports: [HelipopperModule.forRoot({
    beforeRender(content) {
      return sanitize(content);
    }
  })]
})
export class AppModule {}
```

- `closeIcon` - The svg close icon that'll be used inside the popper.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://www.netbasal.com/"><img src="https://avatars1.githubusercontent.com/u/6745730?v=4" width="100px;" alt=""/><br /><sub><b>Netanel Basal</b></sub></a><br /><a href="https://github.com/@ngneat/helipopper/commits?author=NetanelBasal" title="Code">💻</a> <a href="https://github.com/@ngneat/helipopper/commits?author=NetanelBasal" title="Documentation">📖</a> <a href="#ideas-NetanelBasal" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
Icon made by <a href="https://www.flaticon.com/authors/freepik" title="freepik">Airport</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
