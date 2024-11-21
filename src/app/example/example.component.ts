import { Component, OnDestroy, OnInit } from '@angular/core';
import { injectTippyRef } from '@ngneat/helipopper';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  standalone: true,
})
export class ExampleComponent implements OnInit, OnDestroy {
  name: string;
  tippy = injectTippyRef();

  constructor() {
    const { name = 'world!' } = this.tippy.data ?? {};

    setTimeout(() => {
      this.tippy.hide();
    }, 1000);

    this.name = name;
  }

  ngOnInit(): void {
    console.log('ngOnInit');
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
  }
}
