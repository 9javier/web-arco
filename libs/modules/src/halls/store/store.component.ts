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
      label: 'Número de Filas',
      type: 'select',
      value: [1, 2, 3, 4, 5],
      icon: {type: 'md', name: 'view_stream'}
    },
    {
      name: 'columns',
      label: 'Número de Columnas',
      type: 'select',
      value: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
      icon: {type: 'md', name: 'view_column'}
    }
  ];
  title = 'Añadir Pasillo';
  apiEndpoint = 'Wharehouse Maps';
  redirectTo = '/halls';

  constructor(private modalCtrl:ModalController) {}

  ngOnInit() {}

  closeModal()
  {
    this.modalCtrl.dismiss();
  }
}
