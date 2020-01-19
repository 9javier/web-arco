import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageListProductsCarrierComponent } from './page-list-products-carrier.component';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ListProductsCarrierModule } from '../components/list-products-carrier/list-products-carrier.module';

const routes: Routes = [
  {
    path: '',
    component: PageListProductsCarrierComponent
  }
];

@NgModule({
  declarations: [PageListProductsCarrierComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    IonicModule,
    ListProductsCarrierModule
  ]
})
export class PageListProductsCarrierModule { }
