import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderPreparationComponent } from "./order-preparation.component";
import { InputCodesComponent } from "./input-codes/input-codes.component";

const routes: Routes = [
  {
    path: '',
    component: OrderPreparationComponent
  },
  {
    path: 'id/:id',
    component: OrderPreparationComponent
  },
  {
    path: 'code/:id',
    component: InputCodesComponent
  },
  {
    path: 'code/alert/:alert',
    component: InputCodesComponent
  },
  {
    path: 'expe-alert/:id_alert',
    component: OrderPreparationComponent
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderPreparationRoutingModule {}
