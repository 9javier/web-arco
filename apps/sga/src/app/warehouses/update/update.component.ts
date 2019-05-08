import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { COLLECTIONS } from 'config/base';

@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  formBuilderDataInputs = {
    name: ['', [Validators.required, Validators.minLength(4)]],
    description: ['', Validators.required],
    reference: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
    is_store: [false, []],
    is_main: [false, []]
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
    }
  ];
  title = 'Actualizar Almacén';
  apiEndpoint = 'Warehouses';
  redirectTo = '/warehouses';

  constructor() {}

  ngOnInit() {}
}
