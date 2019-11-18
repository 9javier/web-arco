import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  MatTableModule,
  MatCheckboxModule,
  MatGridListModule,
  MatRadioModule,
  MatDatepickerModule, MatNativeDateModule, DateAdapter, MatButtonModule
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { WorkwaveTemplateRebuildRoutingModule } from "./workwave-template-rebuild-routing.module";
import { WorkwaveTemplateRebuildComponent } from "./workwave-template-rebuild.component";
import { CommonUiCrudModule } from '@suite/common/ui/crud';
import {ListWorkwaveTemplateRebuildComponent} from "./list/list.component";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";
import {MondayStartingDateAdapterService} from "../../../services/src/lib/monday-starting-date-adapter/monday-starting-date-adapter.service";
import {TableStoresComponent} from "./table-stores/table-stores.component";
import {TableEmployeesComponent} from "./table-employees/table-employees.component";
import {TableRequestsOrdersComponent} from "./table-requests-orders/table-requests-orders.component";
import {TableTeamAssignationComponent} from "./table-team-assignation/table-team-assignation.component";
import {TableTypesComponent} from "./table-types/table-types.component";
import {FilterButtonModule} from "../components/filter-button/filter-button.module";

@NgModule({
  declarations: [WorkwaveTemplateRebuildComponent, ListWorkwaveTemplateRebuildComponent, TableTypesComponent, TableStoresComponent, TableEmployeesComponent, TableRequestsOrdersComponent, TableTeamAssignationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    WorkwaveTemplateRebuildRoutingModule,
    CommonUiCrudModule,
    CdkTableModule,
    FormsModule,
    MatGridListModule,
    MatButtonModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule,
    FilterButtonModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MondayStartingDateAdapterService },
  ],
  entryComponents: [ListWorkwaveTemplateRebuildComponent, TableTypesComponent, TableStoresComponent, TableEmployeesComponent, TableRequestsOrdersComponent, TableTeamAssignationComponent]
})
export class WorkwaveTemplateRebuildModule {}
