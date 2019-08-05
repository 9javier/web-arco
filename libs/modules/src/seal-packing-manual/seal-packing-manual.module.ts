import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SealPackingManualComponent } from './seal-packing-manual.component';
import {SealPackingManualRoutingModule} from "./seal-packing-manual-routing.module";
import {CdkTableModule} from "@angular/cdk/table";
import {InputCodesComponent} from "./input-codes/input-codes.component";

@NgModule({
  declarations: [SealPackingManualComponent, InputCodesComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    SealPackingManualRoutingModule,
    CdkTableModule,
    FormsModule
  ],
  entryComponents: [SealPackingManualComponent, InputCodesComponent]
})
export class SealPackingManualModule {}
