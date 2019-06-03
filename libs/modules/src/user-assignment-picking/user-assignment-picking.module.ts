import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  MatTableModule,
  MatCheckboxModule,
  MatGridListModule,
  MatRadioModule
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { UserAssignmentPickingRoutingModule } from "./user-assignment-picking-routing.module";
import { UserAssignmentPickingComponent } from "./user-assignment-picking.component";
import { CommonUiCrudModule } from '@suite/common/ui/crud';
import {ListUserAssignmentTemplateComponent} from "./list/list.component";
import {UserAssignmentTemplateComponent} from "./list/list-items/list-items.component";

@NgModule({
  declarations: [UserAssignmentPickingComponent, ListUserAssignmentTemplateComponent, UserAssignmentTemplateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    UserAssignmentPickingRoutingModule,
    CommonUiCrudModule,
    CdkTableModule,
    FormsModule,
    MatGridListModule,
    MatRadioModule
  ],
  entryComponents: [
    ListUserAssignmentTemplateComponent, UserAssignmentTemplateComponent
  ]
})
export class UserAssignmentPickingModule {}
