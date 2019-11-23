import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ScannerManualComponent } from './scanner-manual.component';
import {MatCheckboxModule, MatGridListModule, MatTableModule} from "@angular/material";
import {CdkTableModule} from "@angular/cdk/table";

@NgModule({
  declarations: [ScannerManualComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    CdkTableModule,
    FormsModule,
    MatGridListModule
  ],
  exports: [ScannerManualComponent]
})

export class ScannerManualModule {}