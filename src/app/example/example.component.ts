import { Component, OnDestroy, OnInit } from '@angular/core';
import { injectFloatingRef } from '@ngneat/helipopper';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  standalone: true,
})
export class ExampleComponent implements OnInit, OnDestroy {
  name: string;
  floating = injectFloatingRef();

  constructor() {
    const { name = 'world!' } = this.floating.data ?? {};

    setTimeout(() => {
      this.floating.hide();
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
