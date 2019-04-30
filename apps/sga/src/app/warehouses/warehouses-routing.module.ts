import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WarehousesComponent } from "./warehouses.component";
import { StoreComponent } from './store/store.component';
import { UpdateComponent } from './update/update.component';

const routes: Routes = [
  {
    path: '',
    component: WarehousesComponent
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
    component: WarehousesComponent
  },
  {
    path: 'menu',
    component: WarehousesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehousesRoutingModule {}
