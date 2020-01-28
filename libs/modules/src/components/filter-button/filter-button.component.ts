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
  @Input() listItems: Array<any> = [];
  @Input() isFiltering: boolean;
  @Input() filterType: string = 'search';
  @Input() customFiltersLoad: boolean = false;
  @Output() applyFilters = new EventEmitter();
  @Output() clickedToOpenPopover = new EventEmitter();

  tooltipHaveValues: string = null;

  constructor(
    private popoverController: PopoverController,
    private filterPopoverProvider: FilterPopoverProvider
  ) { }

  ngOnInit() {}

  clickFilterPopover(ev: any) {
    ev.stopPropagation();
    ev.preventDefault();
    if (this.customFiltersLoad) {
      this.clickedToOpenPopover.next(ev);
    } else {
      this.openFilterPopover(ev, null);
    }
  }

  public async openFilterPopover(ev: any, typedValue) {
    this.filterPopoverProvider.title = this.title;
    this.filterPopoverProvider.listItems = JSON.parse(JSON.stringify(this.listItems));
    this.filterPopoverProvider.filterType  = this.filterType;

    const popover = await this.popoverController.create({
      cssClass: 'popover-filter',
      component: FilterPopoverComponent,
      event: ev,
      componentProps: { typedValue }
    });

    popover.onDidDismiss().then((data) => {
      if (data && data.data && data.data.filters) {
        this.applyFilters.next({filters: data.data.filters, typedFilter: data.data.typedFilter});
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
