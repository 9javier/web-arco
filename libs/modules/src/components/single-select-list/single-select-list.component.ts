import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'single-select-list',
  templateUrl: './single-select-list.component.html',
  styleUrls: ['./single-select-list.component.scss']
})
export class SingleSelectListComponent implements OnInit {

  @Input() filterListValue: string = '';
  @Input() listItems: any[] = [];
  @Output() closeList = new EventEmitter();

  public searchText: string = null;
  public originalListItems: any[] = [];

  constructor() {}

  ngOnInit() {
    this.originalListItems = this.clone(this.listItems.sort((a, b) => a.value.trim().localeCompare(b.value.trim())));
  }

  public changeSearchData() {
    if (this.searchText) {
      this.listItems = this.clone(this.originalListItems.filter(i => {
        return i.value.toUpperCase().includes(this.searchText.toUpperCase());
      }));
    } else {
      this.listItems = this.clone(this.originalListItems);
    }
  }

  public resetSearchBar() {
    this.searchText = null;
    this.changeSearchData();
  }

  public close() {
    this.closeList.next();
  }

  public selectItem(item: any) {
    this.closeList.next(item.id);
  }

  private clone(toClone: any) {
    return JSON.parse(JSON.stringify(toClone));
  }
}
