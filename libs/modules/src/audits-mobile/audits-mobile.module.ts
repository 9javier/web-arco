import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuditsMobileComponent } from './audits-mobile.component';
import { IonicModule } from '@ionic/angular';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { FormsModule } from '@angular/forms';
import { AddAuditsComponent } from './add-audits/add-audits.component';
import { SccanerProductComponent } from './sccaner-product/sccaner-product.component';

const routes: Routes = [
  {
    path: '',
    component: AuditsMobileComponent
  },
  {
    path: 'add',
    component: AddAuditsComponent
  },
  {
    path: 'scanner-product/:id/:jaula',
    component: SccanerProductComponent
  }
];

@NgModule({
  declarations: [AuditsMobileComponent,AddAuditsComponent,SccanerProductComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    BreadcrumbModule,
    RouterModule.forChild(routes)
  ]
})
export class AuditsMobileModule { }
