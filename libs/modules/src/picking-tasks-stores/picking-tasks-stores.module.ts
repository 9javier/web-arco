import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule, MatCheckboxModule, MatGridListModule, MatRadioModule, MatExpansionModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { PickingTasksStoresRoutingModule } from "./picking-tasks-stores-routing.module";
import { PickingTasksStoresComponent } from "./picking-tasks-stores.component";
import { CommonUiCrudModule } from '@suite/common/ui/crud';
import {ListPickingTasksTemplateComponent} from "./list/list.component";
import {PickingTaskTemplateComponent} from "./list/list-items/list-items.component";
import {ListStoresPickingTasksTemplateComponent} from "./list-stores/list-stores.component";
import {StoresPickingTaskTemplateComponent} from "./list-stores/list-stores-items/list-stores-items.component";
import {StoresPickingTaskInitiatedTemplateComponent} from "./list-stores/list-stores-initiated/list-stores-initiated.component";
import {PopoverListStoresComponent} from "./list/list-items/popover-list-stores/popover-list-stores.component";
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [PickingTasksStoresComponent, ListPickingTasksTemplateComponent, PickingTaskTemplateComponent, ListStoresPickingTasksTemplateComponent, StoresPickingTaskTemplateComponent, StoresPickingTaskInitiatedTemplateComponent, PopoverListStoresComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    PickingTasksStoresRoutingModule,
    CommonUiCrudModule,
    CdkTableModule,
    FormsModule,
    MatGridListModule,
    MatExpansionModule,
    MatRadioModule,
    MatTooltipModule
  ],
  entryComponents: [
    ListPickingTasksTemplateComponent, PickingTaskTemplateComponent, ListStoresPickingTasksTemplateComponent, StoresPickingTaskTemplateComponent, StoresPickingTaskInitiatedTemplateComponent, PopoverListStoresComponent
  ]
})
export class PickingTasksStoresModule {}
