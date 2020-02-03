import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JailComponent } from './jail.component';
import { StoreComponent } from './store/store.component';
import { UpdateComponent } from './update/update.component';
import { HistoryWarehouseComponent } from './history-warehouse/history-warehouse.component';
import { HistoryWarehouseNMComponent } from './history-warehouse-no-modal/history-warehouse-no-modal.component';

const routes: Routes = [
  {
    path: '',
    component: JailComponent
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
    component: JailComponent
  },
  {
    path: 'history/:datemin/:datemax/:whsCode',
    component: HistoryWarehouseComponent
  },
  {
    path: 'history',
    component: HistoryWarehouseNMComponent
  },
  {
    path: 'menu',
    component: JailComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JailRoutingModule {}
