import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule, MatCheckboxModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { StoreComponent } from './store/store.component';
import { UpdateComponent } from './update/update.component';
import { CommonUiCrudModule } from '@suite/common/ui/crud';
import {AssignModule} from "../assign/assign.module";
import { BreadcrumbModule} from '@suite/common-modules';

@NgModule({
  declarations: [RolesComponent, StoreComponent, UpdateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    RolesRoutingModule,
    CdkTableModule,
    CommonUiCrudModule,
    AssignModule,
    BreadcrumbModule
  ],
  entryComponents: [
    StoreComponent
  ]
})
export class RolesModule {}
