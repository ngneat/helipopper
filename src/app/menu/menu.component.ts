import { Component, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  comp = MenuComponent;
  @HostListener('mouseover')
  OnClick() {
    this.openPopper();
  }

  constructor(private el: ElementRef) {}

  openPopper() {
    // this.service.open(this.el, this.comp, {
    //   variation: 'popper'
    // });
  }
}
