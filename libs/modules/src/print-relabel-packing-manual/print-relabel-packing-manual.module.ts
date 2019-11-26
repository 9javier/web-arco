import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PrintRelabelPackingManualComponent } from './print-relabel-packing-manual.component';
import { PrintRelabelPackingManualRoutingModule } from "./print-relabel-packing-manual-routing.module";
import { CdkTableModule } from "@angular/cdk/table";
import { InputCodesComponent } from "./input-codes/input-codes.component";
import { HideKeyboardModule } from 'hide-keyboard';

@NgModule({
  declarations: [PrintRelabelPackingManualComponent, InputCodesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    PrintRelabelPackingManualRoutingModule,
    CdkTableModule,
    FormsModule,
    HideKeyboardModule
  ],
  entryComponents: [PrintRelabelPackingManualComponent, InputCodesComponent]
})
export class PrintRelabelPackingManualModule { }
