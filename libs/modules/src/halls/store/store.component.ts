import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  formBuilderDataInputs = {
    rows: ['', Validators.required],
    columns: ['', Validators.required]
  };
  formBuilderTemplateInputs = [
    {
      name: 'rows',
      label: 'Alturas',
      type: 'number',
      icon: {type: 'md', name: 'view_stream'}
    },
    {
      name: 'columns',
      label: 'Columnas',
      type: 'number',
      icon: {type: 'md', name: 'view_column'}
    }
  ];
  title = 'Añadir pasillo';
  apiEndpoint = 'Wharehouse Maps';
  redirectTo = '/halls';

  constructor(private modalCtrl:ModalController) {}

  ngOnInit() {}

  closeModal()
  {
    this.modalCtrl.dismiss();
  }
}
