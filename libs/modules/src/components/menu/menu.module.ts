import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
@NgModule({
  entryComponents:[MenuComponent],
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  exports:[MenuComponent]
})
export class MenuModule { }
