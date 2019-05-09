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
    reference: ['', [Validators.required, Validators.pattern('^P[0-9]{4}')]]
  };
  formBuilderTemplateInputs = [
    {
      name: 'reference',
      label: 'Referencia',
      type: 'text',
      icon: { type: 'ionic', name: 'filing'}
    }
  ];
  title = 'Actualizar Palet';
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Pallets')
    .name;

  redirectTo = '/pallets/list';

  constructor() {}

  ngOnInit() {}
}
