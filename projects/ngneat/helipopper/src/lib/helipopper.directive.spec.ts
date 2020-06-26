import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelipopperModule } from './helipopper.module';
import { By } from '@angular/platform-browser';
import { HelipopperDirective } from './helipopper.directive';

@Component({
  template: `
    <button class="tester" id="first-button" helipopper="Helpful Message">
      I have a tooltip
    </button>

    <button id="second-button" helipopper="Helpful Message" helipopperClass="inline-class">
      I have a tooltip
    </button>
  `
})
class TestHelipopperComponent {}

describe('Helipopper directive', () => {
  let component: TestHelipopperComponent;
  let fixture: ComponentFixture<TestHelipopperComponent>;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [TestHelipopperComponent, HelipopperDirective],
      imports: [HelipopperModule.forRoot({ allowHtml: true, helipopperClass: 'global-class' })]
    }).createComponent(TestHelipopperComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('adds global classes', () => {
    fixture.whenStable().then(() => {
      let button = fixture.debugElement.query(By.css('#first-button'));
      button.triggerEventHandler('mouseenter', null);

      fixture.detectChanges();

      let tooltip = fixture.debugElement.query(By.css('#tippy-1'));
      expect(Object.keys(tooltip.classes)).toEqual(['global-class']);
    });
  });

  it('appends inline classes to global classes', () => {
    fixture.whenStable().then(() => {
      let button = fixture.debugElement.query(By.css('#second-button'));
      button.triggerEventHandler('mouseenter', null);

      fixture.detectChanges();

      let tooltip = fixture.debugElement.query(By.css('#tippy-2'));
      expect(Object.keys(tooltip.classes)).toEqual(['global-class', 'inline-class']);
    });
  });
});
