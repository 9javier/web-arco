import {Component, Input, OnInit} from '@angular/core';
import {CarrierModel} from "../../../../../services/src/models/endpoints/Carrier";

@Component({
  selector: 'packing-relabel',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss']
})
export class PackingRelabelTemplateComponent implements OnInit {

  @Input() carrier: CarrierModel.Carrier = null;

  constructor() {}

  ngOnInit() {

  }

}
