import { Component, OnInit, ViewChild } from '@angular/core';
import { DataComponent } from '../../../jail/data/data.component';
import { ModalController } from '@ionic/angular';
import { IntermediaryService } from '@suite/services';
import { RackService } from '../../../../../services/src/lib/endpoint/rack/rack.service';
import { Validators } from '@angular/forms';
import { COLLECTIONS } from '../../../../../../config/base';

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
})
export class StoreComponent implements OnInit {
  @ViewChild(DataComponent) data:DataComponent;

  formBuilderDataInputs = {
    name: ['', [Validators.required]],
    reference: ['', [Validators.required, Validators.pattern('^E[0-9]{5}')]]
  };
  formBuilderTemplateInputs = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text'
    },
    {
      name: 'reference',
      label: 'Ej. J0001',
      type: 'reference'
    }
  ];
  title = 'Crear Jaula';
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Carriers')
    .name;
  redirectTo = '/jails';

  constructor(
    private modalController:ModalController,
    private intermediaryService:IntermediaryService,
    private rackService: RackService,
  ) { }

  ngOnInit() {}

  async close() {
    await this.modalController.dismiss();
  }

  async submit(value) {
    await this.intermediaryService.presentLoading();
    this.rackService.store(value).subscribe(async data => {
      await this.intermediaryService.dismissLoading();
      await this.intermediaryService.presentToastSuccess("El Estante fue guardado con éxito");
      await this.close();
    }, async () => {
      await this.intermediaryService.dismissLoading();
      await this.intermediaryService.presentToastError("Error creando el Estante");
    })

  }
}
