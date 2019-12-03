import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreComponent } from './store/store.component';
import { UpdateComponent } from './update/update.component';
import { StateExpeditionAvelonComponent } from './state-expedition-avelon.component';

const routes: Routes = [
  {
    path: '',
    component: StateExpeditionAvelonComponent
  },
  {
    path: 'store',
    component: StoreComponent
  },
  {
    path: 'store/:id',
    component: UpdateComponent
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

