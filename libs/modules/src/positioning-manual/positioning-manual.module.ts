import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PositioningManualComponent } from './positioning-manual.component';
import {MatCheckboxModule, MatGridListModule, MatTableModule} from "@angular/material";
import {PositioningManualRoutingModule} from "./positioning-manual-routing.module";
import {CommonUiCrudModule} from "@suite/common/ui/crud";
import {CdkTableModule} from "@angular/cdk/table";
import {BreadcrumbModule} from "@suite/common-modules";
import {TextareaComponent} from "./textarea/textarea.component";

@NgModule({
  declarations: [PositioningManualComponent, TextareaComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    PositioningManualRoutingModule,
    CommonUiCrudModule,
    CdkTableModule,
    FormsModule,
    BreadcrumbModule,
    MatGridListModule
  ],
  entryComponents: [PositioningManualComponent, TextareaComponent]
})
export class PositioningManualModule {}
