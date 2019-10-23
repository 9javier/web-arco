import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoreUpdateComponent } from './store-update/store-update.component';

const routes: Routes = [
  {
    path: 'store',
    component: StoreUpdateComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RacksRoutingModule { }
