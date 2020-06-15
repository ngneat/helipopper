import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ExampleComponent } from './example/example.component';
import { interval } from 'rxjs';
import { finalize } from 'rxjs/operators';

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

  peace = ['We', 'Come', 'In', 'Peace', '👽'];
  war = ['👽🚀🛰', 'Your', 'world', 'is', 'ours', '👽🚀🛰'];
  thoughts = 'We just need someone to talk to 🥺';
  messages = this.war;
  isDisabled = false;
  text = `Long Long All Text`;
  isSticky = false;
  comp = ExampleComponent;

  changeContent() {
    this.text = this.text === `Long Long All Text` ? `Short` : `Long Long All Text`;
  }

  constructor(private fb: FormBuilder) {}

  toggleSticky() {
    this.isSticky = !this.isSticky;
  }

  toggle() {
    this.isDisabled = !this.isDisabled;
  }

  talk() {
    this.messages = this.peace;
    this.thoughts = 'We love our human friends! 🥳';
  }

  close() {
    console.log('close');
  }
}
