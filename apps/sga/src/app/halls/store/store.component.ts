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
    name: ['', [Validators.required, Validators.minLength(4)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  };
  formBuilderTemplateInputs = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text'
    },
    {
      name: 'selectRow',
      label: 'Número de Filas',
      type: 'select',
      value: [1, 2, 3, 4, 5],
      icon: 'view_stream'
    },
    {
      name: 'selectColumn',
      label: 'Número de Columnas',
      type: 'select',
      value: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
      icon: 'view_column'
    },
    {
      name: 'enable',
      label: 'Activar o Desactivar',
      type: 'select',
      value: ['Activado', 'Desactivado'],
      defaultValue: 'Desactivado',
      icon: 'visibility'
    }
  ];
  title = 'Añadir Pasillo';
  apiEndpoint = 'Wharehouse Maps';
  redirectTo = '/halls';

  customValidators: {
    name: string;
    params: [];
  } = {
    name: 'MustMach',
    params: []
  };

  constructor(private modalCtrl:ModalController) {}

  ngOnInit() {}

  closeModal()
  {
    this.modalCtrl.dismiss();
  }
}
