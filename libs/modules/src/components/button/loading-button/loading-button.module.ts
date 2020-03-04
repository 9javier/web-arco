import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingButtonComponent } from './loading-button.component';
import {IonicModule} from "@ionic/angular";
import {MatButtonModule, MatIconModule, MatTooltipModule} from "@angular/material";

@NgModule({
  declarations: [ LoadingButtonComponent ],
  imports: [
    IonicModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  exports: [ LoadingButtonComponent ]
})

export class LoadingButtonModule { }
