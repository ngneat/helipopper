import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { TIPPY_REF, TippyInstance } from '@ngneat/helipopper';
import { injectTippyRef } from 'projects/ngneat/helipopper/src/lib/providers';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
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
