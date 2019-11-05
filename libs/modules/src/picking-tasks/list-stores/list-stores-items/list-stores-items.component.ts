import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StoresLineRequestsModel} from "../../../../../services/src/models/endpoints/StoresLineRequests";
import {DateTimeParserService} from "../../../../../services/src/lib/date-time-parser/date-time-parser.service";

@Component({
  selector: 'stores-picking-task-template',
  templateUrl: './list-stores-items.component.html',
  styleUrls: ['./list-stores-items.component.scss']
})
export class StoresPickingTaskTemplateComponent implements OnInit {

  @Input() orderRequestByStore: StoresLineRequestsModel.StoresOrderRequests = null;
  @Output() selectStore = new EventEmitter<StoresLineRequestsModel.StoresOrderRequestsSelected>();

  private totalRequestsSelected: number = 0;

  constructor(
    public dateTimeParserService: DateTimeParserService
  ) {}

  ngOnInit() {

  }

  getRequestsSelected() : string {
    if (this.orderRequestByStore) {
      let requestsSelected = this.orderRequestByStore.lines.filter(request => request.selected).length;
      if (requestsSelected > 0) {
        return `${this.orderRequestByStore.lines.filter(request => request.selected).length} / ${this.orderRequestByStore.lines.length}`;
      } else {
        return `${this.orderRequestByStore.lines.length}`;
      }
    } else {
      return '0';
    }
  }

  avoidPropagation($event) {
    $event.stopPropagation();
  }

  changeSelectStore() {
    this.selectStore.next({store: this.orderRequestByStore, selected: this.orderRequestByStore.selected});
    for (let request of this.orderRequestByStore.lines) {
      request.selected = this.orderRequestByStore.selected;
    }

    if (this.orderRequestByStore.selected) {
      this.totalRequestsSelected = this.orderRequestByStore.lines.length;
    } else {
      this.totalRequestsSelected = 0;
    }
  }

  changeSelectRequest(data, lineRequest: StoresLineRequestsModel.OrderRequests) {
    this.totalRequestsSelected = this.orderRequestByStore.lines.filter(orderRequest => orderRequest.selected).length;
    if (data) {
      this.orderRequestByStore.selected = true;
    } else {
      if (this.totalRequestsSelected == 0) {
        this.orderRequestByStore.selected = false;
      }
    }
  }

}
