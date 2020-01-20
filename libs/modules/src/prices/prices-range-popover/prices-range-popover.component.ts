import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {PricesRangePopoverProvider} from "../../../../services/src/providers/prices-range-popover/prices-range-popover.provider";

@Component({
  selector: 'prices-range-popover',
  templateUrl: './prices-range-popover.component.html',
  styleUrls: ['./prices-range-popover.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PricesRangePopoverComponent implements OnInit {

  public filterType: string = '';
  public title: string = '';
  public listItems: Array<any> = new Array<any>();

  constructor(
    public pricesRangePopover: PricesRangePopoverProvider
  ) { }

  ngOnInit(): void {

  }

  rangeChange(ev) {
    this.pricesRangePopover.minValueSelected = ev.detail.value.lower;
    this.pricesRangePopover.maxValueSelected = ev.detail.value.upper;
  }
}
