import {
  AfterViewInit,
  ComponentFactoryResolver,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  TemplateRef,
  ViewContainerRef,
  ViewRef
} from '@angular/core';
import tippy, { Instance, Props } from 'tippy.js';
import { Content, NgChanges, TIPPY_CONFIG, TippyConfig } from './tippy.types';
import { dimensionsChanges } from './utils';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[tippy]',
  exportAs: 'tippy'
})
export class TippyDirective implements OnChanges, AfterViewInit, OnDestroy {
  @Input() appendTo: Props['appendTo'];
  @Input() delay: Props['delay'];
  @Input() duration: Props['duration'];
  @Input() hideOnClick: Props['hideOnClick'];
  @Input() interactive: Props['interactive'];
  @Input() interactiveBorder: Props['interactiveBorder'];
  @Input() maxWidth: Props['maxWidth'];
  @Input() offset: Props['offset'];
  @Input() placement: Props['placement'];
  @Input() popperOptions: Props['popperOptions'];
  @Input() showOnCreate: Props['showOnCreate'];
  @Input() trigger: Props['trigger'];
  @Input() triggerTarget: Props['triggerTarget'];
  @Input() zIndex: Props['zIndex'];

  @Input() lazy: boolean;
  @Input() variation: string;
  @Input() isEnable: boolean;
  @Input() className: string;
  @Input() onlyTextOverflow = false;

  @Input('tippy') content: Content;

  @Output() visible = new EventEmitter<boolean>();

  private instance: Instance;
  private view: Content;
  private viewRef: ViewRef;
  private destroyed = new Subject();

  constructor(
    @Inject(TIPPY_CONFIG) private config: Partial<TippyConfig>,
    private resolver: ComponentFactoryResolver,
    private vcr: ViewContainerRef,
    private zone: NgZone,
    private host: ElementRef
  ) {}

  ngOnChanges(changes: NgChanges<TippyDirective>) {
    if (changes.content) {
      this.view = changes.content.currentValue;
    }

    if (!this.instance) {
      const variation = changes.variation?.currentValue || this.config.defaultVariation;

      this.instance = tippy(
        this.host.nativeElement as HTMLElement,
        mergeVariation(this.config.variations[variation], {
          content: undefined,
          allowHTML: true,
          appendTo: this.resolveValue('appendTo'),
          delay: this.resolveValue('delay'),
          duration: this.resolveValue('duration'),
          hideOnClick: this.resolveValue('hideOnClick'),
          interactive: this.resolveValue('interactive'),
          interactiveBorder: this.resolveValue('interactiveBorder'),
          maxWidth: this.resolveValue('maxWidth'),
          offset: this.resolveValue('offset'),
          placement: this.resolveValue('placement'),
          popperOptions: this.resolveValue('popperOptions'),
          showOnCreate: this.resolveValue('showOnCreate'),
          trigger: this.resolveValue('trigger'),
          triggerTarget: this.resolveValue('triggerTarget'),
          zIndex: this.resolveValue('zIndex'),
          onCreate: instance => {
            this.className && instance.popper.classList.add(this.className);
            this.config.onCreate?.(instance);
          },
          onShow: instance => {
            this.zone.run(() => this.instance.setContent(this.resolveContent()));
            this.visible.next(true);
            this.config.onShow?.(instance);
          },
          onHidden: instance => {
            this.destroyView();
            this.visible.next(false);
            this.config.onHidden?.(instance);
          }
        })
      );
    } else {
      let props: Partial<TippyConfig> = Object.keys(changes).reduce((acc, change) => {
        acc[change] = changes[change].currentValue;

        return acc;
      }, {});

      if (isChanged<NgChanges<TippyDirective>>('variation', changes)) {
        props = {
          ...this.config.variations?.[changes.variation.currentValue],
          ...props
        };
      }

      this.instance.setProps(props);
    }

    if (isChanged<NgChanges<TippyDirective>>('isEnable', changes)) {
      changes.isEnable.currentValue ? this.enable() : this.disable();
    }
  }

  ngAfterViewInit() {
    if (this.onlyTextOverflow) {
      dimensionsChanges(this.host.nativeElement)
        .pipe(takeUntil(this.destroyed))
        .subscribe(() => {
          this.isElementOverflow() ? this.enable() : this.disable();
        });
    }
  }

  private resolveContent() {
    if (typeof this.view === 'string') {
      return this.view;
    }

    if (this.view instanceof TemplateRef) {
      this.viewRef = this.vcr.createEmbeddedView(this.view, {
        $implicit: this.hide.bind(this)
      });
      return (this.viewRef as EmbeddedViewRef<any>).rootNodes[0];
    } else {
      const factory = this.resolver.resolveComponentFactory(this.view);
      const ref = this.vcr.createComponent(factory);
      this.viewRef = ref.hostView;

      return ref.location.nativeElement;
    }
  }

  private isElementOverflow() {
    const element = this.host.nativeElement;
    const parentEl = element.parentElement;
    const parentTest = element.offsetWidth > parentEl.offsetWidth;
    const elementTest = element.offsetWidth < element.scrollWidth;

    return parentTest || elementTest;
  }

  ngOnDestroy() {
    this.destroyed.next();
  }

  destroyView() {
    this.viewRef?.destroy();
  }

  show() {
    this.instance?.show();
  }

  hide() {
    this.instance?.hide();
  }

  enable() {
    this.instance?.enable();
  }

  disable() {
    this.instance?.disable();
  }

  destroy() {
    this.instance?.destroy();
  }

  private resolveValue(key: keyof this) {
    return this[key] !== undefined ? this[key] : this.config[key as any];
  }
}

function isChanged<T>(key: keyof T, changes: T) {
  return key in changes;
}

function mergeVariation(variation: TippyConfig['variations'][0], options: Partial<TippyConfig>) {
  return Object.keys(variation).reduce((acc, variationOption) => {
    if (options[variationOption] === undefined) {
      acc[variationOption] = variation[variationOption];
    }

    return acc;
  }, options);
}
