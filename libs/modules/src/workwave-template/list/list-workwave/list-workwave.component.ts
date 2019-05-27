import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'workwave-list-workwave-template',
  templateUrl: './list-workwave.component.html',
  styleUrls: ['./list-workwave.component.scss']
})
export class WorkwaveListWorkwaveTemplateComponent implements OnInit {

  @Input() storeTemplate: any;
  @Output() changeStoreTemplate = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  changeTemplateValues(fieldChanged) {
    if (this.storeTemplate.consolidated == null) {
      this.storeTemplate.consolidated = 0;
    }
    if (this.storeTemplate.shipping == null) {
      this.storeTemplate.shipping = 0;
    }
    this.changeStoreTemplate.next({store: this.storeTemplate, field: fieldChanged});
  }

}
