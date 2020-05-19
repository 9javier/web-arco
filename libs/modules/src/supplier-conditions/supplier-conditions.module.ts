import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SupplierConditionsComponent } from './supplier-conditions.component';
import { IonicModule } from '@ionic/angular';
import {
  MatCheckboxModule,
  MatPaginatorModule,
  MatRippleModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { TagsInputModule } from '../components/tags-input/tags-input.module';
import { PaginatorComponentModule } from '../components/paginator/paginator.component.module';
import { FilterButtonModule } from "../components/filter-button/filter-button.module";
import { MatTooltipModule } from "@angular/material";
import { DataModule} from "./modals/data/data.module";
import { SupplierConditionDetailsComponent } from './modals/supplier-condition-details/supplier-condition-details.component';
import { SupplierConditionAddComponent } from './modals/supplier-condition-add/supplier-condition-add.component';

const routes: Routes = [
  {
    path: '',
  component: SupplierConditionsComponent
  }
];

@NgModule({
  declarations: [SupplierConditionsComponent,
    SupplierConditionDetailsComponent,
    SupplierConditionAddComponent
  ],
  entryComponents: [SupplierConditionsComponent,
    SupplierConditionDetailsComponent,
    SupplierConditionAddComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatTableModule,
    MatCheckboxModule,
    MatRippleModule,
    MatSortModule,
    FilterButtonModule,
    PaginatorComponentModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatListModule,
    MatPaginatorModule,
    BreadcrumbModule,
    TagsInputModule,
    DataModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SupplierConditionsModule { }
