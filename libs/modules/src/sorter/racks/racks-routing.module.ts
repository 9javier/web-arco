import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RacksComponent } from './racks.component';
import { StoreComponent } from './store/store.component';
// import { UpdateComponent } from './update/update.component';

const routes: Routes = [
  {
    path: '',
    component: RacksComponent
  },
  {
    path: 'store',
    component: StoreComponent
  },
  {
    path: 'store/:id',
    // component: UpdateComponent
  },
  {
    path: 'list',
    component: RacksComponent
  },
  {
    path: 'menu',
    component: RacksComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RacksRoutingModule {}
