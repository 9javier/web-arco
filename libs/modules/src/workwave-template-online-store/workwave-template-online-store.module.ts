import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  MatTableModule,
  MatCheckboxModule,
  MatGridListModule,
  MatRadioModule,
  MatDatepickerModule, MatNativeDateModule, DateAdapter
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { WorkwaveTemplateOnlineStoreRoutingModule } from "./workwave-template-online-store-routing.module";
import { WorkwaveTemplateOnlineStoreComponent } from "./workwave-template-online-store.component";
import { CommonUiCrudModule } from '@suite/common/ui/crud';
import {ListWorkwaveTemplateRebuildOSComponent} from "./list/list.component";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {MondayStartingDateAdapterService} from "../../../services/src/lib/monday-starting-date-adapter/monday-starting-date-adapter.service";
import {TableEmployeesOSComponent} from "./table-employees/table-employees.component";
import {TableRequestsOrdersOSComponent} from "./table-requests-orders/table-requests-orders.component";
import {TableTeamAssignationOSComponent} from "./table-team-assignation/table-team-assignation.component";
import {TableTypesOSComponent} from "./table-types/table-types.component";
import {FilterButtonModule} from "../components/filter-button/filter-button.module";

@NgModule({
  declarations: [WorkwaveTemplateOnlineStoreComponent, ListWorkwaveTemplateRebuildOSComponent, TableTypesOSComponent, TableEmployeesOSComponent, TableRequestsOrdersOSComponent, TableTeamAssignationOSComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    WorkwaveTemplateOnlineStoreRoutingModule,
    CommonUiCrudModule,
    CdkTableModule,
    FormsModule,
    MatGridListModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    FilterButtonModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MondayStartingDateAdapterService },
  ],
  entryComponents: [ListWorkwaveTemplateRebuildOSComponent, TableTypesOSComponent, TableEmployeesOSComponent, TableRequestsOrdersOSComponent, TableTeamAssignationOSComponent]
})
export class WorkwaveTemplateOnlineStoreModule {}
