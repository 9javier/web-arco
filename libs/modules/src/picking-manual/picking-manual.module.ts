import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PickingManualComponent } from './picking-manual.component';
import { MatCheckboxModule, MatGridListModule, MatTableModule } from "@angular/material";
import { PickingManualRoutingModule } from "./picking-manual-routing.module";
import { CdkTableModule } from "@angular/cdk/table";
import { TextareaComponent } from "./textarea/textarea.component";
import { HideKeyboardModule } from 'hide-keyboard';


@NgModule({
  declarations: [PickingManualComponent, TextareaComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatTableModule,
    MatCheckboxModule,
    PickingManualRoutingModule,
    CdkTableModule,
    FormsModule,
    MatGridListModule,
    HideKeyboardModule
  ],
  entryComponents: [PickingManualComponent, TextareaComponent]
})
export class PickingManualModule { }
