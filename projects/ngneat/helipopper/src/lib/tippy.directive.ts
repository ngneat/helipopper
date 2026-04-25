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
import type { Instance } from 'tippy.js';
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
  onlyTippyProps,
  overflowChanges,
} from './utils';
import {
  TIPPY_CONFIG,
  TIPPY_LOADER_COMPONENT,
  TIPPY_LOADER_TIMING,
  type TippyConfig,
  type TippyContent,
  type TippyInstance,
  type TippyProps,
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
const defaultAppendTo = (() => document.body) as TippyProps['appendTo'];
const defaultDelay = 0 as TippyProps['delay'];
const defaultDuration = [300, 250] as TippyProps['duration'];
const defaultInteractiveBorder = 2 as TippyProps['interactiveBorder'];
const defaultMaxWidth = 350 as TippyProps['maxWidth'];
const defaultOffset = [0, 10] as TippyProps['offset'];
const defaultPlacement = 'top' as TippyProps['placement'];
const defaultTrigger = 'mouseenter focus' as TippyProps['trigger'];
const defaultTriggerTarget = null as TippyProps['triggerTarget'];
const defaultZIndex = 9999 as TippyProps['zIndex'];
const defaultAnimation = 'fade' as TippyProps['animation'];

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[tp]',
  exportAs: 'tippy',
})
export class TippyDirective implements OnChanges, AfterViewInit {
  readonly appendTo = input(defaultAppendTo, {
    alias: 'tpAppendTo',
  });

  readonly content = input<TippyContent | undefined | null>('', { alias: 'tp' });

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

  readonly tpOnShow = output<void>({ alias: 'tpOnShow' });

  readonly tpOnHide = output<void>({ alias: 'tpOnHide' });

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

  private loaderViewRef: ViewRef | null = null;
  private globalLoaderComponent = inject(TIPPY_LOADER_COMPONENT, { optional: true });
  private loaderTiming = inject(TIPPY_LOADER_TIMING);

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

  protected async createInstance() {
    if (this.created || !this.hasContent()) {
      return;
    }

    this.created = true;

    const tippy = await this.ngZone.runOutsideAngular(() => {
      return firstValueFrom(this.tippyFactory.getTippyImpl(), {
        defaultValue: undefined,
      });
    });

    if (tippy === undefined || this.destroyRef.destroyed) {
      return;
    }

    this.instance = this.ngZone.runOutsideAngular(() => {
      return tippy(this.host(), {
        appendTo,
        allowHTML: true,
        ...(this.globalConfig.zIndexGetter
          ? { zIndex: this.globalConfig.zIndexGetter() }
          : {}),
        ...onlyTippyProps(this.globalConfig),
        ...onlyTippyProps(this.props),
        // Arrow functions or inline callbacks close over the method's lexical scope,
        // causing V8 to allocate a Context object that indirectly retains the directive
        // instance inside tippy.js after destroy. A JSBoundFunction has no [[Environment]]
        // slot — only { bound_target_function, bound_this, bound_arguments } — so no
        // closure context is created. onHide is bound to null because it needs no `this`
        // at all, fully breaking the retention chain (same reasoning as `appendTo` above).
        onMount: this.onMount.bind(this),
        onCreate: this.onCreate.bind(this),
        onShow: this.onShow.bind(this),
        onHide: function (instance: TippyInstance) {
          instance.reference.removeAttribute('data-tippy-open');
        }.bind(null),
        onHidden: this.onHidden.bind(this),
      });
    });

    this.setStatus(this.isEnabled());
    this.setProps(this.props);

    this.variation() === 'contextMenu' && this.handleContextMenu();
  }

  // `resolvedContent` is provided when the caller already awaited a lazy factory.
  // Passing it here avoids re-reading `this.content()`, which would still carry
  // the raw factory function type and require another cast.
  protected resolveContent(instance: TippyInstance, resolvedContent?: Type<unknown>) {
    const content = (resolvedContent ?? this.content()) as Content | undefined | null;

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

    let newContent = this.ngZone.run(() => {
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

  private onMount(instance: TippyInstance) {
    const isVisible = true;
    this.isVisible.set(isVisible);
    this.visibleInternal.next(isVisible);
    this.ngZone.run(() => this.visible.emit(isVisible));
    this.useHostWidth() && this.listenToHostResize();
    this.globalConfig.onMount?.(instance);
  }

  private onCreate(instance: TippyInstance) {
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

  private onHidden(instance: TippyInstance = this.instance) {
    this.destroyView();
    const isVisible = false;
    // `model()` uses `OutputEmitterRef` internally to emit events when the
    // signal changes. If the directive is destroyed, it will throw an error:
    // "Unexpected emit for destroyed `OutputRef`".
    if (!this.destroyed) {
      this.isVisible.set(isVisible);
      this.ngZone.run(() => this.visible.emit(isVisible));
      this.tpOnHide.emit();
    }
    this.visibleInternal.next(isVisible);

    this.globalConfig.onHidden?.(instance);
  }

  private onShow(instance: TippyInstance) {
    // In onlyTextOverflow mode the tooltip must not appear when the host is
    // not overflowing. Returning false from onShow prevents tippy from
    // showing regardless of the instance's enabled/disabled state. This
    // acts as a last-resort guard for cases where checkOverflow() hasn't
    // been called yet (e.g. Angular's scheduler hasn't flushed CD between
    // the content/width change and the trigger event).
    if (this.onlyTextOverflow() && !isElementOverflow(this.host())) {
      return false;
    }

    // The outer `onShow` must be synchronous so that `return false` above
    // is seen as a boolean by tippy.js (an `async` function always returns
    // a Promise, which is truthy and would never suppress the show).
    this.handleOnShow(instance);
  }

  private async handleOnShow(instance: Instance) {
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
    this.tpOnShow.emit();
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

function isComponentClass(
  content: TippyContent | null | undefined,
): content is Type<any> {
  return (
    typeof content === 'function' &&
    /^class\s/.test(Function.prototype.toString.call(content))
  );
}
