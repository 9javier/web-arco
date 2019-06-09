import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { COLLECTIONS } from 'config/base';
import { RolModel, PermissionsModel, PermissionsService } from '@suite/services';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'suite-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {

  formBuilderDataInputs = {
    name: ['', [Validators.required, Validators.minLength(4)]],
    description: ['', [Validators.required, Validators.minLength(4)]],
    sga_enabled: [false, []],
    groups: [[]],
    app_enabled: [false, []]
  };
  formBuilderTemplateInputs = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text'
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'text',
      icon: {type: 'ionic', name: 'list-box'},
    },
    {
      name: 'sga_enabled',
      label: 'Habilitar en SGA',
      type: 'checkbox',
      value: true
    },
    {
      name: 'app_enabled',
      label: 'Habilitar en APP',
      type: 'checkbox',
      value: false
    },
    {
      name: 'groups',
      label: 'Permisos',
      type: 'checkbox-multiple',
      icon: {type: 'ionic', name: 'list'},
      items: []
    }
  ];
  title = 'Crear Rol';
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Roles')
    .name;
  redirectTo = '/roles';

  constructor(     
    private permissionService: PermissionsService,
    ) {}

  ngOnInit() {
    this.permissionService
      .getIndex()
      .then((data: Observable<HttpResponse<PermissionsModel.ResponseIndex>>) => {
        data.subscribe((res: HttpResponse<PermissionsModel.ResponseIndex>) => {
          this.formBuilderTemplateInputs.map(item => {
            if (item.name === 'groups') {
              item.items = res.body.data;
            }
          });
        });
      });
    
  }
}
