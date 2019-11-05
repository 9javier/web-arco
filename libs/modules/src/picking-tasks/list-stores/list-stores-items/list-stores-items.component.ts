import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StoresLineRequestsModel} from "../../../../../services/src/models/endpoints/StoresLineRequests";

@Component({
  selector: 'stores-picking-task-template',
  templateUrl: './list-stores-items.component.html',
  styleUrls: ['./list-stores-items.component.scss']
})
export class StoresPickingTaskTemplateComponent implements OnInit {

  @Input() lineRequestByStore: StoresLineRequestsModel.StoresLineRequests = null;
  @Output() selectStore = new EventEmitter<StoresLineRequestsModel.StoresLineRequestsSelected>();

  private totalRequestsSelected: number = 0;

  constructor() {}

  ngOnInit() {

  }

  avoidPropagation($event) {
    $event.stopPropagation();
  }

  changeSelectStore() {
    this.selectStore.next({store: this.lineRequestByStore, selected: this.lineRequestByStore.selected});
    for (let request of this.lineRequestByStore.lines) {
      request.selected = this.lineRequestByStore.selected;
    }

    if (this.lineRequestByStore.selected) {
      this.totalRequestsSelected = this.lineRequestByStore.lines.length;
    } else {
      this.totalRequestsSelected = 0;
    }
  }

  changeSelectRequest(data, lineRequest: StoresLineRequestsModel.LineRequests) {
    if (data) {
      this.totalRequestsSelected++;
    } else {
      this.totalRequestsSelected--;
    }

    this.lineRequestByStore.selected = this.totalRequestsSelected == this.lineRequestByStore.lines.length;
  }

}
