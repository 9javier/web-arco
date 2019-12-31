import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SendEmptyPackingComponent } from './send-empty-packing.component';

const routes: Routes = [
  {
    path: '',
    component: SendEmptyPackingComponent
  },
  {
    path: 'list',
    component: SendEmptyPackingComponent
  },
  {
    path: 'menu',
    component: SendEmptyPackingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SendEmptyPackingRoutingModule {}

