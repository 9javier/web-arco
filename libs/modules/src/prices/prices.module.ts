import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricesComponent } from './prices.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { MatListModule, MatTableModule, MatPaginatorModule, MatExpansionModule, MatSlideToggleModule } from '@angular/material';
import { BreadcrumbModule } from '../components/breadcrumb/breadcrumb.module';
import { RouterModule, Routes } from '@angular/router';
import { ResponsiveLayoutModule } from '../components/responsive-layout/responsive-layout.module';
import { TagsInputModule } from '../components/tags-input/tags-input.module';
import { PaginatorComponentModule } from '../components/paginator/paginator.component.module';
import { PricesRangePopoverModule } from "./prices-range-popover/prices-range-popover.module";
import { SliderComponent } from './components/slider/slider.component';
import { MatTooltipModule } from "@angular/material";

const routes: Routes = [
  {
    path: '',
    component: PricesComponent
  }
];

@NgModule({
  declarations: [PricesComponent, SliderComponent],
  entryComponents: [SliderComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    BreadcrumbModule,
    RouterModule.forChild(routes),
    ResponsiveLayoutModule,
    MatExpansionModule,
    MatSlideToggleModule,
    TagsInputModule,
    PaginatorComponentModule,
    PricesRangePopoverModule,
    MatTooltipModule,
  ]
})
export class PricesModule { }
