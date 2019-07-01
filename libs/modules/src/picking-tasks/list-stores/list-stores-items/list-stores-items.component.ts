import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StoresLineRequestsModel} from "../../../../../services/src/models/endpoints/StoresLineRequests";

@Component({
  selector: 'stores-picking-task-template',
  templateUrl: './list-stores-items.component.html',
  styleUrls: ['./list-stores-items.component.scss']
})
export class StoresPickingTaskTemplateComponent implements OnInit {

  @Input() store: StoresLineRequestsModel.StoresLineRequests = null;
  @Output() selectStore = new EventEmitter<StoresLineRequestsModel.StoresLineRequestsSelected>();

  storeChecked: boolean = false;

  constructor() {}

  ngOnInit() {

  }

  avoidPropagation($event) {
    $event.stopPropagation();
  }

  changeSelectStore() {
    this.selectStore.next({store: this.store, selected: this.storeChecked})
  }

}
