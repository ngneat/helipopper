import { Routes } from '@angular/router';

import { IsVisibleComponent } from './is-visible/isVisible.component';
import { PlaygroundComponent } from './playground/playground.component';

export const routes: Routes = [
  { path: 'is-visible', component: IsVisibleComponent },
  { path: '**', component: PlaygroundComponent },
];
