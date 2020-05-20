import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierConditionsComponent } from './supplier-conditions.component';
import { SupplierConditionAddComponent } from './modals/supplier-condition-add/supplier-condition-add.component';
import { SupplierConditionDetailsComponent } from './modals/supplier-condition-details/supplier-condition-details.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierConditionsComponent
  },
  {
    path: 'store',
    component: SupplierConditionAddComponent
  },
  {
    path: 'update/:id',
    component: SupplierConditionDetailsComponent
  },
  {
    path: 'list',
    component: SupplierConditionsComponent
  },
  {
    path: 'menu',
    component: SupplierConditionsComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierConditionsRoutingModule {}
