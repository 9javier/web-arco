import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkwavesHistoryComponent } from "./workwaves-history.component";
import {ListDetailHistoryComponent} from "./list-detail/list-detail.component";

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkwavesHistoryRoutingModule {}
