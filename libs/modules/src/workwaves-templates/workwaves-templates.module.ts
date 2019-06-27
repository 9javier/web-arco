import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MatTableModule, MatCheckboxModule, MatGridListModule, DateAdapter} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { WorkwavesTemplatesRoutingModule } from "./workwaves-templates-routing.module";
import { WorkwavesTemplatesComponent } from "./workwaves-templates.component";
import { CommonUiCrudModule } from '@suite/common/ui/crud';
import {ListWorkwavesTemplatesComponent} from "./list/list.component";
import {TitleListWorkwavesTemplateComponent} from "./list/list-title/list-title.component";
import {WorkwaveListWorkwavesTemplateComponent} from "./list/list-workwave/list-workwave.component";
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import {MondayStartingDateAdapterService} from "../../../services/src/lib/monday-starting-date-adapter/monday-starting-date-adapter.service";

@NgModule({
  declarations: [WorkwavesTemplatesComponent, ListWorkwavesTemplatesComponent, TitleListWorkwavesTemplateComponent, WorkwaveListWorkwavesTemplateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    WorkwavesTemplatesRoutingModule,
    CommonUiCrudModule,
    CdkTableModule,
    FormsModule,
    MatGridListModule,
    BreadcrumbModule
  ],
  providers: [
    { provide: DateAdapter, useClass: MondayStartingDateAdapterService },
  ],
  entryComponents: [ListWorkwavesTemplatesComponent, TitleListWorkwavesTemplateComponent, WorkwaveListWorkwavesTemplateComponent]
})
export class WorkwavesTemplatesModule {}
