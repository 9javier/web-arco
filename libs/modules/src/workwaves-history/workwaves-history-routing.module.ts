import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkwavesHistoryComponent } from "./workwaves-history.component";
import {ListDetailHistoryComponent} from "./list-detail/list-detail.component";
import {ListPickingComponent} from "../list-picking/list-picking.component";

const routes: Routes = [
  {
    path: '',
    component: WorkwavesHistoryComponent
  },
  {
    path: 'list',
    component: WorkwavesHistoryComponent
  },
  {
    path: 'menu',
    component: WorkwavesHistoryComponent
  },
  {
    path: 'detail',
    component: ListDetailHistoryComponent
  },
  {
    path: 'pickings',
    component: ListPickingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkwavesHistoryRoutingModule {}
