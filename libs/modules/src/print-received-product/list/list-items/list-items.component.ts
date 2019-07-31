import {Component, Input, OnInit} from '@angular/core';
import {PickingNewProductsModel} from "../../../../../services/src/models/endpoints/PickingNewProducts";

@Component({
  selector: 'received-product-template',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss']
})
export class ReceivedProductTemplateComponent implements OnInit {

  @Input() productReceived: PickingNewProductsModel.ProductReceived;
  @Input() selectedFormControl: any;

  constructor() {}

  ngOnInit() {

  }

  processDate(dateToProcess: string) {
    return new Date(dateToProcess).toLocaleString();
  }

}
