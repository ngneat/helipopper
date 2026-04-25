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
  type Type,
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest, firstValueFrom, from, merge, Observable, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
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
  onlyFloatingProps,
  overflowChanges,
} from './utils';
import {
  FLOATING_CONFIG,
  FLOATING_LOADER_COMPONENT,
  FLOATING_LOADER_TIMING,
  type FloatingConfig,
  type FloatingContent,
  type FloatingInstance,
  type FloatingProps,
} from '@ngneat/helipopper/config';
import { FloatingFactory } from './floating.factory';
import { FloatingInstanceImpl } from './floating-instance';
import { FloatingService } from './floating.service';
import { coerceBooleanAttribute } from './coercion';
import { FLOATING_REF } from './inject-floating';

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

// These are the default values used for the floating tooltip.
const defaultAppendTo = (() => document.body) as FloatingProps['appendTo'];
const defaultDelay = 0 as FloatingProps['delay'];
const defaultDuration = [300, 250] as FloatingProps['duration'];
const defaultInteractiveBorder = 2 as FloatingProps['interactiveBorder'];
const defaultMaxWidth = 350 as FloatingProps['maxWidth'];
const defaultOffset = [0, 10] as FloatingProps['offset'];
const defaultPlacement = 'top' as FloatingProps['placement'];
const defaultTrigger = 'mouseenter focus' as FloatingProps['trigger'];
const defaultTriggerTarget = null as FloatingProps['triggerTarget'];
const defaultZIndex = 9999 as FloatingProps['zIndex'];
const defaultAnimation = 'fade' as FloatingProps['animation'];

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[fl]',
  exportAs: 'floating',
})
export class FloatingDirective implements OnChanges, AfterViewInit {
  readonly appendTo = input(defaultAppendTo, {
    alias: 'flAppendTo',
  });

  readonly content = input<FloatingContent | undefined | null>('', { alias: 'fl' });

  readonly delay = input(defaultDelay, {
    alias: 'flDelay',
  });

  readonly duration = input(defaultDuration, {
    alias: 'flDuration',
  });

  readonly hideOnClick = input(true, {
    alias: 'flHideOnClick',
  });

  readonly interactive = input(false, {
    alias: 'flInteractive',
  });

  readonly interactiveBorder = input(defaultInteractiveBorder, {
    alias: 'flInteractiveBorder',
  });

  readonly maxWidth = input(defaultMaxWidth, {
    alias: 'flMaxWidth',
  });

  // Note that some of the input signal types are declared explicitly because the compiler
  // also uses types from `@popperjs/core` and requires a type annotation.
  readonly offset: InputSignal<FloatingProps['offset']> = input(defaultOffset, {
    alias: 'flOffset',
  });

  readonly placement: InputSignal<FloatingProps['placement']> = input(defaultPlacement, {
    alias: 'flPlacement',
  });

  /** @deprecated Use `tpFloatingProps` with floating-ui `middleware` instead. */
  readonly popperOptions = input<Record<string, unknown>>(
    {},
    { alias: 'flPopperOptions' },
  );

  readonly showOnCreate = input(false, {
    alias: 'flShowOnCreate',
  });

  readonly trigger = input(defaultTrigger, {
    alias: 'flTrigger',
  });

  readonly triggerTarget = input(defaultTriggerTarget, {
    alias: 'flTriggerTarget',
  });

  readonly zIndex = input(defaultZIndex, {
    alias: 'flZIndex',
  });

  readonly animation = input(defaultAnimation, {
    alias: 'flAnimation',
  });

  readonly useTextContent = input(false, {
    transform: coerceBooleanAttribute,
    alias: 'flUseTextContent',
  });

  readonly isLazy = input(false, {
    transform: coerceBooleanAttribute,
    alias: 'flIsLazy',
  });

  readonly variation = input<string | undefined>(undefined, { alias: 'flVariation' });

  readonly isEnabled = input(true, { alias: 'flIsEnabled' });

  readonly className = input<string | string[]>('', { alias: 'flClassName' });

  readonly onlyTextOverflow = input(false, {
    transform: coerceBooleanAttribute,
    alias: 'flOnlyTextOverflow',
  });

  readonly staticWidthHost = input(false, {
    transform: coerceBooleanAttribute,
    alias: 'flStaticWidthHost',
  });

  readonly data = input<any>(undefined, { alias: 'flData' });

  /** Angular `inputBinding`/`outputBinding`/`twoWayBinding` descriptors forwarded to `createComponent`. */
  readonly bindings = input<ViewOptions['bindings']>(undefined, { alias: 'flBindings' });

  /** Host directives (with optional bindings) forwarded to `createComponent`. */
  readonly directives = input<ViewOptions['directives']>(undefined, {
    alias: 'flDirectives',
  });

  readonly useHostWidth = input(false, {
    transform: coerceBooleanAttribute,
    alias: 'flUseHostWidth',
  });

  readonly hideOnEscape = input(false, {
    transform: coerceBooleanAttribute,
    alias: 'flHideOnEscape',
  });

  readonly floatingProps = input<Record<string, unknown> | undefined>(undefined, {
    alias: 'flFloatingProps',
  });

  readonly popperWidth = input<number | string | undefined>(undefined, {
    alias: 'flPopperWidth',
  });

  readonly customHost = input<HTMLElement | undefined>(undefined, { alias: 'flHost' });

  readonly flOnShow = output<void>({ alias: 'flOnShow' });

  readonly flOnHide = output<void>({ alias: 'flOnHide' });

  readonly isVisible = model(false, { alias: 'flIsVisible' });

  visible = output<boolean>({ alias: 'flVisible' });

  protected instance!: FloatingInstance;
  protected viewRef: ViewRef | null = null;
  protected props!: Partial<FloatingConfig>;
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
  private floatingService = inject(FloatingService);
  private floatingFactory = inject(FloatingFactory);
  private isServer =
    // Drop `isPlatformServer` once `ngServeMode` is available during compilation.
    (typeof ngServerMode !== 'undefined' && ngServerMode) ||
    isPlatformServer(inject(PLATFORM_ID));
  private destroyed = false;
  private created = false;

  protected globalConfig = inject(FLOATING_CONFIG);
  protected injector = inject(Injector);
  protected viewService = inject(ViewService);
  protected vcr = inject(ViewContainerRef);
  protected ngZone = inject(NgZone);
  protected hostRef = inject(ElementRef);

  private loaderViewRef: ViewRef | null = null;
  private globalLoaderComponent = inject(FLOATING_LOADER_COMPONENT, { optional: true });
  private loaderTiming = inject(FLOATING_LOADER_TIMING);

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

    // `isVisible` and `floatingProps` are not merged into `this.props`; they are
    // handled separately (model signal and direct-spread effect respectively).
    const changedProps = Object.keys(changes)
      .filter((key) => key !== 'isVisible' && key !== 'floatingProps')
      .reduce(
        (accumulator, key) => ({ ...accumulator, [key]: changes[key].currentValue }),
        {} as Partial<FloatingConfig>,
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

    const onlyTextOverflow = this.onlyTextOverflow();
    if (this.isLazy()) {
      const hostInView$ = inView(this.host());

      if (onlyTextOverflow) {
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
    } else if (onlyTextOverflow) {
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
    this.loaderViewRef?.destroy();
    this.loaderViewRef = null;
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
                // Because we have animation on the popper it doesn't close immediately
                // and doesn't trigger the `tpVisible` event. The transitionend event
                // never fires because the popper is removed from the DOM before the
                // transition ends.
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

  protected updateProps(props: Partial<FloatingConfig>) {
    this.setProps({ ...this.props, ...props });
  }

  protected setProps(props: Partial<FloatingConfig>) {
    this.props = props;
    this.instance?.setProps({
      ...onlyFloatingProps(props),
      ...(this.floatingProps() ?? {}),
    });
  }

  protected setStatus(isEnabled: boolean) {
    isEnabled ? this.instance?.enable() : this.instance?.disable();
  }

  protected hasContent(): boolean {
    return !!(this.content() || this.useTextContent());
  }

  protected async createInstance(): Promise<void> {
    if (this.created || !this.hasContent()) {
      return;
    }

    this.created = true;

    if (this.destroyRef.destroyed) return;

    const ui = await firstValueFrom(this.floatingFactory.getFloatingImpl(), {
      defaultValue: undefined,
    });

    if (ui === undefined || this.destroyRef.destroyed) return;

    this.instance = this.ngZone.runOutsideAngular(() => {
      return new FloatingInstanceImpl(
        this.host(),
        {
          appendTo,
          allowHTML: true,
          ...(this.globalConfig.zIndexGetter
            ? { zIndex: this.globalConfig.zIndexGetter() }
            : {}),
          ...onlyFloatingProps(this.globalConfig),
          ...onlyFloatingProps(this.props),
          ...(this.floatingProps() ?? {}),
          // Bound functions have no [[Context]] slot in V8 — only
          // { bound_target_function, bound_this, bound_arguments } — so no closure
          // context is retained after destroy (same reasoning as `appendTo` above).
          onMount: this.onMount.bind(this),
          onCreate: this.onCreate.bind(this),
          onShow: this.onShow.bind(this),
          onHide: function (instance: FloatingInstance) {
            instance.reference.removeAttribute('data-tippy-open');
          }.bind(null),
          onHidden: this.onHidden.bind(this),
        },
        ui,
      );
    });

    this.setStatus(this.isEnabled());
    this.setProps(this.props);
    this.variation() === 'contextMenu' && this.handleContextMenu();
  }

  // `resolvedContent` is provided when the caller already awaited a lazy factory.
  // Passing it here avoids re-reading `this.content()`, which would still carry
  // the raw factory function type and require another cast.
  protected resolveContent(instance: FloatingInstance, resolvedContent?: Type<unknown>) {
    const content = (resolvedContent ?? this.content()) as Content | undefined | null;

    if (!this.viewOptions$ && !isString(content)) {
      const injector = Injector.create({
        providers: [
          {
            provide: FLOATING_REF,
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

    let newContent = this.ngZone.run(() => {
      this.viewRef = this.viewService.createView(content!, {
        vcr: this.vcr,
        ...this.viewOptions$,
      });

      // We need to call `detectChanges` for OnPush components to update their content.
      if (isComponent(content)) {
        // `ɵcmp` is a component definition set for any component.
        // Checking the `onPush` property of the component definition is a
        // smarter way to determine whether we need to call `detectChanges()`,
        // as users may be unaware of setting the binding.
        const isOnPush = (content as { ɵcmp?: { onPush: boolean } }).ɵcmp?.onPush;
        if (isOnPush) {
          this.viewRef.detectChanges();
        }
      }

      return this.viewRef.getElement();
    });

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

  protected clearInstanceWidth(instance: FloatingInstance) {
    instance.popper.style.width = '';
    instance.popper.style.maxWidth = '';
    (instance.popper.firstElementChild as HTMLElement).style.maxWidth = '';
  }

  protected setInstanceWidth(instance: FloatingInstance, width: string | number) {
    const inPixels = coerceCssPixelValue(width);
    instance.popper.style.width = inPixels;
    instance.popper.style.maxWidth = inPixels;
    (instance.popper.firstElementChild as HTMLElement).style.maxWidth = inPixels;
  }

  private onMount(instance: FloatingInstance) {
    const isVisible = true;
    this.isVisible.set(isVisible);
    this.visibleInternal.next(isVisible);
    this.ngZone.run(() => this.visible.emit(isVisible));
    this.useHostWidth() && this.listenToHostResize();
    this.globalConfig.onMount?.(instance);
  }

  private onCreate(instance: FloatingInstance) {
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
  }

  private onHidden(instance: FloatingInstance = this.instance) {
    this.destroyView();
    const isVisible = false;
    // `model()` uses `OutputEmitterRef` internally to emit events when the
    // signal changes. If the directive is destroyed, it will throw an error:
    // "Unexpected emit for destroyed `OutputRef`".
    if (!this.destroyed) {
      this.isVisible.set(isVisible);
      this.ngZone.run(() => this.visible.emit(isVisible));
      this.flOnHide.emit();
    }
    this.visibleInternal.next(isVisible);

    this.globalConfig.onHidden?.(instance);
  }

  private onShow(instance: FloatingInstance) {
    // In onlyTextOverflow mode the tooltip must not appear when the host is
    // not overflowing. Returning false from onShow prevents the tooltip from
    // showing regardless of the instance's enabled/disabled state. This
    // acts as a last-resort guard for cases where checkOverflow() hasn't
    // been called yet (e.g. Angular's scheduler hasn't flushed CD between
    // the content/width change and the trigger event).
    if (this.onlyTextOverflow() && !isElementOverflow(this.host())) {
      return false;
    }

    // The outer `onShow` must be synchronous so that `return false` above
    // is seen as a boolean (an `async` function always returns a Promise,
    // which is truthy and would never suppress the show).
    this.handleOnShow(instance);
  }

  private async handleOnShow(instance: FloatingInstance) {
    instance.reference.setAttribute('data-tippy-open', '');

    const maybeContent = this.content();
    const isLazyFactory =
      !isComponentClass(maybeContent) && typeof maybeContent === 'function';

    let resolvedContent: Type<unknown> | undefined;
    if (isLazyFactory) {
      const loaderComponent = this.globalLoaderComponent;
      if (loaderComponent) {
        const loaderElement = this.ngZone.run(() => {
          this.loaderViewRef = this.viewService.createView(loaderComponent, {
            vcr: this.vcr,
          });
          return this.loaderViewRef.getElement();
        });
        instance.setContent(loaderElement);
      }

      const cancelled = Symbol();
      // combineLatest ensures we swap the loader only when both the component
      // is ready AND the timing observable has emitted — guaranteeing the spinner
      // is visible for at least the configured duration regardless of import speed.
      // takeUntil + takeUntilDestroyed cancel if the tooltip hides or the
      // directive is destroyed mid-flight.
      const result = await firstValueFrom(
        combineLatest([
          from((maybeContent as () => Promise<Type<unknown>>)()),
          this.loaderTiming,
        ]).pipe(
          map(([component]) => component),
          takeUntil(this.visibleInternal.pipe(filter((v) => !v))),
          takeUntilDestroyed(this.destroyRef),
        ),
        { defaultValue: cancelled },
      );

      this.loaderViewRef?.destroy();
      this.loaderViewRef = null;

      if (result === cancelled) return;
      resolvedContent = result as Type<unknown>;
    }

    // For non-lazy content this call is fully synchronous — skipping the
    // await avoids a microtask tick that would otherwise cause a visible flicker.
    const content = this.resolveContent(instance, resolvedContent);

    if (isString(content)) {
      instance.setProps({ allowHTML: false });

      if (content?.trim()) {
        this.enable();
      } else {
        this.disable();
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
    this.flOnShow.emit();
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

    effect(() => this.setStatus(this.floatingService.enabled() && this.isEnabled()));

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

    effect(() => {
      const floatingProps = this.floatingProps();
      untracked(() => this.instance?.setProps(floatingProps ?? {}));
    });
  }
}

function isComponentClass(
  content: FloatingContent | null | undefined,
): content is Type<any> {
  return (
    typeof content === 'function' &&
    /^class\s/.test(Function.prototype.toString.call(content))
  );
}

// ---------------------------------------------------------------------------
// Deprecated alias kept for backwards compatibility
// ---------------------------------------------------------------------------

/** @deprecated Use `FloatingDirective` instead. */
export { FloatingDirective as TippyDirective };
