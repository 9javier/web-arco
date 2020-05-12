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
import { TransportsExpeditionsComponent } from './transports-expeditions.component';
import {CreateTransportComponent} from './create-transport/create-transport.component';
import {
  MatRippleModule,
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableFiltersModule } from "../components/table-filters/table-filters.component.module";

const routes: Routes = [
  {
    path: '',
    component: TransportsExpeditionsComponent
  }
];

@NgModule({
  declarations: [TransportsExpeditionsComponent,CreateTransportComponent],
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
  ],
  entryComponents:[CreateTransportComponent],
  providers:[
    CreateTransportComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransportsExpeditionsModule { }
