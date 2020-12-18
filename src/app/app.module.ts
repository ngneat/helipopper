import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ExampleComponent } from './example/example.component';
import { MenuComponent } from './menu/menu.component';
import { TippyModule } from '../../projects/ngneat/helipopper/src/lib/tippy.module';

@NgModule({
  declarations: [AppComponent, ExampleComponent, MenuComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    TippyModule.forRoot({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: {
          arrow: false,
          animation: 'scale'
        },
        popper: {
          theme: 'light',
          trigger: 'click',
          interactive: true
        }
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

//       offset: this.popperOffset || ([0, this.isTooltip ? 5 : 10] as [number, number]),
//       theme: this.isTooltip ? null : 'light',
//       arrow: this.isTooltip === false,
//       animation: this.isTooltip ? `scale` : null,
//       interactive: !this.isTooltip
