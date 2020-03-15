import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncidentsRoutingModule } from './incidents-routing.module';
import { IncidentsComponent } from './incidents.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PhotoModalComponent } from './components/photo-modal/photo-modal.component';
import { ScannerManualModule } from '../components/scanner-manual/scanner-manual.module';
import { InputCodesComponent } from './components/input-codes/input-codes.component';
import { HideKeyboardModule } from 'hide-keyboard';
import { CdkTableModule } from '@angular/cdk/table';
import { SignatureComponent } from '../signature/signature.component';
import { SignatureModule } from '../signature/signature.module';
import { DropFilesModule } from '../drop-files/drop-files.module';
import { ReviewImagesComponent } from './components/review-images/review-images.component';
import { VirtualKeyboardModule } from '../components/virtual-keyboard/virtual-keyboard.module';

@NgModule({
  declarations: [IncidentsComponent, PhotoModalComponent, InputCodesComponent,],
  entryComponents: [IncidentsComponent, PhotoModalComponent],
  imports: [
    CommonModule,
    IncidentsRoutingModule,
    ReactiveFormsModule,
    IonicModule,
    FormsModule,
    ScannerManualModule,
    HideKeyboardModule,
    CdkTableModule,
    SignatureModule,
    DropFilesModule,
    
  ],
  exports: [
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IncidentsModule { }
