import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { COLLECTIONS } from 'config/base';

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  formBuilderDataInputs = {
    reference: ['', [Validators.required, Validators.pattern('^P[0-9]{4}')]]
  };
  formBuilderTemplateInputs = [
    {
      name: 'reference',
      label: 'Referencia',
      type: 'text'
    }
  ];
  title = 'Crear Palet';
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Pallets')
    .name;
  redirectTo = '/pallets';

  constructor() {}

  ngOnInit() {}
}
