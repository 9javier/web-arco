import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MatCheckboxModule, MatSortModule, MatTableModule } from '@angular/material';
import { MatListModule } from '@angular/material';
import { RouterModule, Routes } from "@angular/router";
import { MatPaginatorModule } from '@angular/material';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { TagsInputModule } from '../components/tags-input/tags-input.module';
import { PaginatorComponentModule } from '../components/paginator/paginator.component.module';
import { FilterButtonModule } from "../components/filter-button/filter-button.module";
import { MatTooltipModule } from "@angular/material";
import { BrandsComponent } from './brands.component';
import {NewBrandComponent} from './new-brand/new-brand.component';

import {
  MatRippleModule,
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableFiltersModule } from "../components/table-filters-updated/table-filters.component.module";
import { MatSelectModule} from "@angular/material";
import { MatExpansionModule } from '@angular/material';
import {SizeModalComponent} from './sizes-modal/sizes-modal.component';
import {MatButtonModule, MatIconModule} from "@angular/material";

const routes: Routes = [
  {
    path: '',
    component: BrandsComponent
  }
];

@NgModule({
  declarations: [BrandsComponent,NewBrandComponent,SizeModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    BreadcrumbModule,
    RouterModule.forChild(routes),
    TagsInputModule,
    PaginatorComponentModule,
    FilterButtonModule,
    MatTooltipModule,
    MatSortModule,
    MatCheckboxModule,
    MatRippleModule,
    FormsModule,
    TableFiltersModule,
    MatSelectModule,
    MatExpansionModule,
    MatIconModule,
  ],
  entryComponents:[NewBrandComponent,SizeModalComponent],
  providers:[
    NewBrandComponent,
    SizeModalComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BrandsModule { }
