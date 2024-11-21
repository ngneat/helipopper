import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  popperVariation,
  provideTippyConfig,
  provideTippyLoader,
  tooltipVariation,
  withContextMenuVariation,
} from '@ngneat/helipopper/config';

import { routes } from './app.routes';

let zIndex = 99999;

function getZIndex() {
  return zIndex++;
}

export const appConfig: ApplicationConfig = {
  providers: [
    // TODO: some e2e tests are failing with zoneless enabled.
    // provideExperimentalZonelessChangeDetection(),

    provideRouter(routes),

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
};
