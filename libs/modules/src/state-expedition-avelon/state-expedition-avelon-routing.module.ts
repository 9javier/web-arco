import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StateExpeditionAvelonComponent } from './state-expedition-avelon.component';

const routes: Routes = [
  {
    path: '',
    component: StateExpeditionAvelonComponent
  },
  {
    path: 'list',
    component: StateExpeditionAvelonComponent
  },
  {
    path: 'menu',
    component: StateExpeditionAvelonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StateExpeditionAvelonRoutingModule {}

