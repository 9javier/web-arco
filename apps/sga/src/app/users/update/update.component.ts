import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { COLLECTIONS } from 'config/base';
import { RolesService, RolModel } from '@suite/services';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'suite-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {
  formBuilderDataInputs = {
    name: ['', [Validators.required, Validators.minLength(4)]],
    roleId: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.required, Validators.minLength(4)]],
    password: [''],
    confirmPassword: ['']
  };
  formBuilderTemplateInputs = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text'
    },
    {
      name: 'roleId',
      label: 'Rol de usuario',
      type: 'select',
      icon: {type: 'ionic', name: 'list-box'},
      value: []
    },
    {
      name: 'email',
      label: 'Correo Electrónico',
      type: 'email'
    },
    {
      name: 'address',
      label: 'Dirección',
      type: 'text',
      icon: {type: 'ionic', name: 'home'}
    },
    {
      name: 'password',
      label: 'Nueva Contraseña',
      type: 'password'
    },
    {
      name: 'confirmPassword',
      label: 'Repetir nueva Contraseña',
      type: 'password'
    }
  ];
  title = 'Actualizar Usuario';
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Users')
    .name;
  redirectTo = 'users/list';
  routePath = '/users';
  customValidators: {
    name: string;
    params: [];
  } = {
    name: 'MustMach',
    params: []
  };

  constructor(
    private rolesService: RolesService
  ) {}

  ngOnInit() {
    this.rolesService
      .getIndex()
      .then((data: Observable<HttpResponse<RolModel.ResponseIndex>>) => {
        data.subscribe((res: HttpResponse<RolModel.ResponseIndex>) => {
          this.formBuilderTemplateInputs.map(item => {
            if (item.name === 'roleId') {
              item.value = res.body.data;
            }
          });
        });
      });
  }
}
