import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { COLLECTIONS } from 'config/base';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  formBuilderDataInputs = {
    reference: ['', [Validators.required, Validators.pattern('^J[0-9]{4}')]]
  };
  formBuilderTemplateInputs = [
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
    private modalController:ModalController
  ) {}

  ngOnInit() {}

  close():void{
    this.modalController.dismiss();
  }
}
