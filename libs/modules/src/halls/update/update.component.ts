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
    rows: ['', Validators.required],
    columns: ['', Validators.required]
  };
  formBuilderTemplateInputs = [
    {
      name: 'rows',
      label: 'Número de Alturas',
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
  title = 'Actualizar Pasillo';
  apiEndpoint = 'Wharehouse Maps';
  redirectTo = '/halls';

  constructor() {}

  ngOnInit() {}
}
