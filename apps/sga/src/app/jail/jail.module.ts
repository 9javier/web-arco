import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule, MatCheckboxModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { StoreComponent } from './store/store.component';
import { UpdateComponent } from './update/update.component';
import {CommonUiCrudModule, ListComponent} from '@suite/common/ui/crud';
import { FormsModule } from '@angular/forms';
import { JailRoutingModule } from './jail-routing.module';
import { JailComponent } from './jail.component';


@NgModule({
  declarations: [JailComponent, StoreComponent, UpdateComponent],
  imports: [
    CommonModule,
    JailRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    CommonUiCrudModule,
    CdkTableModule,
  ], entryComponents: [
    StoreComponent
  ]
})
export class JailModule { }
