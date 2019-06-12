import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsComponent } from './utils/utils.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { ResponsiveLayoutModule } from './responsive-layout/responsive-layout.module';
import { BreadcrumbModule } from './breadcrumb/breadcrumb.module';
import { MenuComponent } from './menu/menu.component';

@NgModule({
  declarations: [UtilsComponent, DropdownComponent, MenuComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    ResponsiveLayoutModule
  ],
  exports:[UtilsComponent,DropdownComponent]
})
export class ComponentsModule { }
