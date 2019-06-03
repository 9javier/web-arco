import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ScannerConfigurationComponent } from "./scanner-configuration.component";

@NgModule({
  declarations: [ScannerConfigurationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule
  ], entryComponents: [ScannerConfigurationComponent]
})
export class ScannerConfigurationModule { }
