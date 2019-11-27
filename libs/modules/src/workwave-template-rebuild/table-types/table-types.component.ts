import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'table-types',
  templateUrl: './table-types.component.html',
  styleUrls: ['./table-types.component.scss']
})
export class TableTypesComponent implements OnInit {

  @Output() changeType = new EventEmitter();

  receptionSelected: boolean = false;
  distributionSelected: boolean = false;

  constructor() {}

  ngOnInit() {
    this.receptionSelected = true;
    this.distributionSelected = true;
    this.selectType(true);
  }

  selectType(inPageCreation: boolean) {
    let fields: number[] = [];
    if (this.receptionSelected) {
      fields.push(1);
    }
    if (this.distributionSelected) {
      fields.push(2);
    }
    this.changeType.next({ fields, inPageCreation });
  }

}
