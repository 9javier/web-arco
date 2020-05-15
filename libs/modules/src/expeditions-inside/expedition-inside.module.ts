import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatListModule } from '@angular/material';
import { RouterModule, Routes } from "@angular/router";
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { TagsInputModule } from '../components/tags-input/tags-input.module';
import { PaginatorComponentModule } from '../components/paginator/paginator.component.module';
import { FilterButtonModule } from "../components/filter-button/filter-button.module";
import { MatTooltipModule } from "@angular/material";
import { ExpeditionInsideComponent } from './expedition-inside.component';
import {MatTabsModule} from '@angular/material/tabs';
import { TableFiltersModule } from "../components/table-filters/table-filters.component.module";

import {
  MatCheckboxModule,
  MatPaginatorModule,
  MatRippleModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { NgxFileDropModule } from  'ngx-file-drop' ;
import { InternalExpeditionModalComponent } from '../modal-info-expeditions/product-details-al/internal-expedition-modal.component';
import { InternalExpeditionModalModule } from '../modal-info-expeditions/product-details-al/internal-expedition-modal.module';

const routes: Routes = [
  {
    path: '',
    component: ExpeditionInsideComponent
  }
];



@NgModule({
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
    FormsModule,
    MatCheckboxModule,
    MatRippleModule,
    MatSortModule,
    NgxFileDropModule,
    MatTabsModule,
    InternalExpeditionModalModule,
    TableFiltersModule,
  ],
  declarations: [ExpeditionInsideComponent],
  entryComponents:[InternalExpeditionModalComponent]
})
export class ExpeditionInsideModule { }
