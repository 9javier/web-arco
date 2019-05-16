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
    reference: ['', [Validators.required, Validators.pattern('^J[0-9]{4}')]]
  };
  formBuilderTemplateInputs = [
    {
      name: 'reference',
      label: 'Ej. J0001',
      type: 'reference',
      icon: { type: 'ionic', name: 'filing'}
    }
  ];
  title = 'Actualizar Jaula';
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Carriers')
    .name;

  redirectTo = '/jails/list';

  constructor() {}

  ngOnInit() {}
}
