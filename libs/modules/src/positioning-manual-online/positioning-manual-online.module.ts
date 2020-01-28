import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PositioningManualOnlineComponent } from './positioning-manual-online.component';
import { MatCheckboxModule, MatGridListModule, MatTableModule } from "@angular/material";
import { PositioningManualOnlineRoutingModule } from "./positioning-manual-online-routing.module";
import { CdkTableModule } from "@angular/cdk/table";
import { TextareaComponent } from "./textarea/textarea.component";
import { HideKeyboardModule } from 'hide-keyboard';
import { ListasProductosComponent } from '../picking-manual/lista/listas-productos/listas-productos.component';
import { ListaModule } from '../picking-manual/lista/lista.module';
import { ListProductsCarrierModule } from '../components/list-products-carrier/list-products-carrier.module';
import { ListProductsCarrierComponent } from '../components/list-products-carrier/list-products-carrier.component';

@NgModule({
  declarations: [PositioningManualOnlineComponent, TextareaComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    PositioningManualOnlineRoutingModule,
    CdkTableModule,
    FormsModule,
    MatGridListModule,
    HideKeyboardModule,
    ListaModule,
    ListProductsCarrierModule
  ],
  entryComponents: [PositioningManualOnlineComponent, TextareaComponent, ListasProductosComponent, ListProductsCarrierComponent]
})
export class PositioningManualOnlineModule { }