import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  Output,
  PLATFORM_ID,
  ViewContainerRef
} from "@angular/core";
import tippy from "tippy.js";
import { NgChanges, TIPPY_CONFIG, TippyConfig, TippyInstance, TippyProps } from "./tippy.types";
import { inView, overflowChanges } from "./utils";
import { fromEvent, Subject } from "rxjs";
import { switchMap, takeUntil } from "rxjs/operators";
import { Content, isString, ViewRef, ViewService } from "@ngneat/overview";
import { isPlatformServer } from "@angular/common";

@Directive({
  selector: "[tippy]",
  exportAs: "tippy"
})
export class TippyDirective implements OnChanges, AfterViewInit, OnDestroy {
  @Input() appendTo: TippyProps["appendTo"];
  @Input() delay: TippyProps["delay"];
  @Input() duration: TippyProps["duration"];
  @Input() hideOnClick: TippyProps["hideOnClick"];
  @Input() interactive: TippyProps["interactive"];
  @Input() interactiveBorder: TippyProps["interactiveBorder"];
  @Input() maxWidth: TippyProps["maxWidth"];
  @Input() offset: TippyProps["offset"];
  @Input() placement: TippyProps["placement"];
  @Input() popperOptions: TippyProps["popperOptions"];
  @Input() showOnCreate: TippyProps["showOnCreate"];
  @Input() trigger: TippyProps["trigger"];
  @Input() triggerTarget: TippyProps["triggerTarget"];
  @Input() zIndex: TippyProps["zIndex"];

  @Input() lazy: boolean;
  @Input() variation: string;
  @Input() isEnable: boolean;
  @Input() className: string;
  @Input() onlyTextOverflow = false;
  @Input() data: any;
  @Input("tippy") content: Content;

  @Output() visible = new EventEmitter<boolean>();

  private instance: TippyInstance;
  private view: Content;
  private viewRef: ViewRef;
  private destroyed = new Subject();
  private props: Partial<TippyConfig>;
  private enabled = true;
  private variationDefined = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(TIPPY_CONFIG) private globalConfig: Partial<TippyConfig>,
    private viewService: ViewService,
    private vcr: ViewContainerRef,
    private zone: NgZone,
    private host: ElementRef
  ) {}

  ngOnChanges(changes: NgChanges<TippyDirective>) {
    if (isPlatformServer(this.platformId)) return;

    if (changes.content) {
      this.view = changes.content.currentValue;
    }

    let props: Partial<TippyConfig> = Object.keys(changes).reduce((acc, change) => {
      acc[change] = changes[change].currentValue;

      return acc;
    }, {});

    let variation: string;

    if (isChanged<NgChanges<TippyDirective>>("variation", changes)) {
      variation = changes.variation.currentValue;
    } else if (!this.variationDefined) {
      variation = this.globalConfig.defaultVariation;
      this.variationDefined = true;
    }

    if (variation) {
      props = {
        ...this.globalConfig.variations[variation],
        ...props
      };
    }

    if (isChanged<NgChanges<TippyDirective>>("isEnable", changes)) {
      this.enabled = changes.isEnable.currentValue;
      this.setStatus();
    }

    // We don't want to save the content, we control it manually
    delete props.content;

    this.setProps(props);
  }

  ngAfterViewInit() {
    if (this.lazy) {
      if (this.onlyTextOverflow) {
        inView(this.host)
          .pipe(
            switchMap(() => overflowChanges(this.host)),
            takeUntil(this.destroyed)
          )
          .subscribe(isElementOverflow => {
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
      overflowChanges(this.host)
        .pipe(takeUntil(this.destroyed))
        .subscribe(isElementOverflow => {
          this.checkOverflow(isElementOverflow);
        });
    } else {
      this.createInstance();
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroy();
  }

  destroyView() {
    this.viewRef?.destroy();
    this.viewRef = null;
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

  private setProps(props: Partial<TippyConfig>) {
    this.props = props;
    this.instance?.setProps(props);
  }

  private setStatus() {
    this.enabled ? this.instance?.enable() : this.instance?.disable();
  }

  private createInstance() {
    this.instance = tippy(this.host.nativeElement as HTMLElement, {
      allowHTML: true,
      ...this.globalConfig,
      ...this.props,
      onCreate: instance => {
        this.className && instance.popper.classList.add(this.className);
        this.globalConfig.onCreate?.(instance);
      },
      onShow: instance => {
        this.zone.run(() => this.instance.setContent(this.resolveContent()));
        this.visible.next(true);
        this.globalConfig.onShow?.(instance);
      },
      onHidden: instance => {
        this.destroyView();
        this.visible.next(false);
        this.globalConfig.onHidden?.(instance);
      }
    });

    this.setStatus();
    this.setProps(this.props);

    this.variation === "contextMenu" && this.handleContextMenu();
  }

  private resolveContent() {
    this.viewRef = this.viewService.createView(this.content, {
      vcr: this.vcr,
      context: {
        $implicit: this.hide.bind(this),
        data: this.data
      }
    });

    let content = this.viewRef.getElement();

    if (isString(content) && this.globalConfig.beforeRender) {
      content = this.globalConfig.beforeRender(content);
    }

    return content;
  }

  private handleContextMenu() {
    fromEvent(this.host.nativeElement, "contextmenu")
      .pipe(takeUntil(this.destroyed))
      .subscribe((event: MouseEvent) => {
        event.preventDefault();

        this.instance.setProps({
          getReferenceClientRect: () => ({
            width: 0,
            height: 0,
            top: event.clientY,
            bottom: event.clientY,
            left: event.clientX,
            right: event.clientX
          })
        });

        this.instance.show();
      });
  }

  private checkOverflow(isElementOverflow: boolean) {
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
}

function isChanged<T>(key: keyof T, changes: T) {
  return key in changes;
}
