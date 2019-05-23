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
import { WorkwavesRoutingModule } from "./workwaves-routing.module";
import { WorkwavesComponent } from "./workwaves.component";
import { CommonUiCrudModule } from '@suite/common/ui/crud';
import {ListWorkwavesComponent} from "./list/list.component";
import {TitleListWorkwavesComponent} from "./list/list-title/list-title.component";
import {SubtitleListWorkwavesComponent} from "./list/list-subtitle/list-subtitle.component";
import {WorkwaveListWorkwavesComponent} from "./list/list-workwave/list-workwave.component";
import {StoreComponent} from "./store/store.component";
import {NgxMaterialTimepickerModule} from "ngx-material-timepicker";

@NgModule({
  declarations: [WorkwavesComponent, ListWorkwavesComponent, TitleListWorkwavesComponent, SubtitleListWorkwavesComponent, WorkwaveListWorkwavesComponent, StoreComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    WorkwavesRoutingModule,
    CommonUiCrudModule,
    CdkTableModule,
    MatGridListModule,
    FormsModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule
  ],
  entryComponents: [ListWorkwavesComponent, TitleListWorkwavesComponent, SubtitleListWorkwavesComponent, WorkwaveListWorkwavesComponent, StoreComponent]
})
export class WorkwavesModule {}
