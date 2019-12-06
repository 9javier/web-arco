import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsComponent } from './utils/utils.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { ResponsiveLayoutModule } from './responsive-layout/responsive-layout.module';
import { BreadcrumbModule } from './breadcrumb/breadcrumb.module';
import { MenuModule } from "./menu/menu.module";
import { VirtualKeyboardModule } from './virtual-keyboard/virtual-keyboard.module';

@NgModule({
  declarations: [UtilsComponent, DropdownComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    MenuModule,
    ResponsiveLayoutModule,
    VirtualKeyboardModule
  ],
  exports:[UtilsComponent,DropdownComponent]
})
export class ComponentsModule { }
