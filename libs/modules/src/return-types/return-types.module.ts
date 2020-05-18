import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReturnTypesComponent } from './return-types.component';
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
import { ReturnTypeDetailsComponent } from './modals/return-type-details/return-type-details.component';
import { ReturnTypeAddComponent } from './modals/return-type-add/return-type-add.component';

const routes: Routes = [
  {
    path: '',
  component: ReturnTypesComponent
  }
];

@NgModule({
  declarations: [ReturnTypesComponent,
    ReturnTypeDetailsComponent,
    ReturnTypeAddComponent
  ],
  entryComponents: [ReturnTypesComponent,
    ReturnTypeDetailsComponent,
    ReturnTypeAddComponent
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
export class ReturnTypesModule { }
