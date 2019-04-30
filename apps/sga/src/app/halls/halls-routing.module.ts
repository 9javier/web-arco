import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HallsComponent } from "./halls.component";
import { StoreComponent } from './store/store.component';
import { UpdateComponent } from './update/update.component';

const routes: Routes = [
  {
    path: '',
    component: HallsComponent
  },
  {
    path: ':id',
    component: HallsComponent
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
    component: HallsComponent
  },
  {
    path: 'menu',
    component: HallsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HallsRoutingModule {}
