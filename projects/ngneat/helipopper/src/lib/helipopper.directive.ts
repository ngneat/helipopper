import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  Inject,
  Injector,
  Input,
  NgZone,
  OnDestroy,
  Output,
  TemplateRef,
  Type
} from '@angular/core';
import tippy, { Instance, Props } from 'tippy.js';
import { fromEvent, Subject } from 'rxjs';
import { Options as PopperOptions } from '@popperjs/core';
import {
  addClass,
  closest,
  coerceElement,
  createElement,
  dimensionsChanges,
  inView,
  isString,
  TemplatePortal
} from './utils';
import { takeUntil } from 'rxjs/operators';
import { HELIPOPPER_CONFIG, HelipopperConfig, InstanceWithClose, Variation } from './helipopper.types';
import { initialHelipopperOptions as initialOptions } from './helipopper-options';

const icon = `
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fit="" preserveAspectRatio="xMidYMid meet" focusable="false">
<path d="M12.793 12l4.039-4.025c0.219-0.219 0.224-0.578 0.012-0.802-0.213-0.225-0.563-0.231-0.782-0.011l-4.062 4.049-4.062-4.049c-0.219-0.22-0.569-0.213-0.782 0.011s-0.208 0.583 0.012 0.802l4.039 4.025-4.039 4.025c-0.22 0.219-0.224 0.578-0.012 0.802 0.108 0.115 0.252 0.172 0.397 0.172 0.138 0 0.278-0.053 0.385-0.161l4.062-4.049 4.062 4.049c0.107 0.108 0.245 0.161 0.385 0.161 0.144 0 0.287-0.058 0.397-0.172 0.212-0.225 0.207-0.583-0.012-0.802l-4.039-4.025z"></path>
</svg>
      `;

type Content = string | TemplateRef<any> | Type<any>;

@Directive({ selector: `[helipopper]`, exportAs: 'helipopper' })
export class HelipopperDirective implements OnDestroy {
  @Input()
  helipopperOptions: Partial<Props> = initialOptions.options;

  @Input('helipopperTextOverflow')
  showOnlyOnTextOverflow = initialOptions.textOverflow;

  // The element that the trigger event listeners are added to
  @Input()
  triggerTarget: Element;

  @Input()
  helipopperHost: Element;

  @Input()
  helipopperAppendTo: string | HTMLElement = initialOptions.appendTo;

  @Input()
  helipopperTrigger: string | undefined;

  @Input()
  helipopperAllowClose: boolean = initialOptions.allowClose;

  @Input()
  helipopperClass: string | Array<string> | undefined;

  @Input()
  helipopperOffset: [number, number] | undefined;

  @Input('helipopperInjector')
  injector: Injector | undefined;

  @Input('helipopperPlacement')
  set placement(placement: PopperOptions['placement']) {
    this._placement = placement;
    this.setProps({ placement });
  }

  @Input('helipopperVariation')
  set variation(variation: Variation) {
    this._variation = variation;
    this.setProps(this.resolveTheme());
  }

  @Input('helipopperDisabled')
  set disabled(disabled: boolean) {
    this._disabled = disabled;
    this.markDisabled(this._disabled);
  }

  @Input('helipopperSticky')
  set sticky(isSticky: boolean) {
    if (!this.instance) {
      return;
    }

    if (isSticky) {
      this.setProps({ trigger: 'manual', hideOnClick: false });
      this.show();
    } else {
      this.hide();
      this.setProps({ trigger: this.helipopperTrigger });
    }
  }

  @Input() set helipopper(content: Content) {
    this._content = content;

    if (this.instance) {
      this.checkOverflow();
    } else {
      requestAnimationFrame(() => {
        inView(this.host.nativeElement)
          .pipe(takeUntil(this._destroy))
          .subscribe(() => this.create());
      });
    }
  }

  @Output() helipopperClose = new Subject();
  @Output() helipopperVisible = new Subject<boolean>();

  private _content: Content;
  private _destroy = new Subject();
  private _placement: PopperOptions['placement'] = initialOptions.placement;
  private _disabled = false;
  private _variation: Variation = initialOptions.variation;
  private instance: Instance;
  private tplPortal: TemplatePortal;
  private mergedConfig: HelipopperConfig;
  private innerComponentRef: ComponentRef<any>;
  public whenStable: Subject<boolean> = new Subject<boolean>();

  constructor(
    private host: ElementRef,
    private appRef: ApplicationRef,
    private zone: NgZone,
    private resolver: ComponentFactoryResolver,
    private hostInjector: Injector,
    @Inject(HELIPOPPER_CONFIG) private config: HelipopperConfig
  ) {
    this.mergedConfig = this.createConfig(config);
  }

  private get _tooltipTarget(): HTMLElement {
    return coerceElement(this.triggerTarget) || this.host.nativeElement;
  }

  private get _tooltipHost(): HTMLElement {
    return coerceElement(this.helipopperHost) || this.host.nativeElement;
  }

  private get isTooltip() {
    return this._variation === 'tooltip';
  }

  private get isPopper() {
    return this._variation === 'popper';
  }

  setProps(props: Partial<Props>) {
    this.instance && this.instance.setProps(props);
  }

  hide() {
    this.instance.hide();
  }

  show() {
    this.instance.show();
  }

  ngOnDestroy() {
    this.destroyView();
    this.instance && this.instance.destroy();
    this.instance = null;
    this._destroy.next();
  }

  destroy() {
    this.ngOnDestroy();
  }

  private destroyView() {
    this.tplPortal && this.destroyTemplate();
    this.innerComponentRef && this.destroyComponent();
  }

  private create() {
    this.zone.runOutsideAngular(() => this.createInstance());
  }

  private createInstance() {
    if (this.showOnlyOnTextOverflow) {
      dimensionsChanges(this._tooltipHost)
        .pipe(takeUntil(this._destroy))
        .subscribe(() => {
          this.markDisabled(this.isElementOverflow() === false);
        });
    }

    this.helipopperTrigger = this.resolveTrigger();

    this.instance = tippy(this._tooltipHost, {
      content: undefined,
      appendTo: this.getParent(),
      arrow: !this.isTooltip,
      allowHTML: true,
      zIndex: 1000000,
      trigger: this.helipopperTrigger,
      placement: this._placement,
      triggerTarget: this._tooltipTarget,
      hideOnClick: this.helipopperAllowClose,
      // TODO: Merge the following methods with the passed config
      onCreate: instance => {
        this.helipopperClass && addClass(instance.popper, this.helipopperClass);
      },
      onShow: instance => {
        this.zone.run(() => this.instance.setContent(this.resolveContent()));
        this.helipopperAllowClose && this.isPopper && this.addCloseButton(instance as InstanceWithClose);
        this.helipopperVisible.next(true);
      },
      onHidden: instance => {
        this.helipopperAllowClose && this.isPopper && this.removeCloseButton(instance as InstanceWithClose);
        this.destroyView();
        this.helipopperClose.next();
        this.helipopperVisible.next(false);
      },
      ...this.resolveTheme(),
      ...this.helipopperOptions
    });

    this.whenStable.next(true);
    this.markDisabled(this._disabled);
  }

  private resolveTrigger() {
    return this.helipopperTrigger || (this.isTooltip ? 'mouseenter' : 'click');
  }

  private resolveTemplate(content: TemplateRef<any>) {
    if (this.tplPortal) {
      this.destroyTemplate();
    }
    this.tplPortal = new TemplatePortal(content);
    this.appRef.attachView(this.tplPortal.viewRef);

    return this.tplPortal.elementRef;
  }

  private isElementOverflow() {
    const element = this._tooltipTarget;
    const parentEl = element.parentElement;
    const parentTest = element.offsetWidth > parentEl.offsetWidth;
    const elementTest = element.offsetWidth < element.scrollWidth;

    return parentTest || elementTest;
  }

  private getParent() {
    let containerElement;

    if (isString(this.helipopperAppendTo)) {
      containerElement = closest(this.host.nativeElement, this.helipopperAppendTo);
    } else {
      containerElement = this.helipopperAppendTo;
    }

    return containerElement || document.body;
  }

  private markDisabled(disabled = true) {
    if (this.instance) {
      disabled ? this.instance.disable() : this.instance.enable();
    }
  }

  private resolveTheme() {
    return {
      offset: this.helipopperOffset || ([0, this.isTooltip ? 5 : 10] as [number, number]),
      theme: this.isTooltip ? null : 'light',
      arrow: this.isTooltip === false,
      animation: this.isTooltip ? `scale` : null,
      interactive: !this.isTooltip
    };
  }

  private addCloseButton(instance: InstanceWithClose) {
    const popper = instance.popper;
    const closeIcon = this.mergedConfig.closeIcon;
    const closeButtonElement = createElement('div');
    addClass(closeButtonElement, 'tippy-close');
    closeButtonElement.innerHTML = closeIcon;

    const closeButtonSubscription = fromEvent(closeButtonElement, 'click').subscribe(() => this.hide());
    popper.appendChild(closeButtonElement);

    instance.closeButtonElement = closeButtonElement;
    instance.closeButtonSubscription = closeButtonSubscription;
  }

  private removeCloseButton(instance: InstanceWithClose) {
    instance.popper.removeChild(instance.closeButtonElement);
    instance.closeButtonSubscription.unsubscribe();
    instance.closeButtonElement = null;
    instance.closeButtonSubscription = null;
  }

  private checkOverflow() {
    if (this.showOnlyOnTextOverflow) {
      requestAnimationFrame(() => this.markDisabled(this.isElementOverflow() === false));
    }
  }

  private destroyTemplate() {
    this.appRef.detachView(this.tplPortal.viewRef);
    this.tplPortal.destroy();
    this.tplPortal = null;
  }

  private createConfig(config: HelipopperConfig) {
    const defaults: HelipopperConfig = {
      closeIcon: icon,
      beforeRender(content: string): string {
        return content;
      }
    };

    return {
      ...defaults,
      ...config
    };
  }

  private resolveComponent(content: Type<any>) {
    const factory = this.resolver.resolveComponentFactory(content);
    const injector = this.injector || this.hostInjector;
    this.innerComponentRef = factory.create(injector);
    this.appRef.attachView(this.innerComponentRef.hostView);
    this.innerComponentRef.hostView.detectChanges();
    return this.innerComponentRef.location.nativeElement;
  }

  private destroyComponent() {
    this.innerComponentRef.destroy();
    this.appRef.attachView(this.innerComponentRef.hostView);
    this.innerComponentRef = null;
  }

  private resolveContent() {
    const content = this._content;
    let finalContent;

    if (content instanceof TemplateRef) {
      finalContent = this.resolveTemplate(content);
    } else if (typeof content === 'string') {
      finalContent = this.mergedConfig.beforeRender(content);
    } else {
      finalContent = this.resolveComponent(content);
    }

    return finalContent;
  }
}
