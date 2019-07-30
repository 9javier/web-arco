import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PrintRelabelProductManualComponent } from './print-relabel-product-manual.component';
import {PrintRelabelProductManualRoutingModule} from "./print-relabel-product-manual-routing.module";
import {CdkTableModule} from "@angular/cdk/table";
import {InputCodesComponent} from "./input-codes/input-codes.component";

@NgModule({
  declarations: [PrintRelabelProductManualComponent, InputCodesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    PrintRelabelProductManualRoutingModule,
    CdkTableModule,
    FormsModule
  ],
  entryComponents: [PrintRelabelProductManualComponent, InputCodesComponent]
})
export class PrintRelabelProductManualModule {}
