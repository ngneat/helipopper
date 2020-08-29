import { Component, ElementRef, HostListener } from '@angular/core';
import { HelipopperService } from '@ngneat/helipopper';

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

  constructor(private el: ElementRef, private service: HelipopperService) {}

  openPopper() {
    this.service.open(this.el, this.comp, {
      variation: 'popper'
    });
  }
}
