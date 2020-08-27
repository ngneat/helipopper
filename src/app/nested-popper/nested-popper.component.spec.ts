import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NestedPopperComponent } from './nested-popper.component';

describe('NestedPopperComponent', () => {
  let component: NestedPopperComponent;
  let fixture: ComponentFixture<NestedPopperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NestedPopperComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NestedPopperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
