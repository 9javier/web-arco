import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsComponent } from './utils/utils.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { ResponsiveLayoutModule } from './responsive-layout/responsive-layout.module';
import { BreadcrumbModule } from './breadcrumb/breadcrumb.module';

@NgModule({
  declarations: [UtilsComponent, DropdownComponent],
  imports: [
    CommonModule,
    BreadcrumbModule,
    ResponsiveLayoutModule
  ],
  exports:[UtilsComponent,DropdownComponent]
})
export class ComponentsModule { }
