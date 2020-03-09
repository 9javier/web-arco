import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertPopoverComponent } from './alert-popover.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule, MatInputModule, MatTooltipModule} from "@angular/material";
@NgModule({
  entryComponents:[ AlertPopoverComponent ],
  declarations: [  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule
  ],
  exports:[  ]
})
export class AlertPopoverModule {}
