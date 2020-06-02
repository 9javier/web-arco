import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategorizeProductsComponent } from './categorize-products.component';
import {IonicModule} from "@ionic/angular";
import {MatTableModule} from "@angular/material";

@NgModule({
  declarations: [CategorizeProductsComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatTableModule,
  ],
  entryComponents: [CategorizeProductsComponent]
})
export class CategorizeProductsModule {}
