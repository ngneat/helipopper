import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ExampleComponent } from './example/example.component';
import { interval } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TippyService } from '@ngneat/helipopper';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  tooltipPositions = ['auto', 'top', 'right', 'bottom', 'left'];
  tooltipAlignments = [
    { label: 'start', value: '-start' },
    { label: 'center', value: '' },
    { label: 'end', value: '-end' }
  ];

  tooltipTypes = ['popper', 'tooltip'];

  tooltipSettings = this.fb.group({
    type: this.fb.control('tooltip'),
    alignment: this.fb.control(''),
    position: this.fb.control('top')
  });

  interval$ = interval(1000).pipe(finalize(() => console.log('interval completed')));

  get tooltipPosition(): string {
    const { position, alignment } = this.tooltipSettings.value;

    return `${position}${alignment}`;
  }

  get tooltipType(): string {
    return this.tooltipSettings.value.type;
  }

  items = Array.from({ length: 500 }, (_, i) => ({
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

  toggle() {
    this.isDisabled = !this.isDisabled;
  }

  handleStatus($event: boolean): void {
    console.log('show tooltip', $event);
  }

  useService(host: HTMLButtonElement) {
    this.service.create(host, 'Created');
  }

  useServiceComponent(host2: HTMLButtonElement) {
    this.service.create(host2, ExampleComponent, {
      variation: 'popper'
    });
  }
}
