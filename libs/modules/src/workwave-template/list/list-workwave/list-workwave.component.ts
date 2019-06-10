import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'workwave-list-workwave-template',
  templateUrl: './list-workwave.component.html',
  styleUrls: ['./list-workwave.component.scss']
})
export class WorkwaveListWorkwaveTemplateComponent implements OnInit {

  @Input() storeTemplate: any;
  @Input() disableEdition: boolean = false;
  @Output() changeStoreTemplate = new EventEmitter<any>();
  @Output() copyTemplateEmitter = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  changeTemplateValues(fieldChanged) {
    if (this.storeTemplate.thresholdConsolidated == null) {
      this.storeTemplate.thresholdConsolidated = 0;
    }
    if (this.storeTemplate.thresholdShippingStore == null) {
      this.storeTemplate.thresholdShippingStore = 0;
    }
    this.changeStoreTemplate.next({store: this.storeTemplate, field: fieldChanged});
  }

  copyTemplateFromLatestEdited() {
    this.copyTemplateEmitter.next({store: this.storeTemplate})
  }

  checkRadioToRemove(source: string, value: string) {
    if (source == 'replace' && this.storeTemplate.replace && this.storeTemplate.replace == value) {
      setTimeout(() => {
        this.storeTemplate.replace = '';
        this.changeTemplateValues('replace');
      }, 100);
    } else if (source == 'allocate' && this.storeTemplate.allocate && this.storeTemplate.allocate == value) {
      setTimeout(() => {
        this.storeTemplate.allocate = '';
        this.changeTemplateValues('allocate');
      }, 100);
    }
  }

}
