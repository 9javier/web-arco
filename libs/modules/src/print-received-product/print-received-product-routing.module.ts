import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PrintReceivedProductComponent} from "./print-received-product.component";

const routes: Routes = [
  {
    path: '',
    component: PrintReceivedProductComponent
  },
  {
    path: 'list',
    component: PrintReceivedProductComponent
  },
  {
    path: 'menu',
    component: PrintReceivedProductComponent
  },
  {
    path: 'scandit',
    component: PrintReceivedProductComponent
  },
  {
    path: 'scandit/:val',
    component: PrintReceivedProductComponent
  },
  {
    path: 'scandit/:news/:req',
    component: PrintReceivedProductComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrintReceivedProductRoutingModule {}
