import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PickingManualComponent } from './picking-manual.component';
import {MatCheckboxModule, MatGridListModule, MatTableModule} from "@angular/material";
import {PickingManualRoutingModule} from "./picking-manual-routing.module";
import {CommonUiCrudModule} from "@suite/common/ui/crud";
import {CdkTableModule} from "@angular/cdk/table";
import {BreadcrumbModule} from "@suite/common-modules";
import {TextareaComponent} from "./textarea/textarea.component";

@NgModule({
  declarations: [PickingManualComponent, TextareaComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    PickingManualRoutingModule,
    CommonUiCrudModule,
    CdkTableModule,
    FormsModule,
    BreadcrumbModule,
    MatGridListModule
  ],
  entryComponents: [PickingManualComponent, TextareaComponent]
})
export class PickingManualModule {}
