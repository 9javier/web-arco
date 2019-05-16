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
    description: ['', Validators.required],
    reference: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    is_store: [false, []],
    is_main: [false, []],
    has_racks: [false, []]
  };
  formBuilderTemplateInputs = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      icon: { type: 'md', name: 'title'}
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'text',
      icon: { type: 'md', name: 'description'}
    },
    {
      name: 'reference',
      label: 'Referencia',
      type: 'text',
      icon: { type: 'ionic', name: 'barcode'}
    },
    {
      name: 'is_store',
      label: 'Es tienda',
      type: 'checkbox',
      value: false
    },
    {
      name: 'is_main',
      label: 'Establecer como almacén principal',
      type: 'checkbox',
      value: false
    },
    {
      name: 'has_racks',
      label: 'Tiene pasillos',
      type: 'checkbox',
      value: false
    }
  ];
  title = 'Añadir Almacén';
  apiEndpoint = 'Warehouses';
  redirectTo = '/warehouses';

  constructor(private modalCtrl:ModalController) {}

  ngOnInit() {}

  closeModal()
  {
    this.modalCtrl.dismiss();
  }
}
