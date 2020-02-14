import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PositioningManualComponent } from './positioning-manual.component';
import { MatCheckboxModule, MatGridListModule, MatTableModule } from "@angular/material";
import { PositioningManualRoutingModule } from "./positioning-manual-routing.module";
import { CdkTableModule } from "@angular/cdk/table";
import { TextareaComponent } from "./textarea/textarea.component";
import { HideKeyboardModule } from 'hide-keyboard';
import { ListaModule } from '../picking-manual/lista/lista.module';
import { ListProductsCarrierModule } from '../components/list-products-carrier/list-products-carrier.module';
import { ListProductsCarrierComponent } from '../components/list-products-carrier/list-products-carrier.component';
import {LoadingMessageModule} from "../components/loading-message/loading-message.module";

@NgModule({
  declarations: [PositioningManualComponent, TextareaComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    PositioningManualRoutingModule,
    CdkTableModule,
    FormsModule,
    MatGridListModule,
    HideKeyboardModule,
    ListaModule,
    ListProductsCarrierModule,
    LoadingMessageModule
  ],
  entryComponents: [PositioningManualComponent, TextareaComponent, ListProductsCarrierComponent]
})
export class PositioningManualModule { }
