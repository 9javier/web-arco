import {Component, OnInit, ViewChild} from '@angular/core';
import {ModalController, IonInfiniteScroll} from "@ionic/angular";

@Component({
  selector: 'suite-filter-items-list',
  templateUrl: './filter-items-list.component.html',
  styleUrls: ['./filter-items-list.component.scss']
})
export class FilterItemsListComponent implements OnInit {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  public filterListType: string = '';
  public listItems: {id: number, name: string, color: string}[] = [];
  public searchText: string = null;

  private originaListItems = [];
  private paginatedListItems = [];

  private LIMIT_PAGINATION: number = 30;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.originaListItems = this.clone(this.listItems.sort((a, b) => a.name.trim().localeCompare(b.name.trim())));
    this.paginatedListItems = (this.clone(this.listItems.sort((a, b) => a.name.trim().localeCompare(b.name.trim())))).splice(0, this.LIMIT_PAGINATION);
  }

  public close() {
    this.modalController.dismiss();
  }

  public selectItem(itemSelected) {
    this.modalController.dismiss({filterListType: this.filterListType, itemSelected});
  }

  public changeSearchData() {
    this.paginatedListItems = [];
    if (this.searchText) {
      this.listItems = this.clone(this.originaListItems.filter(i => {
        return i.name.toUpperCase().includes(this.searchText.toUpperCase());
      }));
    } else {
      this.listItems = this.clone(this.originaListItems);
    }
    this.paginatedListItems = (this.clone(this.listItems)).splice(0, this.LIMIT_PAGINATION);
    this.infiniteScroll.disabled = false;
  }

  public resetSearchBar() {
    this.searchText = null;
    this.changeSearchData();
  }

  public loadData(event) {
    event.target.complete();
    this.paginatedListItems = this.paginatedListItems.concat((this.clone(this.listItems)).splice(this.paginatedListItems.length, this.LIMIT_PAGINATION));
    if (this.paginatedListItems.length == this.listItems.length) {
      event.target.disabled = true;
    }
  }

  private clone(toClone: any) {
    return JSON.parse(JSON.stringify(toClone));
  }
}
