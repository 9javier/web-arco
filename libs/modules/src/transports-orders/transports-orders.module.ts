import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransportsOrdersComponent } from './transports-orders.component';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { MatTabsModule, MatCheckboxModule, MatRippleModule, MatSortModule, MatTooltipModule, MatListModule, MatTableModule, MatPaginatorModule } from '@angular/material';
import { FilterButtonModule, TagsInputModule } from '..';
import { PaginatorComponentModule } from '../components/paginator/paginator.component.module';
import { OrderPackageComponent } from './order-package/order-package.component';
import { OrderPackageModule } from './order-package/order-package.module';
import { PackagesComponent } from './packages/packages.component';

const routes: Routes = [
  {
    path: '',
    component: TransportsOrdersComponent
  }
];

@NgModule({
  declarations: [TransportsOrdersComponent, PackagesComponent],
  entryComponents: [PackagesComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    BreadcrumbModule,
    MatTabsModule,
    MatCheckboxModule,
    MatRippleModule,
    MatSortModule,
    MatTooltipModule,
    FilterButtonModule,
    PaginatorComponentModule,
    TagsInputModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    OrderPackageModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransportsOrdersModule { }
