import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TransferPackingComponent } from './transfer-packing.component';
import {TransferPackingRoutingModule} from "./transfer-packing-routing.module";
import {CdkTableModule} from "@angular/cdk/table";
import {InputCodesComponent} from "./input-codes/input-codes.component";
import { HideKeyboardModule } from 'hide-keyboard';

@NgModule({
  declarations: [TransferPackingComponent, InputCodesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    TransferPackingRoutingModule,
    CdkTableModule,
    FormsModule,
    HideKeyboardModule
  ],
  entryComponents: [TransferPackingComponent, InputCodesComponent]
})
export class TransferPackingModule {}
