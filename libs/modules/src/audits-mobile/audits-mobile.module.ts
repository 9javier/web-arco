import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuditsMobileComponent } from './audits-mobile.component';
import { IonicModule } from '@ionic/angular';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { FormsModule } from '@angular/forms';
import { AddAuditsComponent } from './add-audits/add-audits.component';
import { SccanerProductComponent } from './sccaner-product/sccaner-product.component';
import { PendingRevisionsComponent } from './pending-revisions/pending-revisions.component';
import { ProductListComponent } from './product-list/product-list.component';
import {ScannerManualModule} from "../components/scanner-manual/scanner-manual.module";
import { HideKeyboardModule } from 'hide-keyboard';
import {MatButtonModule, MatIconModule, MatListModule} from "@angular/material";
import {PopoverFiltersModule} from "./sccaner-product/popover-filters/popover-filters.module";

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
    path: 'pending-revisions',
    component: PendingRevisionsComponent
  },
  {
    path: 'list-products/:id/:jaula/:add',
    component: ProductListComponent
  },
  {
    path: 'scanner-product/:id/:jaula/:back',
    component: SccanerProductComponent
  },
  {
    path: 'multiple',
    component: AuditsMobileComponent
  }
];

@NgModule({
  declarations: [
    AuditsMobileComponent,
    AddAuditsComponent,
    SccanerProductComponent,
    PendingRevisionsComponent,
    ProductListComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    BreadcrumbModule,
    RouterModule.forChild(routes),
    ScannerManualModule,
    HideKeyboardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    PopoverFiltersModule
  ]
})
export class AuditsMobileModule { }
