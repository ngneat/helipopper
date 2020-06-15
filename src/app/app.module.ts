import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelipopperModule } from '@ngneat/helipopper';
import { ReactiveFormsModule } from '@angular/forms';
import { ExampleComponent } from './example/example.component';

@NgModule({
  declarations: [AppComponent, ExampleComponent],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, HelipopperModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
