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
    name: ['', [Validators.required, Validators.minLength(4)]],
  };
  formBuilderTemplateInputs = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text'
    }
  ];
  title = 'Crear Grupo';
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Warehouses Groups')
    .name;
  redirectTo = '/groups';

  constructor() {}

  ngOnInit() {}
}
