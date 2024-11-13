import {
  AfterViewInit,
  booleanAttribute,
  Directive,
  ElementRef,
  EventEmitter,
  inject,
  Inject,
  Injector,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewContainerRef,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import type { Instance } from 'tippy.js';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { Content, isComponent, isString, isTemplateRef, ViewOptions, ViewRef, ViewService } from '@ngneat/overview';

import {
  coerceCssPixelValue,
  dimensionsChanges,
  inView,
  isElementOverflow,
  normalizeClassName,
  observeVisibility,
  onlyTippyProps,
  overflowChanges,
} from './utils';
import { NgChanges, TIPPY_CONFIG, TIPPY_REF, TippyConfig, TippyInstance, TippyProps } from './tippy.types';
import { TippyFactory } from './tippy.factory';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[tp]',
  exportAs: 'tippy',
  standalone: true,
})
export class TippyDirective implements OnChanges, AfterViewInit, OnDestroy, OnInit {
  @Input('tpAppendTo') set appendTo(appendTo: TippyProps['appendTo']) {
    this.updateProps({ appendTo });
  }
  @Input('tp') content: Content | undefined | null;
  @Input('tpDelay') delay: TippyProps['delay'];
  @Input('tpDuration') duration: TippyProps['duration'];
  @Input('tpHideOnClick') hideOnClick: TippyProps['hideOnClick'];
  @Input('tpInteractive') interactive: TippyProps['interactive'];
  @Input('tpInteractiveBorder') interactiveBorder: TippyProps['interactiveBorder'];
  @Input('tpMaxWidth') maxWidth: TippyProps['maxWidth'];
  @Input('tpOffset') offset: TippyProps['offset'];
  @Input('tpPlacement') placement: TippyProps['placement'];
  @Input('tpPopperOptions') popperOptions: TippyProps['popperOptions'];
  @Input('tpShowOnCreate') showOnCreate: TippyProps['showOnCreate'];
  @Input('tpTrigger') trigger: TippyProps['trigger'];
  @Input('tpTriggerTarget') triggerTarget: TippyProps['triggerTarget'];
  @Input('tpZIndex') zIndex: TippyProps['zIndex'];
  @Input('tpAnimation') animation: TippyProps['animation'];
  @Input({ transform: booleanAttribute, alias: 'tpUseTextContent' }) useTextContent: boolean;
  @Input({ transform: booleanAttribute, alias: 'tpIsLazy' }) isLazy: boolean;
  @Input('tpVariation') variation: string;
  @Input('tpIsEnabled') isEnabled: boolean;
  @Input('tpClassName') className: string | string[];
  @Input({ transform: booleanAttribute, alias: 'tpOnlyTextOverflow' }) onlyTextOverflow = false;
  @Input({ transform: booleanAttribute, alias: 'tpStaticWidthHost' }) staticWidthHost = false;
  @Input('tpData') data: any;
  @Input({ transform: booleanAttribute, alias: 'tpUseHostWidth' }) useHostWidth = false;
  @Input({ transform: booleanAttribute, alias: 'tpHideOnEscape' }) hideOnEscape = false;
  @Input('tpDetectChangesComponent') detectChangesComponent = true;
  @Input('tpPopperWidth') popperWidth: number | string;
  @Input('tpHost') customHost: HTMLElement;
  @Input({ transform: booleanAttribute, alias: 'tpIsVisible' }) isVisible = false;

  @Output('tpVisible') visible = new EventEmitter<boolean>();

  protected instance: TippyInstance;
  protected viewRef: ViewRef;
  protected destroyed = new Subject<void>();
  protected props: Partial<TippyConfig>;
  protected enabled = true;
  protected variationDefined = false;
  protected viewOptions$: ViewOptions;

  /**
   * We had use `visible` event emitter previously as a `takeUntil` subscriber in multiple places
   * within the directive.
   * This is for internal use only; thus we don't have to deal with the `visible` event emitter
   * and trigger change detections only when the `visible` event is being listened outside
   * in the template (`<button [tippy]="..." (visible)="..."></button>`).
   */
  protected visibleInternal = new Subject<boolean>();
  private visibilityObserverCleanup: () => void | undefined;
  private contentChanged = new Subject<void>();

  private tippyFactory = inject(TippyFactory);

  constructor(
    @Inject(PLATFORM_ID) protected platformId: string,
    @Inject(TIPPY_CONFIG) protected globalConfig: TippyConfig,
    protected injector: Injector,
    protected viewService: ViewService,
    protected vcr: ViewContainerRef,
    protected zone: NgZone,
    protected hostRef: ElementRef
  ) {}

  ngOnChanges(changes: NgChanges<TippyDirective>) {
    if (this.isServerSide) return;

    let props: Partial<TippyConfig> = Object.keys(changes).reduce((acc, change) => {
      if (change === 'isVisible') return acc;

      acc[change] = changes[change].currentValue;

      return acc;
    }, {});

    let variation: string;

    if (isChanged('content', changes)) {
      this.contentChanged.next();
    }

    if (isChanged('variation', changes)) {
      variation = changes.variation.currentValue;
      this.variationDefined = true;
    } else if (!this.variationDefined) {
      variation = this.globalConfig.defaultVariation;
      this.variationDefined = true;
    }

    if (variation) {
      props = {
        ...this.globalConfig.variations[variation],
        ...props,
      };
    }

    if (isChanged('isEnabled', changes)) {
      this.enabled = changes.isEnabled.currentValue;
      this.setStatus();
    }

    if (isChanged('isVisible', changes)) {
      this.isVisible ? this.show() : this.hide();
    }

    this.updateProps(props);
  }

  ngOnInit() {
    if (this.useHostWidth) {
      this.props.maxWidth = this.hostWidth;
    }
  }

  ngAfterViewInit() {
    if (this.isServerSide) return;

    this.zone.runOutsideAngular(() => {
      if (this.isLazy) {
        if (this.onlyTextOverflow) {
          inView(this.host)
            .pipe(
              switchMap(() => this.isOverflowing$()),
              takeUntil(this.destroyed)
            )
            .subscribe((isElementOverflow) => {
              this.checkOverflow(isElementOverflow);
            });
        } else {
          inView(this.host)
            .pipe(takeUntil(this.destroyed))
            .subscribe(() => {
              this.createInstance();
            });
        }
      } else if (this.onlyTextOverflow) {
        this.isOverflowing$()
          .pipe(takeUntil(this.destroyed))
          .subscribe((isElementOverflow) => {
            this.checkOverflow(isElementOverflow);
          });
      } else {
        this.createInstance();
      }
    });
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.instance?.destroy();
    this.destroyView();
    this.visibilityObserverCleanup?.();
  }

  destroyView() {
    this.viewOptions$ = null;
    this.viewRef?.destroy();
    this.viewRef = null;
  }

  /**
   * This method is useful when you append to an element that you might remove from the DOM.
   * In such cases we want to hide the tooltip and let it go through the destroy lifecycle.
   * For example, if you have a grid row with an element that you toggle using the display CSS property on hover.
   */
  observeHostVisibility() {
    if (this.isServerSide) return;
    // We don't want to observe the host visibility if we are appending to the body.
    if (this.props.appendTo && this.props.appendTo !== document.body) {
      this.visibilityObserverCleanup?.();
      return this.visibleInternal
        .asObservable()
        .pipe(takeUntil(this.destroyed))
        .subscribe((isVisible) => {
          if (isVisible) {
            this.zone.runOutsideAngular(() => {
              this.visibilityObserverCleanup = observeVisibility(this.instance.reference, () => {
                this.hide();
                // Because we have animation on the popper it doesn't close immediately doesn't trigger the `tpVisible` event.
                // Tippy is relying on the transitionend event to trigger the `onHidden` callback.
                // https://github.com/atomiks/tippyjs/blob/master/src/dom-utils.ts#L117
                // This event never fires because the popper is removed from the DOM before the transition ends.
                if (this.props.animation) {
                  this.onHidden();
                }
              });
            });
          } else {
            this.visibilityObserverCleanup?.();
          }
        });
    }
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

  protected updateProps(props: Partial<TippyConfig>) {
    this.setProps({ ...this.props, ...props });
  }

  protected setProps(props: Partial<TippyConfig>) {
    this.props = props;
    this.instance?.setProps(onlyTippyProps(props));
  }

  protected setStatus() {
    this.enabled ? this.instance?.enable() : this.instance?.disable();
  }

  protected get host(): HTMLElement {
    return this.customHost || this.hostRef.nativeElement;
  }

  protected get hostWidth(): number {
    return this.host.getBoundingClientRect().width;
  }

  protected createInstance() {
    if (!this.content && !this.useTextContent) {
      return;
    }

    this.tippyFactory
      .create(this.host, {
        allowHTML: true,
        appendTo: document.body,
        ...(this.globalConfig.zIndexGetter ? { zIndex: this.globalConfig.zIndexGetter() } : {}),
        ...onlyTippyProps(this.globalConfig),
        ...onlyTippyProps(this.props),
        onMount: (instance) => {
          this.isVisible = true;
          this.visibleInternal.next(this.isVisible);
          if (this.visible.observed) {
            this.zone.run(() => this.visible.next(this.isVisible));
          }
          this.useHostWidth && this.listenToHostResize();
          this.globalConfig.onMount?.(instance);
        },
        onCreate: (instance) => {
          instance.popper.classList.add(`tippy-variation-${this.variation || this.globalConfig.defaultVariation}`);
          if (this.className) {
            for (const klass of normalizeClassName(this.className)) {
              instance.popper.classList.add(klass);
            }
          }
          this.globalConfig.onCreate?.(instance);
          if (this.isVisible === true) {
            instance.show();
          }
        },
        onShow: (instance) => {
          instance.reference.setAttribute('data-tippy-open', '');
          this.zone.run(() => {
            const content = this.resolveContent(instance);
            if (isString(content)) {
              instance.setProps({ allowHTML: false });

              if (!content?.trim()) {
                this.disable();
              } else {
                this.enable();
              }
            }

            instance.setContent(content);
            this.hideOnEscape && this.handleEscapeButton();
          });
          if (this.useHostWidth) {
            this.setInstanceWidth(instance, this.hostWidth);
          } else if (this.popperWidth) {
            this.setInstanceWidth(instance, this.popperWidth);
          }
          this.globalConfig.onShow?.(instance);
        },
        onHide(instance) {
          instance.reference.removeAttribute('data-tippy-open');
        },
        onHidden: (instance) => {
          this.onHidden(instance);
        },
      })
      .pipe(takeUntil(this.destroyed))
      .subscribe((instance) => {
        this.instance = instance;

        this.setStatus();
        this.setProps(this.props);

        this.variation === 'contextMenu' && this.handleContextMenu();
      });
  }

  protected resolveContent(instance: TippyInstance) {
    if (!this.viewOptions$ && !isString(this.content)) {
      const injector = Injector.create({
        providers: [
          {
            provide: TIPPY_REF,
            useValue: this.instance,
          },
        ],
        parent: this.injector,
      });
      if (isComponent(this.content)) {
        this.instance.data = this.data;

        this.viewOptions$ = {
          injector,
        };
      } else if (isTemplateRef(this.content)) {
        this.viewOptions$ = {
          injector,
          context: {
            $implicit: this.hide.bind(this),
            data: this.data,
          },
        };
      }
    }

    this.viewRef = this.viewService.createView(this.content, {
      vcr: this.vcr,
      ...this.viewOptions$,
    });

    // We need to call detectChanges for onPush components to update the content
    if (this.detectChangesComponent && isComponent(this.content)) {
      this.viewRef.detectChanges();
    }

    let content = this.viewRef.getElement();

    if (this.useTextContent) {
      content = instance.reference.textContent;
    }

    if (isString(content) && this.globalConfig.beforeRender) {
      content = this.globalConfig.beforeRender(content);
    }

    return content;
  }

  protected handleContextMenu() {
    fromEvent(this.host, 'contextmenu')
      .pipe(takeUntil(this.destroyed))
      .subscribe((event: MouseEvent) => {
        event.preventDefault();

        this.instance.setProps({
          getReferenceClientRect: () =>
            ({
              width: 0,
              height: 0,
              top: event.clientY,
              bottom: event.clientY,
              left: event.clientX,
              right: event.clientX,
            } as DOMRectReadOnly),
        });

        this.instance.show();
      });
  }

  protected handleEscapeButton(): void {
    this.zone.runOutsideAngular(() => {
      fromEvent(document.body, 'keydown')
        .pipe(
          filter(({ code }: KeyboardEvent) => code === 'Escape'),
          takeUntil(merge(this.destroyed, this.visibleInternal.pipe(filter((v) => !v))))
        )
        .subscribe(() => this.hide());
    });
  }

  protected checkOverflow(isElementOverflow: boolean) {
    if (isElementOverflow) {
      if (!this.instance) {
        this.createInstance();
      } else {
        this.instance.enable();
      }
    } else {
      this.instance?.disable();
    }
  }

  protected listenToHostResize() {
    dimensionsChanges(this.host)
      .pipe(takeUntil(merge(this.destroyed, this.visibleInternal)))
      .subscribe(() => {
        this.setInstanceWidth(this.instance, this.hostWidth);
      });
  }

  protected setInstanceWidth(instance: Instance, width: string | number) {
    const inPixels = coerceCssPixelValue(width);
    instance.popper.style.width = inPixels;
    instance.popper.style.maxWidth = inPixels;
    (instance.popper.firstElementChild as HTMLElement).style.maxWidth = inPixels;
  }

  private get isServerSide() {
    return isPlatformServer(this.platformId);
  }

  private onHidden(instance: TippyInstance = this.instance) {
    this.destroyView();
    this.isVisible = false;
    this.visibleInternal.next(this.isVisible);
    if (this.visible.observed) {
      this.zone.run(() => this.visible.next(this.isVisible));
    }
    this.globalConfig.onHidden?.(instance);
  }

  private isOverflowing$() {
    const notifiers$ = [overflowChanges(this.host)];

    // We need to handle cases where the host has a static width but the content might change
    if (this.staticWidthHost) {
      notifiers$.push(
        this.contentChanged.asObservable().pipe(
          // We need to wait for the content to be rendered before we can check if it's overflowing.
          switchMap(() => {
            return new Observable((subscriber) => {
              const id = window.requestAnimationFrame(() => {
                subscriber.next();
                subscriber.complete();
              });

              return () => cancelAnimationFrame(id);
            });
          }),
          map(() => isElementOverflow(this.host))
        )
      );
    }

    return merge(...notifiers$);
  }
}

function isChanged(key: keyof NgChanges<TippyDirective>, changes: NgChanges<TippyDirective>) {
  return key in changes;
}
