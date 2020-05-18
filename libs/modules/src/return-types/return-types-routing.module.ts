import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReturnTypesComponent } from './return-types.component';
import { ReturnTypeAddComponent } from './modals/return-type-add/return-type-add.component';
import { ReturnTypeDetailsComponent } from './modals/return-type-details/return-type-details.component';

const routes: Routes = [
  {
    path: '',
    component: ReturnTypesComponent
  },
  {
    path: 'store',
    component: ReturnTypeAddComponent
  },
  {
    path: 'update/:id',
    component: ReturnTypeDetailsComponent
  },
  {
    path: 'list',
    component: ReturnTypesComponent
  },
  {
    path: 'menu',
    component: ReturnTypesComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnTypesRoutingModule {}
