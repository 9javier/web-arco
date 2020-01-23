import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MatTableModule, MatCheckboxModule, MatGridListModule, DateAdapter} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { WorkwavesScheduleRoutingModule } from "./workwaves-schedule-routing.module";
import { WorkwavesScheduleComponent } from "./workwaves-schedule.component";
import { CommonUiCrudModule } from '@suite/common/ui/crud';
import {ListWorkwavesScheduleComponent} from "./list/list.component";
import {TitleListWorkwavesScheduleComponent} from "./list/list-title/list-title.component";
import {WorkwaveListWorkwavesScheduleComponent} from "./list/list-workwave/list-workwave.component";
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import {MondayStartingDateAdapterService} from "../../../services/src/lib/monday-starting-date-adapter/monday-starting-date-adapter.service";
import {ListPickingRebuildModule} from "../list-picking-rebuild/list-picking-rebuild.module";
import { MatTooltipModule } from "@angular/material";

@NgModule({
  declarations: [WorkwavesScheduleComponent, ListWorkwavesScheduleComponent, TitleListWorkwavesScheduleComponent, WorkwaveListWorkwavesScheduleComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    WorkwavesScheduleRoutingModule,
    CommonUiCrudModule,
    CdkTableModule,
    FormsModule,
    BreadcrumbModule,
    MatGridListModule,
    ListPickingRebuildModule,
    MatTooltipModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: MondayStartingDateAdapterService },
  ],
  entryComponents: [ListWorkwavesScheduleComponent, TitleListWorkwavesScheduleComponent, WorkwaveListWorkwavesScheduleComponent]
})
export class WorkwavesScheduleModule {}
