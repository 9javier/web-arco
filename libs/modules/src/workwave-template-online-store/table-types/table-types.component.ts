import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'table-types',
  templateUrl: './table-types.component.html',
  styleUrls: ['./table-types.component.scss']
})
export class TableTypesOSComponent implements OnInit {

  @Output() changeType = new EventEmitter();

  public listTypes: OrderType[] = [];

  shopSelected: boolean = false;
  onlineSelected: boolean = false;

  constructor() {}

  /*public loadListTypes(newListTypes: OrderType[], loadNewRequests: boolean) {
    this.listTypes = newListTypes;
    if (loadNewRequests) {
      setTimeout(() => this.selectType(), 2 * 1000);
    }
  }*/

  ngOnInit() {
    this.shopSelected = true;
    this.onlineSelected = true;
    this.selectType();
  }

  /*selectType() {
    const itemsSelected = this.listTypes.filter(type => type.selected);
    const itemsValue = itemsSelected.map(type => type.value);
    this.changeType.next(itemsValue);
  }*/
  selectType() {
    let fields: number[] = [];
    if (this.shopSelected) {
      fields.push(20);
    }
    if (this.onlineSelected) {
      fields.push(30);
    }
    this.changeType.next(fields);
  }
}

export interface OrderType {
  name: string,
  value: number,
  selected: boolean
}
