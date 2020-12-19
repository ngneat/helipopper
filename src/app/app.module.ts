import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ExampleComponent } from './example/example.component';
import { defaultVariations, TippyModule } from '@ngneat/helipopper';

@NgModule({
  declarations: [AppComponent, ExampleComponent],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, TippyModule.forRoot(defaultVariations())],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
