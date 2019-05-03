import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocationsComponent } from "./locations.component";
import { UpdateComponent } from './update/update.component';

const routes: Routes = [
  {
    path: '',
    component: LocationsComponent
  },
  {
    path: ':id',
    component: LocationsComponent
  },
  {
    path: 'store/:id',
    component: UpdateComponent
  },
  {
    path: 'list',
    component: LocationsComponent
  },
  {
    path: 'menu',
    component: LocationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationsRoutingModule {}
