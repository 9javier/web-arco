import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PickingReturnComponent } from './picking-return.component';
import { MatCheckboxModule, MatGridListModule, MatTableModule } from "@angular/material";
import { PickingReturnRoutingModule } from "./picking-return-routing.module";
import { CdkTableModule } from "@angular/cdk/table";
import { TextareaComponent } from "./textarea/textarea.component";
import { HideKeyboardModule } from 'hide-keyboard';
import { ListasProductosComponent } from './lista/listas-productos/listas-productos.component';
import { ListaModule } from './lista/lista.module';
import { ListProductsCarrierComponent } from '../components/list-products-carrier/list-products-carrier.component';
import { ListProductsCarrierModule } from '../components/list-products-carrier/list-products-carrier.module';
import {LoadingMessageModule} from "../components/loading-message/loading-message.module";


@NgModule({
  declarations: [PickingReturnComponent, TextareaComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    PickingReturnRoutingModule,
    CdkTableModule,
    FormsModule,
    MatGridListModule,
    HideKeyboardModule,
    ListaModule,
    ListProductsCarrierModule,
    LoadingMessageModule
  ],
  entryComponents: [PickingReturnComponent, TextareaComponent, ListProductsCarrierComponent]
})
export class PickingReturnModule { }
