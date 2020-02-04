import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MatBadgeModule } from '@angular/material';
import { MatTooltipModule } from "@angular/material";
@NgModule({
  entryComponents:[MenuComponent],
  declarations: [MenuComponent],
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
