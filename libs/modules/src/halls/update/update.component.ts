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
    rows: ['', [Validators.required,Validators.min(1)]],
    columns: ['', [Validators.required,Validators.min(1)]]
  };
  formBuilderTemplateInputs = [
    {
      name: 'rows',
      label: 'Alturas',
      type: 'number',
      min:1,
      icon: {type: 'md', name: 'view_stream'}
    },
    {
      name: 'columns',
      label: 'Columnas',
      type: 'number',
      min:1,
      icon: {type: 'md', name: 'view_column'}
    }
  ];
  title = 'Actualizar pasillo';
  apiEndpoint = 'Wharehouse Maps';
  redirectTo = '/halls';

  constructor() {}

  ngOnInit() {}
}
