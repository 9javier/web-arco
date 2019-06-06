import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from './breadcrumb.component';
import { RouterModule } from '@angular/router';
import { ResponsiveLayoutModule } from '../responsive-layout/responsive-layout.module';

@NgModule({
  declarations: [BreadcrumbComponent],
  imports: [
    RouterModule,
    CommonModule,
    ResponsiveLayoutModule
  ],
  entryComponents:[BreadcrumbComponent],
  exports:[BreadcrumbComponent]
})
export class BreadcrumbModule { }
