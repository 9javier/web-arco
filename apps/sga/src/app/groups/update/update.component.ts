import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormArray } from '@angular/forms';
import { COLLECTIONS } from 'config/base';


@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  formBuilderTemplateInputs = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text'
    }
  ];
  formBuilderDataInputs = {
    name: ['', [Validators.required, Validators.minLength(4)]]
  };
  title = 'Actualizar Grupo';
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Warehouses Groups')
    .name;
  redirectTo = '/groups/list';

  constructor() {
  }

  ngOnInit() {}

}
