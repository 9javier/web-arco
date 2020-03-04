import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'suite-filter-items-list',
  templateUrl: './filter-items-list.component.html',
  styleUrls: ['./filter-items-list.component.scss']
})
export class FilterItemsListComponent implements OnInit {

  public filterListType: string = '';
  public listItems: {id: number, name: string, color: string}[] = [];
  public searchText: string = null;

  private originaListItems = [];

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.originaListItems = JSON.parse(JSON.stringify(this.listItems.sort((a, b) => a.name.trim().localeCompare(b.name.trim()))));
  }

  public close() {
    this.modalController.dismiss();
  }

  public selectItem(itemSelected) {
    this.modalController.dismiss({filterListType: this.filterListType, itemSelected});
  }

  public changeSearchData() {
    if (this.searchText) {
      this.listItems = this.originaListItems.filter(i => {
        return i.name.toUpperCase().includes(this.searchText.toUpperCase());
      });
    } else {
      this.listItems = JSON.parse(JSON.stringify(this.originaListItems));
    }
  }

  public resetSearchBar() {
    this.searchText = null;
    this.changeSearchData();
  }
}
