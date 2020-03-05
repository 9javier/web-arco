import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FabExtendedComponent } from './fab-extended.component';
import {IonicModule} from "@ionic/angular";
import {MatButtonModule, MatIconModule, MatTooltipModule} from "@angular/material";

@NgModule({
  declarations: [ FabExtendedComponent ],
  imports: [
    IonicModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  exports: [ FabExtendedComponent ]
})

export class FabExtendedModule { }
