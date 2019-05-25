import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsComponent } from './utils/utils.component';
import { DropdownComponent } from './dropdown/dropdown.component';

@NgModule({
  declarations: [UtilsComponent, DropdownComponent],
  imports: [
    CommonModule,
  ],
  exports:[UtilsComponent,DropdownComponent]
})
export class ComponentsModule { }
