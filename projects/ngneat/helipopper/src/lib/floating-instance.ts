// Only type-level imports — no runtime symbols from @floating-ui/dom so the
// library does not force-bundle it. The actual functions are injected at
// construction time by FloatingFactory.
import type {
  arrow as arrowFn,
  autoUpdate as autoUpdateFn,
  computePosition as computePositionFn,
  flip as flipFn,
  Middleware,
  offset as offsetFn,
  shift as shiftFn,
} from '@floating-ui/dom';
import type { FloatingInstance, FloatingProps } from '@ngneat/helipopper/config';

/** The subset of @floating-ui/dom that FloatingInstanceImpl needs. */
export interface FloatingUIModule {
  computePosition: typeof computePositionFn;
  autoUpdate: typeof autoUpdateFn;
  flip: typeof flipFn;
  shift: typeof shiftFn;
  offset: typeof offsetFn;
  arrow: typeof arrowFn;
}

let nextId = 0;

export const FLOATING_DEFAULTS: FloatingProps = {
  placement: 'top',
  offset: [0, 10],
  arrow: false,
  animation: 'fade',
  duration: [300, 250],
  delay: 0,
  interactive: false,
  interactiveBorder: 2,
  trigger: 'mouseenter focus',
  triggerTarget: null,
  hideOnClick: true,
  showOnCreate: false,
  appendTo: (() =>
    document.fullscreenElement || document.body) as unknown as FloatingProps['appendTo'],
  zIndex: 9999,
  maxWidth: 350,
  theme: undefined,
  allowHTML: true,
  getReferenceClientRect: null,
  middleware: [],
  onShow: null,
  onHide: null,
  onMount: null,
  onCreate: null,
  onHidden: null,
};

export class FloatingInstanceImpl implements FloatingInstance {
  readonly id = ++nextId;
  readonly reference: HTMLElement;

  popper!: HTMLElement;
  props: FloatingProps;

  state = {
    isVisible: false,
    isEnabled: true,
    isMounted: false,
    isDestroyed: false,
  };

  data?: any;

  private _content!: HTMLElement;
  private _arrow: HTMLElement | null = null;
  private _autoUpdateCleanup: (() => void) | null = null;
  private _listeners: Array<{ target: EventTarget; type: string; fn: EventListener }> =
    [];
  private _showTimer: ReturnType<typeof setTimeout> | null = null;
  private _hideTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    reference: HTMLElement,
    props: Partial<FloatingProps>,
    private readonly _ui: FloatingUIModule,
  ) {
    this.reference = reference;
    this.props = { ...FLOATING_DEFAULTS, ...props };
    this._buildPopper();
    this._bindTriggers();
    this.props.onCreate?.(this);
    if (this.props.showOnCreate) {
      this.show();
    }
  }

  show(): void {
    if (this.state.isDestroyed || !this.state.isEnabled || this.state.isVisible) return;
    if (this.props.onShow?.(this) === false) return;
    this._clearTimers();
    const delay = this._getDelay(true);
    delay > 0
      ? (this._showTimer = setTimeout(() => this._mount(), delay))
      : this._mount();
  }

  hide(): void {
    if (this.state.isDestroyed || !this.state.isVisible) return;
    this.props.onHide?.(this);
    this._clearTimers();
    const delay = this._getDelay(false);
    delay > 0
      ? (this._hideTimer = setTimeout(() => this._unmount(), delay))
      : this._unmount();
  }

  enable(): void {
    this.state.isEnabled = true;
  }

  disable(): void {
    this.state.isEnabled = false;
    if (this.state.isVisible) this.hide();
  }

  destroy(): void {
    if (this.state.isDestroyed) return;
    this.state.isDestroyed = true;
    this._clearTimers();
    this._unbindTriggers();
    this._stopAutoUpdate();
    if (this.state.isMounted) {
      this.popper.remove();
      this.state.isMounted = false;
    }
  }

  setProps(nextProps: Partial<FloatingProps>): void {
    if (this.state.isDestroyed) return;
    const needsRebind =
      nextProps.trigger !== undefined ||
      nextProps.triggerTarget !== undefined ||
      nextProps.interactive !== undefined;
    this.props = { ...this.props, ...nextProps };
    this._syncPopperStyle();
    if (needsRebind) {
      this._unbindTriggers();
      this._bindTriggers();
    }
    if (this.state.isVisible) {
      this._reposition();
    }
  }

  setContent(content: string | Element | null | undefined): void {
    if (this.state.isDestroyed) return;
    if (content == null) {
      this._content.innerHTML = '';
      return;
    }
    if (typeof content === 'string') {
      if (this.props.allowHTML) {
        this._content.innerHTML = content;
      } else {
        this._content.textContent = content;
      }
    } else {
      this._content.innerHTML = '';
      this._content.appendChild(content);
    }
  }

  private _buildPopper(): void {
    const box = document.createElement('div');
    box.className = 'tippy-box';
    box.setAttribute('data-state', 'hidden');
    box.setAttribute('tabindex', '-1');
    box.style.position = 'fixed';

    const content = document.createElement('div');
    content.className = 'tippy-content';
    box.appendChild(content);

    this.popper = box;
    this._content = content;
    this._syncPopperStyle();
  }

  private _syncPopperStyle(): void {
    const { zIndex, maxWidth, theme, animation, arrow } = this.props;

    this.popper.style.zIndex = String(zIndex);
    this.popper.style.maxWidth =
      typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;

    if (theme) {
      this.popper.setAttribute('data-theme', theme);
    } else {
      this.popper.removeAttribute('data-theme');
    }

    if (animation) {
      this.popper.setAttribute('data-animation', animation);
    } else {
      this.popper.removeAttribute('data-animation');
    }

    if (arrow && !this._arrow) {
      const arrowEl = document.createElement('div');
      arrowEl.className = 'tippy-arrow';
      this.popper.appendChild(arrowEl);
      this._arrow = arrowEl;
    } else if (!arrow && this._arrow) {
      this._arrow.remove();
      this._arrow = null;
    }
  }

  private _bindTriggers(): void {
    const target = this.props.triggerTarget ?? this.reference;

    for (const t of this.props.trigger.split(' ').filter(Boolean)) {
      switch (t) {
        case 'mouseenter':
          this._on(target, 'mouseenter', () => this.show());
          this._on(target, 'mouseleave', (e) => this._onMouseLeave(e as MouseEvent));
          if (this.props.interactive) {
            this._on(this.popper, 'mouseleave', (e) => {
              if (!this.reference.contains((e as MouseEvent).relatedTarget as Node)) {
                this.hide();
              }
            });
          }
          break;
        case 'focus':
          this._on(target, 'focus', () => this.show());
          this._on(target, 'blur', () => this.hide());
          break;
        case 'focusin':
          this._on(target, 'focusin', () => this.show());
          this._on(target, 'focusout', () => this.hide());
          break;
        case 'click':
          this._on(target, 'click', () =>
            this.state.isVisible ? this.hide() : this.show(),
          );
          break;
      }
    }

    // Clicking outside hides for non-click triggers
    if (this.props.hideOnClick === true && !this.props.trigger.includes('click')) {
      this._on(document, 'click', (e) => {
        if (
          !this.reference.contains(e.target as Node) &&
          !this.popper.contains(e.target as Node)
        ) {
          this.hide();
        }
      });
    }
  }

  private _unbindTriggers(): void {
    for (const { target, type, fn } of this._listeners) {
      target.removeEventListener(type, fn);
    }
    this._listeners = [];
  }

  private _onMouseLeave(e: MouseEvent): void {
    if (this.props.interactive && this.popper.contains(e.relatedTarget as Node)) {
      return;
    }
    this.hide();
  }

  private _on(
    target: EventTarget,
    type: string,
    fn: EventListenerOrEventListenerObject,
  ): void {
    const listener = fn as EventListener;
    target.addEventListener(type, listener);
    this._listeners.push({ target, type, fn: listener });
  }

  private async _mount(): Promise<void> {
    if (this.state.isDestroyed || this.state.isVisible) return;

    const container = this._getContainer();
    if (!this.state.isMounted) {
      container.appendChild(this.popper);
      this.state.isMounted = true;
    }

    await this._reposition();
    if (this.state.isDestroyed) return;

    this.state.isVisible = true;
    const [showDuration] = this.props.duration;
    this.popper.style.transitionDuration = `${showDuration}ms`;
    this.popper.setAttribute('data-state', 'visible');

    if (!this.props.getReferenceClientRect) {
      this._autoUpdateCleanup = this._ui.autoUpdate(this.reference, this.popper, () =>
        this._reposition(),
      );
    }

    this.props.onMount?.(this);
  }

  private _unmount(): void {
    if (this.state.isDestroyed || !this.state.isVisible) return;

    this.state.isVisible = false;
    this._stopAutoUpdate();

    const [, hideDuration] = this.props.duration;
    this.popper.style.transitionDuration = `${hideDuration}ms`;
    this.popper.setAttribute('data-state', 'hidden');

    const done = () => {
      if (this.state.isMounted) {
        this.popper.remove();
        this.state.isMounted = false;
      }
      this.props.onHidden?.(this);
    };

    if (hideDuration > 0 && this.props.animation) {
      const onEnd = () => {
        this.popper.removeEventListener('transitionend', onEnd);
        done();
      };
      this.popper.addEventListener('transitionend', onEnd);
      // Fallback in case transitionend never fires (e.g. element detached mid-flight).
      setTimeout(() => {
        this.popper.removeEventListener('transitionend', onEnd);
        if (this.state.isMounted) done();
      }, hideDuration + 50);
    } else {
      done();
    }
  }

  private async _reposition(): Promise<void> {
    if (!this.state.isMounted || this.state.isDestroyed) return;

    const { placement, offset: off, middleware: extra } = this.props;
    const [skidding, distance] = Array.isArray(off) ? off : [0, off as number];

    const middleware: Middleware[] = [
      this._ui.offset({ mainAxis: distance, crossAxis: skidding }),
      this._ui.flip(),
      this._ui.shift({ padding: 5 }),
      ...(this._arrow ? [this._ui.arrow({ element: this._arrow })] : []),
      ...(extra ?? []),
    ];

    const reference: Element | { getBoundingClientRect(): DOMRect } = this.props
      .getReferenceClientRect
      ? { getBoundingClientRect: this.props.getReferenceClientRect }
      : this.reference;

    const result = await this._ui.computePosition(reference as Element, this.popper, {
      placement,
      strategy: 'fixed',
      middleware,
    });

    if (this.state.isDestroyed) return;

    this.popper.style.left = `${result.x}px`;
    this.popper.style.top = `${result.y}px`;
    this.popper.setAttribute('data-placement', result.placement);

    if (this._arrow && result.middlewareData.arrow) {
      const { x: ax, y: ay } = result.middlewareData.arrow;
      Object.assign(this._arrow.style, {
        left: ax != null ? `${ax}px` : '',
        top: ay != null ? `${ay}px` : '',
      });
    }
  }

  private _stopAutoUpdate(): void {
    this._autoUpdateCleanup?.();
    this._autoUpdateCleanup = null;
  }

  private _getContainer(): Element {
    const { appendTo } = this.props;
    if (appendTo === 'parent') return this.reference.parentElement ?? document.body;
    if (typeof appendTo === 'function') return appendTo(this.reference);
    return appendTo as Element;
  }

  private _getDelay(show: boolean): number {
    const { delay } = this.props;
    return Array.isArray(delay) ? delay[show ? 0 : 1] : delay;
  }

  private _clearTimers(): void {
    if (this._showTimer !== null) {
      clearTimeout(this._showTimer);
      this._showTimer = null;
    }
    if (this._hideTimer !== null) {
      clearTimeout(this._hideTimer);
      this._hideTimer = null;
    }
  }
}
