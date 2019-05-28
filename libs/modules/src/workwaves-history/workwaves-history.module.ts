import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {MatTableModule, MatCheckboxModule, MatGridListModule} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { WorkwavesHistoryRoutingModule } from "./workwaves-history-routing.module";
import { WorkwavesHistoryComponent } from "./workwaves-history.component";
import { CommonUiCrudModule } from '@suite/common/ui/crud';
import {ListWorkwavesHistoryComponent} from "./list/list.component";
import {TitleListWorkwavesHistoryComponent} from "./list/list-title/list-title.component";
import {WorkwaveListWorkwavesHistoryComponent} from "./list/list-workwave/list-workwave.component";

@NgModule({
  declarations: [WorkwavesHistoryComponent, ListWorkwavesHistoryComponent, TitleListWorkwavesHistoryComponent, WorkwaveListWorkwavesHistoryComponent],
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
    FormsModule
  ],
  entryComponents: [ListWorkwavesHistoryComponent, TitleListWorkwavesHistoryComponent, WorkwaveListWorkwavesHistoryComponent]
})
export class WorkwavesHistoryModule {}
