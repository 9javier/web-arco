import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EanScannerComponent } from './ean-scanner.component';
import {ScannerManualModule} from "@suite/common-modules";

@NgModule({
  declarations: [EanScannerComponent],
  entryComponents: [EanScannerComponent],
  imports: [
    CommonModule,
    IonicModule,
    ScannerManualModule
  ]
})

export class EanScannerModule {}
