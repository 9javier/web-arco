import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { IntermediaryService } from '@suite/services';
import { ModalController, NavParams } from '@ionic/angular';
import { SorterTemplateService } from '../../../../../services/src/lib/endpoint/sorter-template/sorter-template.service';

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  @ViewChild(BaseComponent) base: BaseComponent;

  constructor(
    private intermediaryService: IntermediaryService,
    private modalController: ModalController,
    private navParams: NavParams,
    private sorterTemplateService: SorterTemplateService,
  ) {
  }

  ngOnInit() {
  }

  close(): void {
    this.modalController.dismiss();
  }

  submit(): void {
    let payload = this.base.getValue()
    payload = {
      active: true,
      ...payload
    }
    console.log(payload)
    this.sorterTemplateService.postCreate(payload).subscribe((data) => {
      console.log(data.data);
      this.close();
    }, (err) => {
      console.log(err);
    });
  }

}
