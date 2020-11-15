import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HelipopperModule } from '@ngneat/helipopper';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HelipopperModule.forRoot()],
      declarations: [AppComponent]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
