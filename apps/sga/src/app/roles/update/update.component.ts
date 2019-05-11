import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormArray } from '@angular/forms';
import { COLLECTIONS } from 'config/base';
import { PermissionsService, PermissionsModel } from '@suite/services';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

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
    },
    {
      name: 'description',
      label: 'Descripción',
      type: 'text',
      icon: { type: 'ionic', name: 'list-box' },
    },
    {
      name: 'sga_enabled',
      label: 'Habilitar SGA',
      type: 'checkbox',
      value: false
    },
    {
      name: 'app_enabled',
      label: 'Habilitar APP',
      type: 'checkbox',
      value: false
    }
  ];

  formBuilderDataInputs = {
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(4)]],
    sga_enabled: [this.formBuilderTemplateInputs[2].value, []],
    app_enabled: [this.formBuilderTemplateInputs[3].value, []]
  };
  title = 'Actualizar Rol';
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Roles')
    .name;
  redirectTo = '/roles/list';

  constructor(private permissionService: PermissionsService) {
  }

  ngOnInit() {
    // this.permissionService
    //   .getIndex()
    //   .then((data: Observable<HttpResponse<PermissionsModel.ResponseIndex>>) => {
    //     data.subscribe((res: HttpResponse<PermissionsModel.ResponseIndex>) => {
    //       this.formBuilderTemplateInputs.map(item => {
    //         if (item.name === 'groups') {
    //           item.items = res.body.data;
    //         }
    //       });
    //     });
    //   });
  }
}
