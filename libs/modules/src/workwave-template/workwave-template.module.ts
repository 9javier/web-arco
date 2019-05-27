import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  MatTableModule,
  MatCheckboxModule,
  MatGridListModule,
  MatRadioModule,
  MatDatepickerModule, MatNativeDateModule
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { WorkwaveTemplateRoutingModule } from "./workwave-template-routing.module";
import { WorkwaveTemplateComponent } from "./workwave-template.component";
import { CommonUiCrudModule } from '@suite/common/ui/crud';
import {ListWorkwaveTemplateComponent} from "./list/list.component";
import {TitleListWorkwaveTemplateComponent} from "./list/list-title/list-title.component";
import {WorkwaveListWorkwaveTemplateComponent} from "./list/list-workwave/list-workwave.component";
import {StoreComponent} from "./store/store.component";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";

@NgModule({
  declarations: [WorkwaveTemplateComponent, ListWorkwaveTemplateComponent, TitleListWorkwaveTemplateComponent, WorkwaveListWorkwaveTemplateComponent, StoreComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    WorkwaveTemplateRoutingModule,
    CommonUiCrudModule,
    CdkTableModule,
    FormsModule,
    MatGridListModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule
  ],
  entryComponents: [ListWorkwaveTemplateComponent, TitleListWorkwaveTemplateComponent, WorkwaveListWorkwaveTemplateComponent, StoreComponent]
})
export class WorkwaveTemplateModule {}
