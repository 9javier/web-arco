import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { 
  MatTabsModule,
  MatCheckboxModule,
  MatRippleModule,
  MatSortModule,
  MatTooltipModule,
  MatListModule,
  MatTableModule,
  MatPaginatorModule 
} from '@angular/material';
import { TransportsOrdersComponent } from './transports-orders.component';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { PaginatorComponentModule } from '../components/paginator/paginator.component.module';
import { OrderPackageModule } from './order-package/order-package.module';
import { PackagesComponent } from './packages/packages.component';
import { FilterButtonModule } from '../components/filter-button/filter-button.module';
import { TagsInputModule } from '../components/tags-input/tags-input.module';

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
