import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverMenuToolbarComponent } from './popover-menu-toolbar.component';
import {IonicModule} from "@ionic/angular";

@NgModule({
  entryComponents:[ PopoverMenuToolbarComponent ],
  declarations: [ PopoverMenuToolbarComponent ],
  imports: [
    IonicModule,
    CommonModule
  ],
  exports: [ PopoverMenuToolbarComponent ]
})

export class PopoverMenuToolbarModule { }
