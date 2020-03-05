import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefectHandlerRoutingModule } from './defect-handler-routing.module';
import { DefectHandlerComponent } from './defect-handler.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatListModule, MatTableModule, MatPaginatorModule, MatSortModule, MatTooltipModule } from '@angular/material';
import { BreadcrumbModule, TagsInputModule } from '..';
import { PaginatorComponentModule } from '../components/paginator/paginator.component.module';

@NgModule({
  declarations: [DefectHandlerComponent],
  imports: [
    CommonModule,
    DefectHandlerRoutingModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    BreadcrumbModule,
    TagsInputModule,
    MatSortModule,
    PaginatorComponentModule,
    MatTooltipModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DefectHandlerModule { }
