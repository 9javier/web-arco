import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PrintPricesManualComponent } from './print-prices-manual.component';
import { PrintPricesManualRoutingModule } from "./print-prices-manual-routing.module";
import { CdkTableModule } from "@angular/cdk/table";
import { InputCodesComponent } from "./input-codes/input-codes.component";
import { HideKeyboardModule } from 'hide-keyboard';

@NgModule({
  declarations: [PrintPricesManualComponent, InputCodesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    PrintPricesManualRoutingModule,
    CdkTableModule,
    FormsModule,
    HideKeyboardModule
  ],
  entryComponents: [PrintPricesManualComponent, InputCodesComponent]
})
export class PrintPricesManualModule { }
