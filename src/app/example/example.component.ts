import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { TIPPY_REF, TippyInstance } from '@ngneat/helipopper';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit, OnDestroy {
  name: string;

  constructor(@Inject(TIPPY_REF) tippy: TippyInstance) {
    console.log(tippy);

    const { name = 'world!' } = tippy.data ?? {};

    this.name = name;
  }

  ngOnInit(): void {
    console.log('ngOnInit');
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
  }
}
