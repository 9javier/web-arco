import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsiveLayoutComponent } from './responsive-layout.component';
@NgModule({
  entryComponents:[ResponsiveLayoutComponent],
  declarations: [ResponsiveLayoutComponent],
  imports: [
    CommonModule
  ],
  exports:[ResponsiveLayoutComponent]
})
export class ResponsiveLayoutModule { }
