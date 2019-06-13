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
import { CommonUiCrudModule } from '../../../common/ui/crud/src/lib/common-ui-crud.module';
import {AssignModule} from "../assign/assign.module";
import { BreadcrumbModule} from '../components/breadcrumb/breadcrumb.module';

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
