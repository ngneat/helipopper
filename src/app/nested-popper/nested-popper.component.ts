import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-nested-popper',
  templateUrl: './nested-popper.component.html',
  styleUrls: ['./nested-popper.component.scss']
})
export class NestedPopperComponent {
  formControl = new FormControl();
  @Output() submit: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('inputName', { static: true }) public inputName: ElementRef;
}
