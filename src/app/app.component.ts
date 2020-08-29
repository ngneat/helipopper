import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ExampleComponent } from './example/example.component';
import { interval } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { HelipopperDirective, HelipopperService } from '@ngneat/helipopper';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
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
  menu = MenuComponent;
  formControl = new FormControl();
  formControlWithComp = new FormControl();
  popper: HelipopperDirective;
  popperWithComp: HelipopperDirective;
  popperWithNestedComp: HelipopperDirective;

  changeContent() {
    this.text = this.text === `Long Long All Text` ? `Short` : `Long Long All Text`;
  }

  constructor(private fb: FormBuilder, private service: HelipopperService) {}

  @ViewChild('inputName', { static: true }) inputName: ElementRef;
  @ViewChild('inputNameComp', { static: true }) inputNameComp: ElementRef;

  ngAfterViewInit() {
    this.formControl.valueChanges.subscribe(value => {
      if (value && this.popper) {
        this.popper.hide();
      } else if (!value && this.popper) {
        this.popper.show();
      }
    });

    this.formControlWithComp.valueChanges.subscribe(value => {
      if (value && this.popperWithComp) {
        this.popperWithComp.hide();
      } else if (!value && this.popperWithComp) {
        this.popperWithComp.show();
      }
    });
  }

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

  submit(): void {
    if (!this.formControl.value) {
      this.popper = this.service.open(this.inputName, 'this field is required');
    }
  }

  submitWithComp(): void {
    if (!this.formControlWithComp.value) {
      this.popperWithComp = this.service.open(this.inputNameComp, this.comp);
    }
  }
}
