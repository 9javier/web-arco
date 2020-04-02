import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {app, ReceptionAvelonModel} from "@suite/services";

@Component({
  selector: 'size-select',
  templateUrl: './size-select.component.html',
  styleUrls: ['./size-select.component.scss']
})
export class SizeSelectComponent implements OnInit {

  @Input() item: ReceptionAvelonModel.LoadSizesList = null;
  @Output() sizeSelected = new EventEmitter();

  public bigItems: boolean = false;

  constructor() { }

  ngOnInit() {
    if (app.name == 'sga') {
      this.bigItems = true;
    }
  }

  public selectValue(item) {
    item.quantity = 1;
    this.sizeSelected.emit(item);
  }
}
