import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PopoverController} from "@ionic/angular";
import {FilterPopoverComponent} from "../filter-popover/filter-popover.component";
import {FilterPopoverProvider} from "../../../../services/src/providers/filter-popover/filter-popover.provider";

@Component({
  selector: 'suite-filter-button',
  templateUrl: './filter-button.component.html',
  styleUrls: ['./filter-button.component.scss']
})
export class FilterButtonComponent implements OnInit {

  @Input() title: string;
  @Input() listItems: Array<any>;
  @Input() isFiltering: boolean;
  @Input() filterType: string = 'search';
  @Output() applyFilters = new EventEmitter();

  tooltipHaveValues: string = null;

  constructor(
    private popoverController: PopoverController,
    private filterPopoverProvider: FilterPopoverProvider
  ) { }

  ngOnInit() {}

  async openFilterPopover(ev: any) {
    this.filterPopoverProvider.title = this.title;
    this.filterPopoverProvider.listItems = JSON.parse(JSON.stringify(this.listItems));
    this.filterPopoverProvider.filterType  = this.filterType;

    const popover = await this.popoverController.create({
      cssClass: 'popover-filter',
      component: FilterPopoverComponent,
      event: ev
    });

    popover.onDidDismiss().then((data) => {
      if (data && data.data && data.data.filters) {
        this.applyFilters.next(data.data.filters);
        this.listItems = data.data.filters;
        this.filterPopoverProvider.listItems = JSON.parse(JSON.stringify(this.listItems));
      } else {
        this.filterPopoverProvider.listItems = this.listItems;
      }
    });

    await popover.present();
  }

  showFiltersActive() {
    let itemsFiltered = this.listItems.filter(item => item.checked);
    if (itemsFiltered.length != this.listItems.length) {
      this.tooltipHaveValues  = itemsFiltered.map(item => item.value).join(', ');
    } else {
      this.tooltipHaveValues = null;
    }
  }

}
