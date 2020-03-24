import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {StoresLineRequestsModel} from "../../../../../services/src/models/endpoints/StoresLineRequests";
import {DateTimeParserService} from "../../../../../services/src/lib/date-time-parser/date-time-parser.service";

@Component({
  selector: 'stores-picking-task-template',
  templateUrl: './list-stores-items.component.html',
  styleUrls: ['./list-stores-items.component.scss']
})
export class StoresPickingTaskTemplateComponent implements OnInit {

  @Input() requestGroup: StoresLineRequestsModel.RequestGroup = null;
  @Output() selectGroup = new EventEmitter<StoresLineRequestsModel.RequestGroupSelected>();

  private totalRequestsSelected: number = 0;

  constructor(
    public dateTimeParserService: DateTimeParserService
  ) {}

  ngOnInit() {}

  getRequestsSelected() : string {
    if (this.requestGroup) {
      let requestsSelected = this.requestGroup.lines.filter(request => request.selected).length;
      if (requestsSelected > 0) {
        return `${this.requestGroup.lines.filter(request => request.selected).length} / ${this.requestGroup.lines.length}`;
      } else {
        return `${this.requestGroup.lines.length}`;
      }
    } else {
      return '0';
    }
  }

  avoidPropagation($event) {
    $event.stopPropagation();
  }

  changeSelectGroup() {
    this.selectGroup.next({selected: this.requestGroup.selected, requestGroup: this.requestGroup});
    for (let line of this.requestGroup.lines) {
      line.selected = this.requestGroup.selected;
    }
    if (this.requestGroup.selected) {
      this.totalRequestsSelected = this.requestGroup.lines.length;
    } else {
      this.totalRequestsSelected = 0;
    }
  }

  changeSelectRequest(event) {
    this.totalRequestsSelected = this.requestGroup.lines.filter(line => line.selected).length;
    if (event) {
      this.requestGroup.selected = true;
      this.selectGroup.next({selected: this.requestGroup.selected, requestGroup: this.requestGroup});
    } else {
      if (this.totalRequestsSelected == 0) {
        this.requestGroup.selected = false;
        this.selectGroup.next({selected: this.requestGroup.selected, requestGroup: this.requestGroup});
      }
    }
  }

}
