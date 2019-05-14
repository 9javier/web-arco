import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';

import { AssignRoutingModule } from './assign-routing.module';
import { RolToUserComponent } from './rol-to-user/rol-to-user.component';
import { PermissionToRolComponent } from './permission-to-rol/permission-to-rol.component';
import { GroupToWarehouseComponent } from './group-to-warehouse/group-to-warehouse.component';

@NgModule({
  declarations: [RolToUserComponent, PermissionToRolComponent, GroupToWarehouseComponent],
  imports: [
    CommonModule,
    AssignRoutingModule,
    ReactiveFormsModule,
    IonicModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatListModule
  ],
  exports: [RolToUserComponent, PermissionToRolComponent, GroupToWarehouseComponent]
})
export class AssignModule {}
