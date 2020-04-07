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
import { ListManualComponent } from './list-manual.component';
import {MatTabsModule} from '@angular/material/tabs';
import {
  MatCheckboxModule,
  MatPaginatorModule,
  MatRippleModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { NgxFileDropModule } from  'ngx-file-drop' ;




@NgModule({
  exports:[ListManualComponent],
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
    MatTabsModule
  ],
  declarations: [ListManualComponent]
})
export class ListManualModule { }
