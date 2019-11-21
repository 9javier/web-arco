import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { WorkwavesService } from 'libs/services/src/lib/endpoint/workwaves/workwaves.service';

@Component({
  selector: 'table-types',
  templateUrl: './table-types.component.html',
  styleUrls: ['./table-types.component.scss']
})
export class TableTypesComponent implements OnInit {

  receptionSelected: boolean = false;
  distributionSelected: boolean = false;

  constructor(
    private serviceG : WorkwavesService
  ) {}

  ngOnInit() {
    this.receptionSelected = true;
    this.distributionSelected = true;
    this.selectType('init');
  }

  selectType(validation:String) {
    let fields: number[] = [];
    if (this.receptionSelected) {
      fields.push(1);
    }
    if (this.distributionSelected) {
      fields.push(2);
    }

    let aux = this.serviceG.orderAssignment.value;
      aux.data.typesShippingOrders = fields;
      aux.type = validation === 'init' ?  true : false;
      this.serviceG.orderAssignment.next(aux);

  }

}
