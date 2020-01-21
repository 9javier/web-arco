import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProductDetailsComponent } from './product-details.component';
import { MatTooltipModule } from '@angular/material';



@NgModule({
  declarations: [ProductDetailsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FormsModule,
    MatTooltipModule
  ],
  entryComponents: [
    ProductDetailsComponent
  ]
})
export class ProductDetailsModule {}
