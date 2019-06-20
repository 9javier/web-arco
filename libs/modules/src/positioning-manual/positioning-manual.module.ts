import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PositioningManualComponent } from './positioning-manual.component';
import {MatCheckboxModule, MatGridListModule, MatTableModule} from "@angular/material";
import {PositioningManualRoutingModule} from "./positioning-manual-routing.module";
import {CdkTableModule} from "@angular/cdk/table";
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
    CdkTableModule,
    FormsModule,
    MatGridListModule
  ],
  entryComponents: [PositioningManualComponent, TextareaComponent]
})
export class PositioningManualModule {}
