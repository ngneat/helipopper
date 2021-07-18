import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IsVisibleComponent } from './is-visible/isVisible.component';
import { PlaygroundComponent } from './playground/playground.component';

const routes: Routes = [
  { path: 'is-visible', component: IsVisibleComponent },
  { path: '**', component: PlaygroundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
