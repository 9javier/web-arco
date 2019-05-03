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
    reference: ['', [Validators.required, Validators.maxLength(5)]],
    createdAt: ['', Validators.required],
    updatedAt: ['', Validators.required]
  };
  formBuilderTemplateInputs = [
    {
      name: 'reference',
      label: 'Referencia',
      type: 'text'
    },
    {
      name: 'createdAt',
      label: 'Creado',
      type: 'datetime'
    },
    {
      name: 'updatedAt',
      label: 'Actualizado',
      type: 'datetime'
    }
  ];
  title = 'Actualizar Jaula';
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Carriers')
    .name;

  redirectTo = '/jails';

  constructor() {}

  ngOnInit() {}
}
