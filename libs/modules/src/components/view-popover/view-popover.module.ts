import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewPopoverComponent } from './view-popover.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule, MatInputModule, MatTooltipModule} from "@angular/material";
@NgModule({
  entryComponents:[ ViewPopoverComponent ],
  declarations: [ ViewPopoverComponent ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ],
  exports:[ ViewPopoverComponent ]
})
export class ViewPopoverModule { }
