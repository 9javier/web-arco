import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  MatTableModule,
  MatCheckboxModule,
  MatGridListModule,
  MatRadioModule,
  MatTooltipModule
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import {TitlePickingComponent} from "./title/title.component";
import {PickingComponent} from "./picking/picking.component";
import {ListPickingRebuildComponent} from "./list-picking-rebuild.component";
import {ListProductsComponent} from "./modal-products/modal-products.component";

@NgModule({
  declarations: [ListPickingRebuildComponent, TitlePickingComponent, PickingComponent, ListProductsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    CdkTableModule,
    MatGridListModule,
    FormsModule,
    MatRadioModule,
    MatTooltipModule
  ],
  entryComponents: [ListPickingRebuildComponent, TitlePickingComponent, PickingComponent, ListProductsComponent]
})
export class ListPickingRebuildModule {}
