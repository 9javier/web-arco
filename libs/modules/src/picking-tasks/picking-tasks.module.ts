import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  MatTableModule,
  MatCheckboxModule,
  MatGridListModule,
  MatRadioModule, MatExpansionModule
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { PickingTasksRoutingModule } from "./picking-tasks-routing.module";
import { PickingTasksComponent } from "./picking-tasks.component";
import { CommonUiCrudModule } from '@suite/common/ui/crud';
import {ListPickingTasksTemplateComponent} from "./list/list.component";
import {PickingTaskTemplateComponent} from "./list/list-items/list-items.component";
import {ListStoresPickingTasksTemplateComponent} from "./list-stores/list-stores.component";
import {StoresPickingTaskTemplateComponent} from "./list-stores/list-stores-items/list-stores-items.component";

@NgModule({
  declarations: [PickingTasksComponent, ListPickingTasksTemplateComponent, PickingTaskTemplateComponent, ListStoresPickingTasksTemplateComponent, StoresPickingTaskTemplateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    PickingTasksRoutingModule,
    CommonUiCrudModule,
    CdkTableModule,
    FormsModule,
    MatGridListModule,
    MatExpansionModule,
    MatRadioModule
  ],
  entryComponents: [
    ListPickingTasksTemplateComponent, PickingTaskTemplateComponent, ListStoresPickingTasksTemplateComponent, StoresPickingTaskTemplateComponent
  ]
})
export class PickingTasksModule {}
