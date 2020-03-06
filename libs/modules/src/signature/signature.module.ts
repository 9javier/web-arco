import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SignatureRoutingModule } from './signature-routing.module';
import { SignatureComponent } from './signature.component';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  declarations: [SignatureComponent],
  imports: [
    CommonModule,
    SignatureRoutingModule,
    SignaturePadModule
  ],
  exports: [SignatureComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SignatureModule { }
