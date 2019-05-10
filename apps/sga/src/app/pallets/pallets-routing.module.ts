import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PalletsComponent } from './pallets.component';
import { StoreComponent } from './store/store.component';
import { UpdateComponent } from './update/update.component';

const routes: Routes = [
  {
    path: '',
    component: PalletsComponent
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
    component: PalletsComponent
  },
  {
    path: 'menu',
    component: PalletsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PalletsRoutingModule {}

