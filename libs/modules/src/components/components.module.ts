import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsComponent } from './utils/utils.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { BreadcrumbModule } from './breadcrumb/breadcrumb.module';

@NgModule({
  declarations: [UtilsComponent, DropdownComponent],
  imports: [
    CommonModule,
    BreadcrumbModule
  ],
  exports:[UtilsComponent,DropdownComponent]
})
export class ComponentsModule { }
