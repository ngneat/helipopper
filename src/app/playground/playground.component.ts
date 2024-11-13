import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ExampleComponent } from '../example/example.component';
import { TippyDirective, TippyInstance, TippyService } from '@ngneat/helipopper';

@Component({
  selector: 'app-is-visible',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundComponent {
  tooltipPositions = ['auto', 'top', 'right', 'bottom', 'left'];
  tooltipAlignments = [
    { label: 'start', value: '-start' },
    { label: 'center', value: '' },
    { label: 'end', value: '-end' },
  ];

  tooltipTypes = ['popper', 'tooltip', 'popperBorder'];

  tooltipSettings = this.fb.group({
    type: this.fb.control('tooltip'),
    alignment: this.fb.control(''),
    position: this.fb.control('top'),
    hideOnEsc: this.fb.control(false),
  });

  noContextText: string | undefined;
  maxWidth = 300;
  show = true;

  get tooltipPosition() {
    const { position, alignment } = this.tooltipSettings.value;

    return `${position}${alignment}` as TippyDirective['placement'];
  }

  get tooltipType(): string {
    return this.tooltipSettings.value.type;
  }

  get hideOnEsc(): boolean {
    return this.tooltipSettings.value.hideOnEsc;
  }

  items = Array.from({ length: 500 }, (_, i) => ({
    id: i,
    label: `Value ${i + 1}`,
  }));

  list = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    label: `Value ${i + 1}`,
  }));

  isEnabled = true;
  text = `Only shown when text is overflowed 1`;
  text2 = `Short`;
  text3 = `Short`;
  comp = ExampleComponent;

  @ViewChild('inputName', { static: true }) inputName: ElementRef;
  @ViewChild('inputNameComp', { static: true }) inputNameComp: ElementRef;

  constructor(private fb: UntypedFormBuilder, private service: TippyService) {}

  toggleText(text: string, index: number) {
    const resolved =
      text === `Only shown when text is overflowed ${index}` ? `Short` : `Only shown when text is overflowed`;

    return `${resolved} ${index}`;
  }

  toggleMaxWidth() {
    this.maxWidth = this.maxWidth === 300 ? 100 : 300;
  }

  toggleEnabled() {
    this.isEnabled = !this.isEnabled;
  }

  handleStatus($event: boolean): void {
    console.log('show tooltip', $event);
  }

  instance2: TippyInstance;

  useService(host: HTMLButtonElement) {
    if (!this.instance2) {
      this.service.create(host, 'Created').subscribe((instance) => {
        this.instance2 = instance;
      });
    }
  }

  instance: TippyInstance;

  useServiceComponent(host2: HTMLButtonElement) {
    if (!this.instance) {
      this.service
        .create(host2, ExampleComponent, {
          variation: 'popper',
          data: {
            name: 'ngneat',
          },
        })
        .subscribe((instance) => {
          this.instance = instance;
        });
    }
  }

  duplicate(item: any) {
    console.log('duplicate', item);
  }

  copy(item: any) {
    console.log('copy', item);
  }

  visibility = false;
}
