import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefectsSgaRoutingModule } from './defects-sga-routing.module';
import { DefectsSgaComponent } from './defects-sga.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PhotoModalComponent } from './components/photo-modal/photo-modal.component';
import { ScannerManualModule } from '../components/scanner-manual/scanner-manual.module';
import { InputCodesComponent } from './components/input-codes/input-codes.component';
import { HideKeyboardModule } from 'hide-keyboard';
import { CdkTableModule } from '@angular/cdk/table';
import { SignatureComponent } from '../signature/signature.component';
import { SignatureModule } from '../signature/signature.module';
import { ReviewImagesComponent } from './components/review-images/review-images.component';

@NgModule({
  declarations: [DefectsSgaComponent, PhotoModalComponent, InputCodesComponent, ReviewImagesComponent,],
  entryComponents: [DefectsSgaComponent, PhotoModalComponent, ReviewImagesComponent],
  imports: [
    CommonModule,
    DefectsSgaRoutingModule,
    ReactiveFormsModule,
    IonicModule,
    FormsModule,
    ScannerManualModule,
    HideKeyboardModule,
    CdkTableModule,
    SignatureModule
  ],
  exports: [
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DefectsSgaModule { }
