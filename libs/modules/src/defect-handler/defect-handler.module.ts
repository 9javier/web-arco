import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatListModule, MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { TagsInputModule } from '../components/tags-input/tags-input.module';
import { PaginatorComponentModule } from '../components/paginator/paginator.component.module';
import { MatTooltipModule } from "@angular/material";
import { DefectHandlerComponent } from './defect-handler.component';
// import { RegistryDetailsModule } from '../components/modal-defective/registry-details-al/registry-details-al.module';
import { DefectHandlerRoutingModule } from './defect-handler-routing.module';
import { RegistryDetailsComponent } from '../components/modal-defective/registry-details/registry-details.component';
import { DetailsRegisterModule } from './details-register/details-register.module';

@NgModule({
  declarations: [DefectHandlerComponent],
  entryComponents:[DefectHandlerComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatTableModule,
    DefectHandlerRoutingModule,
    MatPaginatorModule,
    BreadcrumbModule,
    TagsInputModule,
    MatSortModule,
    PaginatorComponentModule,
    MatTooltipModule,
    DetailsRegisterModule
  ],
})
export class DefectHandlerModule { }
