import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'suite-filter-items-list',
  templateUrl: './filter-items-list.component.html',
  styleUrls: ['./filter-items-list.component.scss']
})
export class FilterItemsListComponent implements OnInit {

  public filterListType: string = '';
  public listItems: {id: number, name: string}[] = [];

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {

  }

  public close() {
    this.modalController.dismiss();
  }

  public selectItem(itemSelected) {
    this.modalController.dismiss({filterListType: this.filterListType, itemSelected});
  }
}
