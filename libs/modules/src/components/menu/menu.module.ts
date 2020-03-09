import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MatBadgeModule } from '@angular/material';
import { MatTooltipModule } from "@angular/material";
import {AlertPopoverComponent} from "../alert-popover/alert-popover.component";
@NgModule({
  entryComponents:[MenuComponent, AlertPopoverComponent],
  declarations: [MenuComponent, AlertPopoverComponent],
  imports: [
    CommonModule,
    IonicModule,
    MatBadgeModule,
    RouterModule,
    MatTooltipModule
  ],
  exports:[MenuComponent]
})
export class MenuModule { }
