import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { TIPPY_REF, TippyInstance } from "@ngneat/helipopper";

@Component({
  selector: "app-example",
  templateUrl: "./example.component.html",
  styleUrls: ["./example.component.scss"]
})
export class ExampleComponent implements OnInit, OnDestroy {
  constructor(@Inject(TIPPY_REF) tippy: TippyInstance) {
    console.log(tippy);
  }

  ngOnInit(): void {
    console.log("ngOnInit");
  }

  ngOnDestroy() {
    console.log("ngOnDestroy");
  }
}
