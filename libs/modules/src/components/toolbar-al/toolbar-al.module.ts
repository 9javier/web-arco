import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarAlComponent } from './toolbar-al.component';
import {IonicModule} from "@ionic/angular";
import {PopoverMenuToolbarModule} from "../popover-menu-toolbar/popover-menu-toolbar.module";

@NgModule({
  declarations: [ ToolbarAlComponent ],
  imports: [
    IonicModule,
    CommonModule,
    PopoverMenuToolbarModule
  ],
  exports: [ ToolbarAlComponent ]
})

export class ToolbarAlModule { }
