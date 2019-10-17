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

  close(reload) : void {
    this.modalController.dismiss(reload);
  }

  async submit() {
    await this.intermediaryService.presentLoading('Creando plantilla...');

    let payload = this.base.getValue();
    payload = {
      active: true,
      ...payload
    };

    this.sorterTemplateService.postCreate(payload).subscribe(async (data) => {
      await this.intermediaryService.dismissLoading();
      await this.intermediaryService.presentToastSuccess('Plantilla creada.');
      this.close(true);
    }, async (err) => {
      await this.intermediaryService.dismissLoading();
      let errorMessage = 'Ha ocurrido un error al intentar crear la plantilla.';
      if (err.error && err.error.errors) {
        errorMessage = err.error.errors;
      }
      await this.intermediaryService.presentToastError(errorMessage);
    });
  }

}
