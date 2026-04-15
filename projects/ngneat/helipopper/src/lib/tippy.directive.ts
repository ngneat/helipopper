import {
  afterEveryRender,
  AfterViewInit,
  computed,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  InputSignal,
  model,
  NgZone,
  OnChanges,
  output,
  PLATFORM_ID,
  SimpleChanges,
  untracked,
  ViewContainerRef,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import type { Instance } from 'tippy.js';
import { merge, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import {
  Content,
  isComponent,
  isString,
  isTemplateRef,
  ViewOptions,
  ViewRef,
  ViewService,
} from '@ngneat/overview';

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
import {
  TIPPY_CONFIG,
  TippyConfig,
  TippyInstance,
  TippyProps,
} from '@ngneat/helipopper/config';
import { TippyFactory } from './tippy.factory';
import { TippyService } from './tippy.service';
import { coerceBooleanAttribute } from './coercion';
import { TIPPY_REF } from './inject-tippy';

// An arrow function defined inside a method closes over the method's lexical scope,
// causing V8 to allocate a Context object that indirectly references the directive
// instance — keeping it alive after destroy.
//
// A bound function (JSBoundFunction) has no [[context]] field in V8's heap layout;
// it only stores { bound_target_function, bound_this, bound_arguments }.
// Binding to `null` produces a context-free callable, breaking the retention chain.
const appendTo = function appendTo() {
  return document.fullscreenElement || document.body;
}.bind(null);

// These are the default values used by `tippy.js`.
// We are providing them as default input values.
// The `tippy.js` repository has been archived and is unlikely to
// change in the future, so it is safe to use these values as defaults.
const defaultAppendTo: TippyProps['appendTo'] = () => document.body;
const defaultDelay: TippyProps['delay'] = 0;
const defaultDuration: TippyProps['duration'] = [300, 250];
const defaultInteractiveBorder: TippyProps['interactiveBorder'] = 2;
const defaultMaxWidth: TippyProps['maxWidth'] = 350;
const defaultOffset: TippyProps['offset'] = [0, 10];
const defaultPlacement: TippyProps['placement'] = 'top';
const defaultTrigger: TippyProps['trigger'] = 'mouseenter focus';
const defaultTriggerTarget: TippyProps['triggerTarget'] = null;
const defaultZIndex: TippyProps['zIndex'] = 9999;
const defaultAnimation: TippyProps['animation'] = 'fade';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[tp]',
  exportAs: 'tippy',
})
export class TippyDirective implements OnChanges, AfterViewInit {
  readonly appendTo = input(defaultAppendTo, {
    alias: 'tpAppendTo',
  });

  readonly content = input<Content | undefined | null>('', { alias: 'tp' });

  readonly delay = input(defaultDelay, {
    alias: 'tpDelay',
  });

  readonly duration = input(defaultDuration, {
    alias: 'tpDuration',
  });

  readonly hideOnClick = input(true, {
    alias: 'tpHideOnClick',
  });

  readonly interactive = input(false, {
    alias: 'tpInteractive',
  });

  readonly interactiveBorder = input(defaultInteractiveBorder, {
    alias: 'tpInteractiveBorder',
  });

  readonly maxWidth = input(defaultMaxWidth, {
    alias: 'tpMaxWidth',
  });

  // Note that some of the input signal types are declared explicitly because the compiler
  // also uses types from `@popperjs/core` and requires a type annotation.
  readonly offset: InputSignal<TippyProps['offset']> = input(defaultOffset, {
    alias: 'tpOffset',
  });

  readonly placement: InputSignal<TippyProps['placement']> = input(defaultPlacement, {
    alias: 'tpPlacement',
  });

  readonly popperOptions: InputSignal<TippyProps['popperOptions']> = input(
    {},
    {
      alias: 'tpPopperOptions',
    },
  );

  readonly showOnCreate = input(false, {
    alias: 'tpShowOnCreate',
  });

  readonly trigger = input(defaultTrigger, {
    alias: 'tpTrigger',
  });

  readonly triggerTarget = input(defaultTriggerTarget, {
    alias: 'tpTriggerTarget',
  });

  readonly zIndex = input(defaultZIndex, {
    alias: 'tpZIndex',
  });

  readonly animation = input(defaultAnimation, {
    alias: 'tpAnimation',
  });

  readonly useTextContent = input(false, {
    transform: coerceBooleanAttribute,
    alias: 'tpUseTextContent',
  });

  readonly isLazy = input(false, {
    transform: coerceBooleanAttribute,
    alias: 'tpIsLazy',
  });

  readonly variation = input<string | undefined>(undefined, { alias: 'tpVariation' });

  readonly isEnabled = input(true, { alias: 'tpIsEnabled' });

  readonly className = input<string | string[]>('', { alias: 'tpClassName' });

  readonly onlyTextOverflow = input(false, {
    transform: coerceBooleanAttribute,
    alias: 'tpOnlyTextOverflow',
  });

  readonly staticWidthHost = input(false, {
    transform: coerceBooleanAttribute,
    alias: 'tpStaticWidthHost',
  });

  readonly data = input<any>(undefined, { alias: 'tpData' });

  /** Angular `inputBinding`/`outputBinding`/`twoWayBinding` descriptors forwarded to `createComponent`. */
  readonly bindings = input<ViewOptions['bindings']>(undefined, { alias: 'tpBindings' });

  /** Host directives (with optional bindings) forwarded to `createComponent`. */
  readonly directives = input<ViewOptions['directives']>(undefined, {
    alias: 'tpDirectives',
  });

  readonly useHostWidth = input(false, {
    transform: coerceBooleanAttribute,
    alias: 'tpUseHostWidth',
  });

  readonly hideOnEscape = input(false, {
    transform: coerceBooleanAttribute,
    alias: 'tpHideOnEscape',
  });

  readonly popperWidth = input<number | string | undefined>(undefined, {
    alias: 'tpPopperWidth',
  });

  readonly customHost = input<HTMLElement | undefined>(undefined, { alias: 'tpHost' });

  readonly onShow = output<void>({ alias: 'tpOnShow' });

  readonly onHide = output<void>({ alias: 'tpOnHide' });

  readonly isVisible = model(false, { alias: 'tpIsVisible' });

  visible = output<boolean>({ alias: 'tpVisible' });

  protected instance!: TippyInstance;
  protected viewRef: ViewRef | null = null;
  protected props!: Partial<TippyConfig>;
  protected variationDefined = false;
  protected viewOptions$: ViewOptions | null = null;

  /**
   * We had use `visible` event emitter previously as a `takeUntil` subscriber in multiple places
   * within the directive.
   * This is for internal use only; thus we don't have to deal with the `visible` event emitter
   * and trigger change detections only when the `visible` event is being listened outside
   * in the template (`<button [tippy]="..." (visible)="..."></button>`).
   */
  protected visibleInternal = new Subject<boolean>();
  private visibilityObserverCleanup: VoidFunction | null = null;
  private contentChanged = new Subject<void>();

  private host = computed<HTMLElement>(
    () => this.customHost() || this.hostRef.nativeElement,
  );

  // It should be a getter because computations are cached until
  // any of the producers change.
  private get hostWidth() {
    return this.host().getBoundingClientRect().width;
  }

  private destroyRef = inject(DestroyRef);
  private tippyService = inject(TippyService);
  private isServer =
    // Drop `isPlatformServer` once `ngServeMode` is available during compilation.
    (typeof ngServerMode !== 'undefined' && ngServerMode) ||
    isPlatformServer(inject(PLATFORM_ID));
  private tippyFactory = inject(TippyFactory);
  private destroyed = false;
  private created = false;

  protected globalConfig = inject(TIPPY_CONFIG);
  protected injector = inject(Injector);
  protected viewService = inject(ViewService);
  protected vcr = inject(ViewContainerRef);
  protected ngZone = inject(NgZone);
  protected hostRef = inject(ElementRef);

  constructor() {
    if (this.isServer) return;

    this.setupListeners();

    // `afterEveryRender` fires synchronously within Angular's CD cycle.
    // This lets us update the enabled/disabled state of the instance BEFORE a
    // synthetic mouseenter event is dispatched, which fixes test timing when
    // Angular-triggered changes (content/style bindings) cause the overflow
    // state to change. ResizeObserver (`overflowChanges`) remains as a fallback
    // for non-Angular-triggered resize events (browser window resize, etc.).
    afterEveryRender({
      read: () => {
        if (!this.onlyTextOverflow()) return;
        untracked(() => this.checkOverflow(isElementOverflow(this.host())));
      },
    });

    this.destroyRef.onDestroy(() => {
      this.destroyed = true;
      this.instance?.destroy();
      this.destroyView();
      this.visibilityObserverCleanup?.();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isServer) return;

    // `isVisible` is not required as a prop since we update it manually
    // in an effect-like manner.
    const changedProps = Object.keys(changes)
      .filter((key) => key !== 'isVisible')
      .reduce(
        (accumulator, key) => ({ ...accumulator, [key]: changes[key].currentValue }),
        {} as Partial<TippyConfig>,
      );

    // Variation defaults are applied only on the first call or when the variation
    // input itself changes. Re-applying them on every ngOnChanges call would
    // overwrite explicitly-bound inputs (e.g. tpTrigger) with variation defaults
    // whenever any other input (e.g. tpData, tpIsEnabled) changes.
    if (!this.variationDefined || 'variation' in changes) {
      this.variationDefined = true;
      const variation = this.variation() || this.globalConfig.defaultVariation || '';
      this.setProps({
        ...this.globalConfig.variations?.[variation],
        ...this.props,
        ...changedProps,
      });
    } else {
      this.updateProps(changedProps);
    }
  }

  ngAfterViewInit() {
    if (this.isServer) return;

    if (this.isLazy()) {
      const hostInView$ = inView(this.host());

      if (this.onlyTextOverflow()) {
        hostInView$
          .pipe(
            switchMap(() => this.isOverflowing$()),
            takeUntilDestroyed(this.destroyRef),
          )
          .subscribe((isElementOverflow) => {
            this.checkOverflow(isElementOverflow);
          });
      } else {
        hostInView$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
          this.createInstance();
        });
      }
    } else if (this.onlyTextOverflow()) {
      this.isOverflowing$()
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((isElementOverflow) => {
          this.checkOverflow(isElementOverflow);
        });
    } else {
      this.createInstance();
    }
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
    if (this.isServer) return;
    // We don't want to observe the host visibility if we are appending to the body.
    if (this.props.appendTo && this.props.appendTo !== document.body) {
      this.visibilityObserverCleanup?.();
      return this.visibleInternal
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((isVisible) => {
          if (isVisible) {
            this.visibilityObserverCleanup = observeVisibility(
              this.instance.reference,
              () => {
                this.hide();
                // Because we have animation on the popper it doesn't close immediately doesn't trigger the `tpVisible` event.
                // Tippy is relying on the transitionend event to trigger the `onHidden` callback.
                // https://github.com/atomiks/tippyjs/blob/master/src/dom-utils.ts#L117
                // This event never fires because the popper is removed from the DOM before the transition ends.
                if (this.props.animation) {
                  this.onHidden();
                }
              },
            );
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

  protected setStatus(isEnabled: boolean) {
    isEnabled ? this.instance?.enable() : this.instance?.disable();
  }

  protected hasContent(): boolean {
    return !!(this.content() || this.useTextContent());
  }

  protected createInstance() {
    if (this.created || !this.hasContent()) {
      return;
    }

    this.created = true;

    this.tippyFactory
      .create(this.host(), {
        appendTo,
        allowHTML: true,
        ...(this.globalConfig.zIndexGetter
          ? { zIndex: this.globalConfig.zIndexGetter() }
          : {}),
        ...onlyTippyProps(this.globalConfig),
        ...onlyTippyProps(this.props),
        onMount: (instance) => {
          const isVisible = true;
          this.isVisible.set(isVisible);
          this.visibleInternal.next(isVisible);
          this.ngZone.run(() => this.visible.emit(isVisible));
          this.useHostWidth() && this.listenToHostResize();
          this.globalConfig.onMount?.(instance);
        },
        onCreate: (instance) => {
          instance.popper.classList.add(
            `tippy-variation-${this.variation() || this.globalConfig.defaultVariation}`,
          );
          if (this.className()) {
            for (const klass of normalizeClassName(this.className())) {
              instance.popper.classList.add(klass);
            }
          }
          this.globalConfig.onCreate?.(instance);
          if (this.isVisible() === true) {
            instance.show();
          }
        },
        onShow: (instance) => {
          // In onlyTextOverflow mode the tooltip must not appear when the host is
          // not overflowing. Returning false from onShow prevents tippy from
          // showing regardless of the instance's enabled/disabled state. This
          // acts as a last-resort guard for cases where checkOverflow() hasn't
          // been called yet (e.g. Angular's scheduler hasn't flushed CD between
          // the content/width change and the trigger event).
          if (this.onlyTextOverflow() && !isElementOverflow(this.host())) {
            return false;
          }

          instance.reference.setAttribute('data-tippy-open', '');

          // We're re-entering because we might create an Angular component,
          // which should be done within the zone.
          const content = this.ngZone.run(() => this.resolveContent(instance));

          if (isString(content)) {
            instance.setProps({ allowHTML: false });

            if (!content?.trim()) {
              this.disable();
            } else {
              this.enable();
            }
          }

          instance.setContent(content);
          this.hideOnEscape() && this.handleEscapeButton();

          this.clearInstanceWidth(instance);
          if (this.useHostWidth()) {
            this.setInstanceWidth(instance, this.hostWidth);
          } else if (this.popperWidth()) {
            this.setInstanceWidth(instance, this.popperWidth()!);
          }
          this.globalConfig.onShow?.(instance);
          this.onShow.emit();
        },
        onHide(instance) {
          instance.reference.removeAttribute('data-tippy-open');
        },
        onHidden: (instance) => {
          this.onHidden(instance);
        },
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((instance) => {
        this.instance = instance;

        this.setStatus(this.isEnabled());
        this.setProps(this.props);

        this.variation() === 'contextMenu' && this.handleContextMenu();
      });
  }

  protected resolveContent(instance: TippyInstance) {
    const content = this.content();

    if (!this.viewOptions$ && !isString(content)) {
      const injector = Injector.create({
        providers: [
          {
            provide: TIPPY_REF,
            useValue: this.instance,
          },
        ],
        parent: this.injector,
      });

      const data = this.data();

      if (isComponent(content)) {
        this.instance.data = data;

        this.viewOptions$ = {
          injector,
          bindings: this.bindings(),
          directives: this.directives(),
        };
      } else if (isTemplateRef(content)) {
        this.viewOptions$ = {
          injector,
          context: {
            data,
            $implicit: this.hide.bind(this),
          },
        };
      }
    }

    this.viewRef = this.viewService.createView(content!, {
      vcr: this.vcr,
      ...this.viewOptions$,
    });

    // We need to call `detectChanges` for OnPush components to update their content.
    if (isComponent(content)) {
      // `ɵcmp` is a component defition set for any component.
      // Checking the `onPush` property of the component definition is a
      // smarter way to determine whether we need to call `detectChanges()`,
      // as users may be unaware of setting the binding.
      const isOnPush = (content as { ɵcmp?: { onPush: boolean } }).ɵcmp?.onPush;
      if (isOnPush) {
        this.viewRef.detectChanges();
      }
    }

    let newContent = this.viewRef.getElement();

    if (this.useTextContent()) {
      newContent = instance.reference.textContent!;
    }

    if (isString(newContent) && this.globalConfig.beforeRender) {
      newContent = this.globalConfig.beforeRender(newContent);
    }

    return newContent;
  }

  protected handleContextMenu() {
    const host = this.host();
    const onContextMenu = (event: MouseEvent) => {
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
          }) as DOMRectReadOnly,
      });

      this.instance.show();
    };

    host.addEventListener('contextmenu', onContextMenu);
    this.destroyRef.onDestroy(() =>
      host.removeEventListener('contextmenu', onContextMenu),
    );
  }

  protected handleEscapeButton(): void {
    const onKeydown = (event: KeyboardEvent) => {
      if (event.code === 'Escape') {
        this.hide();
      }
    };

    document.body.addEventListener('keydown', onKeydown);

    // Remove listener when `visibleInternal` becomes false.
    const visibleSubscription = this.visibleInternal.subscribe((v) => {
      if (!v) {
        document.body.removeEventListener('keydown', onKeydown);
        visibleSubscription.unsubscribe();
      }
    });

    this.destroyRef.onDestroy(() => {
      document.body.removeEventListener('keydown', onKeydown);
      visibleSubscription.unsubscribe();
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
    dimensionsChanges(this.host())
      .pipe(takeUntil(this.visibleInternal), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.setInstanceWidth(this.instance, this.hostWidth);
      });
  }

  protected clearInstanceWidth(instance: Instance) {
    instance.popper.style.width = '';
    instance.popper.style.maxWidth = '';
    (instance.popper.firstElementChild as HTMLElement).style.maxWidth = '';
  }

  protected setInstanceWidth(instance: Instance, width: string | number) {
    const inPixels = coerceCssPixelValue(width);
    instance.popper.style.width = inPixels;
    instance.popper.style.maxWidth = inPixels;
    (instance.popper.firstElementChild as HTMLElement).style.maxWidth = inPixels;
  }

  private onHidden(instance: TippyInstance = this.instance) {
    this.destroyView();
    const isVisible = false;
    // `model()` uses `OutputEmitterRef` internally to emit events when the
    // signal changes. If the directive is destroyed, it will throw an error:
    // "Unexpected emit for destroyed `OutputRef`".
    if (!this.destroyed) {
      this.isVisible.set(isVisible);
      this.ngZone.run(() => this.visible.emit(isVisible));
      this.onHide.emit();
    }
    this.visibleInternal.next(isVisible);

    this.globalConfig.onHidden?.(instance);
  }

  private isOverflowing$() {
    const host = this.host();
    const notifiers$ = [overflowChanges(host)];

    // We need to handle cases where the host has a static width but the content might change
    if (this.staticWidthHost()) {
      notifiers$.push(
        this.contentChanged.pipe(
          // We need to wait for the content to be rendered before we can check if it's overflowing.
          switchMap(() => {
            return new Observable<boolean>((subscriber) => {
              const id = window.requestAnimationFrame(() => {
                subscriber.next(isElementOverflow(host));
                subscriber.complete();
              });

              return () => cancelAnimationFrame(id);
            });
          }),
        ),
      );
    }

    return merge(...notifiers$);
  }

  private setupListeners(): void {
    effect(() => {
      // Capture signal read to track its changes.
      this.content();
      untracked(() => this.contentChanged.next());
    });

    effect(() => this.setStatus(this.tippyService.enabled() && this.isEnabled()));

    effect(() => {
      const maxWidth = this.useHostWidth() ? this.hostWidth : defaultMaxWidth;
      untracked(() => this.setProps({ ...this.props, maxWidth }));
    });

    effect(() => {
      const isVisible = this.isVisible();
      isVisible ? this.show() : this.hide();
    });

    effect(() => {
      const hasContent = this.hasContent();

      if (hasContent && !this.instance && !this.isLazy() && !this.onlyTextOverflow()) {
        this.createInstance();
      } else if (!hasContent && this.instance) {
        this.instance.destroy();
        this.instance = null as any;
        this.destroyView();
        this.created = false;
      }
    });
  }
}
