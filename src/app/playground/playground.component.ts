import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ExampleComponent } from '../example/example.component';
import { interval } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TippyInstance, TippyService } from '@ngneat/helipopper';

@Component({
  selector: 'app-is-visible',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent {
  tooltipPositions = ['auto', 'top', 'right', 'bottom', 'left'];
  tooltipAlignments = [
    { label: 'start', value: '-start' },
    { label: 'center', value: '' },
    { label: 'end', value: '-end' }
  ];

  tooltipTypes = ['popper', 'tooltip', 'popperBorder'];

  tooltipSettings = this.fb.group({
    type: this.fb.control('tooltip'),
    alignment: this.fb.control(''),
    position: this.fb.control('top'),
    hideOnEsc: this.fb.control(false)
  });

  interval$ = interval(1000).pipe(finalize(() => console.log('interval completed')));

  get tooltipPosition(): string {
    const { position, alignment } = this.tooltipSettings.value;

    return `${position}${alignment}`;
  }

  get tooltipType(): string {
    return this.tooltipSettings.value.type;
  }

  get hideOnEsc(): boolean {
    return this.tooltipSettings.value.hideOnEsc;
  }

  items = Array.from({ length: 500 }, (_, i) => ({
    id: i,
    label: `Value ${i + 1}`
  }));

  list = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    label: `Value ${i + 1}`
  }));

  thoughts = 'We just need someone to talk to 🥺';
  isDisabled = false;
  text = `Long Long All Text`;
  comp = ExampleComponent;

  changeContent() {
    this.text = this.text === `Long Long All Text` ? `Short` : `Long Long All Text`;
  }

  constructor(private fb: FormBuilder, private service: TippyService) {}

  @ViewChild('inputName', { static: true }) inputName: ElementRef;
  @ViewChild('inputNameComp', { static: true }) inputNameComp: ElementRef;
  maxWidth = 300;
  show = true;

  toggle() {
    this.isDisabled = !this.isDisabled;
  }

  handleStatus($event: boolean): void {
    console.log('show tooltip', $event);
  }

  instance2: TippyInstance;

  useService(host: HTMLButtonElement) {
    if (!this.instance2) {
      this.instance2 = this.service.create(host, 'Created');
    }
  }

  instance: TippyInstance;

  useServiceComponent(host2: HTMLButtonElement) {
    if (!this.instance) {
      this.instance = this.service.create(host2, ExampleComponent, {
        variation: 'popper',
        context: {
          foo: 1
        }
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
