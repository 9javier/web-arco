import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EanScannerComponent } from './ean-scanner.component';
import {ScannerManualModule} from "../../../components/scanner-manual/scanner-manual.module";
import {LoadingMessageModule} from "../../../components/loading-message/loading-message.module";

@NgModule({
  declarations: [EanScannerComponent],
  entryComponents: [EanScannerComponent],
  imports: [
    CommonModule,
    IonicModule,
    ScannerManualModule,
    LoadingMessageModule
  ],
  exports: [EanScannerComponent]
})

export class EanScannerModule {}
