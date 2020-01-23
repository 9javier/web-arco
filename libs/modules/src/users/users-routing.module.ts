import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';
import { StoreComponent } from './store/store.component';
import { UpdateComponent } from './update/update.component';
import { MatTooltipModule } from "@angular/material";

const routes: Routes = [
  {
    path: '',
    component: UsersComponent
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
    component: UsersComponent
  },
  {
    path: 'menu',
    component: UsersComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),MatTooltipModule],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
