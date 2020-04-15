import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatListModule } from '@angular/material';
import { RouterModule, Routes } from "@angular/router";
import { BreadcrumbModule } from '../../components/breadcrumb/breadcrumb.module';
import { TagsInputModule } from '../../components/tags-input/tags-input.module';
import { PaginatorComponentModule } from '../../components/paginator/paginator.component.module';
import { FilterButtonModule } from "../../components/filter-button/filter-button.module";
import { MatTooltipModule } from "@angular/material";
import { IncidencesManualComponent } from './incidences-manual.component';
import {MatTabsModule} from '@angular/material/tabs';
import { LogisticOperatorComponent } from '../logistic-operator/logistic-operator.component';
import { LogisticOperatorModule } from '../logistic-operator/logistic-operator.module';

import {
  MatCheckboxModule,
  MatPaginatorModule,
  MatRippleModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { NgxFileDropModule } from  'ngx-file-drop' ;




@NgModule({
  entryComponents:[LogisticOperatorComponent],
  exports:[IncidencesManualComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    BreadcrumbModule,
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
    LogisticOperatorModule
  ],
  declarations: [IncidencesManualComponent]
})
export class IncidencesManualModule { }
