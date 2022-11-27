import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ExampleComponent } from './example/example.component';
import {
  popperVariation,
  provideTippyConfig,
  TippyDirective,
  tooltipVariation,
  withContextMenuVariation
} from '@ngneat/helipopper';
import { PlaygroundComponent } from './playground/playground.component';
import { IsVisibleComponent } from './is-visible/isVisible.component';

@NgModule({
  declarations: [AppComponent, ExampleComponent, PlaygroundComponent, ExampleComponent, IsVisibleComponent],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, TippyDirective],
  providers: [
    provideTippyConfig({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
        menu: {
          ...popperVariation,
          appendTo: 'parent',
          arrow: false,
          offset: [0, 0]
        },
        contextMenu: withContextMenuVariation(popperVariation),
        popperBorder: {
          ...popperVariation,
          theme: 'light-border'
        }
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
