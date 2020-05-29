import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsRegisterComponent } from './details-register.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule, MatTooltipModule } from '@angular/material';
import { SignatureComponent } from '../../signature/signature.component';
import { SignatureModule } from '../../signature/signature.module';
import { SelectScrollbarComponent } from './select-scrollbar/select-scrollbar.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [DetailsRegisterComponent, SelectScrollbarComponent],
  entryComponents: [DetailsRegisterComponent, SelectScrollbarComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    MatTooltipModule,
    MatExpansionModule,
    ScrollingModule,
  ],
  exports: [DetailsRegisterComponent]
})
export class DetailsRegisterModule { }
