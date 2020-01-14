import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TransferVentilationComponent } from './transfer-ventilation.component';
import {TransferVentilationRoutingModule} from "./transfer-ventilation-routing.module";
import {CdkTableModule} from "@angular/cdk/table";
import {InputCodesComponent} from "./input-codes/input-codes.component";
import { MatTableModule, MatCheckboxModule, MatPaginatorModule, MatListModule } from '@angular/material';
import {CommonUiCrudModule} from "@suite/common/ui/crud";
import {DataModule} from "../jail/data/data.module";
import {BreadcrumbModule} from "../components/breadcrumb/breadcrumb.module";
import { MatFormFieldModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [TransferVentilationComponent, InputCodesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    TransferVentilationRoutingModule,
    CdkTableModule,
    FormsModule,
    MatTableModule,
    MatCheckboxModule,
    CommonUiCrudModule,
    DataModule,
    MatPaginatorModule,
    MatListModule,
    BreadcrumbModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  entryComponents: [TransferVentilationComponent, InputCodesComponent]
})
export class TransferVentilationModule {}
