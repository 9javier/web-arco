import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatTableModule, MatCheckboxModule, MatPaginatorModule, MatListModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import {CommonUiCrudModule} from '@suite/common/ui/crud';
import { BreadcrumbModule } from '../../../modules/src/components/breadcrumb/breadcrumb.module';
import { MatFormFieldModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { SendPackingComponent } from './send-packing/send-packing.component';
import { SendEmptyPackingComponent } from './send-empty-packing.component';
import { SendEmptyPackingRoutingModule } from './send-empty-packing-routing.module';
import { SendPackingManualComponent } from './send-packing-manual/send-packing-manual.component';
import { InputCodesComponent } from './input-codes/input-codes.component';

@NgModule({
  declarations: [SendEmptyPackingComponent, SendPackingComponent, SendPackingManualComponent, InputCodesComponent],
  imports: [
    SendEmptyPackingRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    CommonUiCrudModule,
    CdkTableModule,
    MatPaginatorModule,
    MatListModule,
    FormsModule,
    BreadcrumbModule,
    MatFormFieldModule,
    MatSelectModule
  ], entryComponents: [
    SendPackingComponent,
    SendPackingManualComponent,
    InputCodesComponent
  ]
})
export class SendEmptyPackingModule { }