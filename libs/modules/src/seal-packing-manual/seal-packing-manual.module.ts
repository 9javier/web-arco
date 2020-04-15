import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SealPackingManualComponent } from './seal-packing-manual.component';
import { SealPackingManualRoutingModule } from "./seal-packing-manual-routing.module";
import { CdkTableModule } from "@angular/cdk/table";
import { InputCodesComponent } from "./input-codes/input-codes.component";
import { HideKeyboardModule } from 'hide-keyboard';
import { AddDestinyComponent} from './add-destiny/add-destiny.component';
import { MatFormFieldModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import {CommonUiCrudModule} from '@suite/common/ui/crud';

import {
  MatTableModule,
  MatCheckboxModule,
  MatPaginatorModule,
  MatListModule,
  MatTooltipModule
} from '@angular/material';

@NgModule({
  declarations: [SealPackingManualComponent, InputCodesComponent,AddDestinyComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    SealPackingManualRoutingModule,
    CdkTableModule,
    FormsModule,
    HideKeyboardModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatListModule,
    MatPaginatorModule,
    MatTableModule,
    MatCheckboxModule,
    MatSelectModule,
    CommonUiCrudModule

     ],
  entryComponents: [SealPackingManualComponent, InputCodesComponent, AddDestinyComponent
  ]
})
export class SealPackingManualModule { }
