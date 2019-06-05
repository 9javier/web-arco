import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'workwave-list-workwave-template',
  templateUrl: './list-workwave.component.html',
  styleUrls: ['./list-workwave.component.scss']
})
export class WorkwaveListWorkwaveTemplateComponent implements OnInit {

  @Input() storeTemplate: any;
  @Output() changeStoreTemplate = new EventEmitter<any>();
  public listTypeShippingOrderOptions: any[] = [];

  constructor() {}

  ngOnInit() {
    this.listTypeShippingOrderOptions = [
      {
        id: 1,
        value: 'Reponer'
      },
      {
        id: 2,
        value: 'Distribuir'
      },
      {
        id: 3,
        value: 'Ambas - Reponer con prioridad'
      },
      {
        id: 4,
        value: 'Ambas - Distribuir con prioridad'
      },
      {
        id: 5,
        value: 'Ambas - Sin ninguna prioridad'
      }
    ];
  }

  changeTemplateValues(fieldChanged) {
    if (this.storeTemplate.thresholdConsolidated == null) {
      this.storeTemplate.thresholdConsolidated = 0;
    }
    if (this.storeTemplate.thresholdShippingStore == null) {
      this.storeTemplate.thresholdShippingStore = 0;
    }
    this.changeStoreTemplate.next({store: this.storeTemplate, field: fieldChanged});
  }

}
