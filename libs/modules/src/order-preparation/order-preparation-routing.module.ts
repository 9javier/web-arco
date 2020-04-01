import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderPreparationComponent } from "./order-preparation.component";
import { InputCodesComponent } from "./input-codes/input-codes.component";
import { ListAlertsComponent } from "./list-alerts/list-alerts.component";

const routes: Routes = [
  {
    path: '',
    component: OrderPreparationComponent
  },
  {
    path: 'code',
    component: InputCodesComponent
  },
  {
    path: 'alerts',
    component: ListAlertsComponent
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderPreparationRoutingModule {}
