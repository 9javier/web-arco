import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FilterPopoverProvider} from "../../../../services/src/providers/filter-popover/filter-popover.provider";
import {PopoverController} from "@ionic/angular";

@Component({
  selector: 'suite-filter-popover',
  templateUrl: './filter-popover.component.html',
  styleUrls: ['./filter-popover.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FilterPopoverComponent implements OnInit {

  public title: string = '';
  public listItems: Array<any> = new Array<any>();
  private listItemsFinal: Array<any> = new Array<any>();
  public typedFilter: string = "";

  constructor(
    private popoverCtrl: PopoverController,
    private filterPopoverProvider: FilterPopoverProvider
  ) { }

  ngOnInit() {
    this.title = this.filterPopoverProvider.title;
    this.listItems = this.filterPopoverProvider.listItems;
    this.listItemsFinal = this.filterPopoverProvider.listItems;
  }

  searchInFilterList(event: any) {
    let textSearched = event;
    if (textSearched && textSearched != '') {
      let arrayToFilter = this.listItemsFinal;
      this.listItems = arrayToFilter.filter((item) => {
        if (typeof item.value == 'string') {
          return item.value.toLowerCase().indexOf(textSearched.toLowerCase()) != -1;
        } else {
          return item.value.toString().toLowerCase().indexOf(textSearched.toLowerCase()) != -1;
        }
      });
    } else {
      this.listItems = this.listItemsFinal;
    }
  }

  resetFilters() {
    for (let iFilter in this.listItems) {
      this.listItems[iFilter].checked = true;
    }
  }

  applyFilters() {
    if (this.listItemsFinal && this.listItemsFinal.length > 0) {
      this.popoverCtrl.dismiss({ filters: this.listItemsFinal });
    } else {
      this.popoverCtrl.dismiss();
    }
  }

}
