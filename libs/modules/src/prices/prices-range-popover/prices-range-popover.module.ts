import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PricesRangePopoverComponent } from './prices-range-popover.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  entryComponents:[ PricesRangePopoverComponent ],
  declarations: [ PricesRangePopoverComponent ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports:[ PricesRangePopoverComponent ]
})
export class PricesRangePopoverModule { }
