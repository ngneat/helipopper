import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ExampleComponent } from './example/example.component';
import { TippyDirective } from '@ngneat/helipopper';
import {
  popperVariation,
  tooltipVariation,
  withContextMenuVariation,
  provideTippyConfig,
  provideTippyLoader,
} from '@ngneat/helipopper/config';
import { PlaygroundComponent } from './playground/playground.component';
import { IsVisibleComponent } from './is-visible/isVisible.component';

let zIndex = 99999;

function getZIndex() {
  return zIndex++;
}

@NgModule({
  declarations: [
    AppComponent,
    ExampleComponent,
    PlaygroundComponent,
    ExampleComponent,
    IsVisibleComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule, TippyDirective],
  providers: [
    provideTippyLoader(() => import('tippy.js')),
    provideTippyConfig({
      defaultVariation: 'tooltip',
      zIndexGetter: getZIndex,
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
        menu: {
          ...popperVariation,
          appendTo: 'parent',
          arrow: false,
          offset: [0, 0],
        },
        contextMenu: withContextMenuVariation(popperVariation),
        popperBorder: {
          ...popperVariation,
          theme: 'light-border',
        },
      },
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
