import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ModalController } from "@ionic/angular";
import { RolesService, RolModel } from '@suite/services';
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
    role: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    address: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  };
  formBuilderTemplateInputs = [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text'
    },
    {
      name: 'role',
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
      label: 'Contraseña',
      type: 'password'
    },
    {
      name: 'confirmPassword',
      label: 'Confirmar Contraseña',
      type: 'password'
    }
  ];
  title = 'Crear Usuario';
  apiEndpoint = 'Users';
  redirectTo = '/users';

  customValidators: {
    name: string;
    params: [];
  } = {
      name: 'MustMach',
      params: []
    };

  constructor(
    private modalCtrl: ModalController,
    private rolesService: RolesService
  ) { }

  ngOnInit() {
    this.rolesService
      .getIndex()
      .then((data: Observable<HttpResponse<RolModel.ResponseIndex>>) => {
        data.subscribe((res: HttpResponse<RolModel.ResponseIndex>) => {
          this.formBuilderTemplateInputs.map(item => {
            if (item.name == 'role') {
              item.value = res.body.data;
            }
          });
        });
      });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
