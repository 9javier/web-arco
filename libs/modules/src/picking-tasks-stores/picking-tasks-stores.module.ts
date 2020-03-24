import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule, MatCheckboxModule, MatGridListModule, MatRadioModule, MatExpansionModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { PickingTasksStoresRoutingModule } from "./picking-tasks-stores-routing.module";
import { PickingTasksStoresComponent } from "./picking-tasks-stores.component";
import { CommonUiCrudModule } from '@suite/common/ui/crud';
import {ListStoresPickingTasksTemplateComponent} from "./list-stores/list-stores.component";
import {StoresPickingTaskTemplateComponent} from "./list-stores/list-stores-items/list-stores-items.component";
import {StoresPickingTaskInitiatedTemplateComponent} from "./list-stores/list-stores-initiated/list-stores-initiated.component";
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    PickingTasksStoresComponent,
    ListStoresPickingTasksTemplateComponent,
    StoresPickingTaskTemplateComponent,
    StoresPickingTaskInitiatedTemplateComponent
  ],
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
    ListStoresPickingTasksTemplateComponent,
    StoresPickingTaskTemplateComponent,
    StoresPickingTaskInitiatedTemplateComponent
  ]
})
export class PickingTasksStoresModule {}
