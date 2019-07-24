import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CdkTableModule } from '@angular/cdk/table';
import { PrintRelabelPackingRoutingModule } from "./print-relabel-packing-routing.module";
import { PrintRelabelPackingComponent } from "./print-relabel-packing.component";
import { CommonUiCrudModule } from '@suite/common/ui/crud';
import {ListPackingRelabelTemplateComponent} from "./list-packing/list-packing.component";
import {MatGridListModule} from "@angular/material";
import {PackingRelabelTemplateComponent} from "./list-packing/list-items/list-items.component";

@NgModule({
  declarations: [
    PrintRelabelPackingComponent,
    ListPackingRelabelTemplateComponent,
    PackingRelabelTemplateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    PrintRelabelPackingRoutingModule,
    CommonUiCrudModule,
    CdkTableModule,
    FormsModule,
    MatGridListModule
  ],
  entryComponents: [
    ListPackingRelabelTemplateComponent,
    PackingRelabelTemplateComponent
  ]
})
export class PrintRelabelPackingModule {}
