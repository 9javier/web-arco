import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnfitOnlineProductsComponent } from "./unfit-online-products.component";

const routes: Routes = [
  {
    path: '',
    component: UnfitOnlineProductsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnfitOnlineProductsRoutingModule {}
