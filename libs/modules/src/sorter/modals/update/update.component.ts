import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { IntermediaryService } from '@suite/services';
import { ModalController, NavParams } from '@ionic/angular';
import { SorterTemplateService } from 'libs/services/src/lib/endpoint/sorter-template/sorter-template.service';

@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  @ViewChild(BaseComponent) base:BaseComponent;
  templateId: any;
  template: any;

  constructor(
    private intermediaryService:IntermediaryService,
    private modalController:ModalController,
    private navParams:NavParams,
    private sorterTemplateService: SorterTemplateService,
  ) {
    this.templateId = this.navParams.get("templateId"); 
  }

  ngOnInit() {
    this.sorterTemplateService.getShow(this.templateId).subscribe(data =>{
      this.template = data.data;
    }, err => {
      console.error('Error::subscribe::sorterTemplateService::getShow', err);
    })
  }

  close(reload: boolean) : void{
    this.modalController.dismiss(reload);
  }

  async submit() {
    await this.intermediaryService.presentLoading('Actualizando plantilla...');

    let payload = this.base.getValue();

    payload = {
      active: true,
      ...payload
    };

    this.sorterTemplateService.updateTemplateSorter(payload, payload.id).subscribe(async (data) => {
      await this.intermediaryService.dismissLoading();
      await this.intermediaryService.presentToastSuccess('Plantilla actualizada.');
      this.close(true);
    }, async (error) => {
      await this.intermediaryService.dismissLoading();
      let errorMessage = 'Ha ocurrido un error al intentar actualizar la plantilla.';
      if (error.error && error.error.errors) {
        errorMessage = error.error.errors;
      }
      await this.intermediaryService.presentToastError(errorMessage);
    });
  }
}
