import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MatTableModule, MatCheckboxModule, MatGridListModule, MatRadioModule} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { WorkwavesHistoryRoutingModule } from "./workwaves-history-routing.module";
import { WorkwavesHistoryComponent } from "./workwaves-history.component";
import { CommonUiCrudModule } from '@suite/common/ui/crud';
import {ListWorkwavesHistoryComponent} from "./list/list.component";
import {TitleListWorkwavesHistoryComponent} from "./list/list-title/list-title.component";
import {WorkwaveListWorkwavesHistoryComponent} from "./list/list-workwave/list-workwave.component";
import {ListDetailHistoryComponent} from "./list-detail/list-detail.component";
import {TitleDetailHistoryComponent} from "./list-detail/title/title.component";
import {DetailHistoryComponent} from "./list-detail/detail/detail.component";

@NgModule({
  declarations: [WorkwavesHistoryComponent, ListWorkwavesHistoryComponent, TitleListWorkwavesHistoryComponent, WorkwaveListWorkwavesHistoryComponent, ListDetailHistoryComponent, TitleDetailHistoryComponent, DetailHistoryComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    WorkwavesHistoryRoutingModule,
    CommonUiCrudModule,
    CdkTableModule,
    MatGridListModule,
    FormsModule,
    MatRadioModule
  ],
  entryComponents: [ListWorkwavesHistoryComponent, TitleListWorkwavesHistoryComponent, WorkwaveListWorkwavesHistoryComponent, ListDetailHistoryComponent, TitleDetailHistoryComponent, DetailHistoryComponent]
})
export class WorkwavesHistoryModule {}