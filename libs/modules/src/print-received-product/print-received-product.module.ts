import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PrintReceivedProductComponent } from './print-received-product.component';
import {PrintReceivedProductRoutingModule} from "./print-received-product-routing.module";
import {CdkTableModule} from "@angular/cdk/table";
import {ListReceivedProductTemplateComponent} from "./list/list.component";
import {ReceivedProductTemplateComponent} from "./list/list-items/list-items.component";
import {MatExpansionModule, MatGridListModule} from "@angular/material";

@NgModule({
  declarations: [PrintReceivedProductComponent, ListReceivedProductTemplateComponent, ReceivedProductTemplateComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    PrintReceivedProductRoutingModule,
    CdkTableModule,
    FormsModule,
    MatExpansionModule,
    MatGridListModule
  ],
  entryComponents: [PrintReceivedProductComponent, ListReceivedProductTemplateComponent, ReceivedProductTemplateComponent]
})
export class PrintReceivedProductModule {}
