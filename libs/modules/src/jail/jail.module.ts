import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule, MatCheckboxModule, MatPaginatorModule, MatListModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { JailRoutingModule } from './jail-routing.module';
import { JailComponent } from './jail.component';
import { StoreComponent } from './store/store.component';
import { UpdateComponent } from './update/update.component';
import {CommonUiCrudModule} from '@suite/common/ui/crud';
import { DataModule } from './data/data.module';
import { BreadcrumbModule } from '../../../modules/src/components/breadcrumb/breadcrumb.module';
import { SendComponent } from './send/send.component';
import { MatFormFieldModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { SendPackingComponent } from './send-packing/send-packing.component';

@NgModule({
  declarations: [JailComponent, StoreComponent, UpdateComponent, SendComponent, SendPackingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    JailRoutingModule,
    CommonUiCrudModule,
    CdkTableModule,
    DataModule,
    MatPaginatorModule,
    MatListModule,
    FormsModule,
    BreadcrumbModule,
    MatFormFieldModule,
    MatSelectModule
  ], entryComponents: [
    StoreComponent,
    SendComponent,
    SendPackingComponent
  ]
})
export class JailModule { }
