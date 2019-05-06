import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import {ModalController} from "@ionic/angular";
import {COLLECTIONS} from "../../../../../../config/base";

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
      label: 'Referencia',
      type: 'text'
    }
  ];
  title = 'Crear Jaula';
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Carriers')
    .name;
  redirectTo = '/jails';

  constructor(private modalCtrl:ModalController) {}

  ngOnInit() {}

  closeModal()
  {
    this.modalCtrl.dismiss();
  }
}
