import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatExpansionModule, MatTooltipModule } from '@angular/material';
import { RegistryDetailsComponent } from './registry-details.component';



@NgModule({
  declarations: [RegistryDetailsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormsModule,
    MatTooltipModule,
    MatExpansionModule
  ],
  entryComponents: [
    RegistryDetailsComponent
  ]
})
export class RegistryDetailsModule {}
