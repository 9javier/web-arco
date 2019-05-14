import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule, MatCheckboxModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { GroupsRoutingModule } from './groups-routing.module';
import { GroupsComponent } from './groups.component';
import { StoreComponent } from './store/store.component';
import { UpdateComponent } from './update/update.component';
import { CommonUiCrudModule } from '@suite/common/ui/crud';
import { AssignModule } from '../assign/assign.module';

@NgModule({
  declarations: [GroupsComponent, StoreComponent, UpdateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    GroupsRoutingModule,
    CdkTableModule,
    CommonUiCrudModule,
    AssignModule
  ],
  entryComponents: [
    StoreComponent
  ]
})
export class GroupsModule {}
