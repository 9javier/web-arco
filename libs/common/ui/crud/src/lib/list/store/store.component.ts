import { Component, OnInit, Input, NgZone } from '@angular/core';
import { UserModel, IntermediaryService } from '@suite/services';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';

import { CrudService } from '../../service/crud.service';
import { HallsService } from "../../../../../../../services/src/lib/endpoint/halls/halls.service";
import { HallModel } from "../../../../../../../services/src/models/endpoints/Hall";
import { TimesToastType } from '../../../../../../../services/src/models/timesToastType';

interface FormBuilderInputs {
  string: [string, Validators[]];
}

interface FormTypeInputs {
  name: string;
  label: string;
  type: string;
  value?: any;
}

@Component({
  selector: 'suite-ui-crud-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  @Input() title = '';
  @Input() formBuilderDataInputs: FormBuilderInputs;
  @Input() formBuilderTemplateInputs: FormTypeInputs[];
  @Input() customValidators: {
    name: string;
    params: any[];
  } = {
      name: '',
      params: []
    };
  @Input() apiEndpoint: string;
  @Input() redirectTo: string;

  //Presentation Layer
  storeForm: FormGroup;
  submitted = false;
  isLoading = false;
  validator = {};
  routePath: string;
  shownGroup = [];

  constructor(
    private crudService: CrudService,
    private formBuilder: FormBuilder,
    private intermediaryService: IntermediaryService,
    private router: Router,
    private loadingController: LoadingController,
    private zone: NgZone,
    private modalController: ModalController,
    private navParams: NavParams,
    private hallsService: HallsService
  ) { }

  ngOnInit() {
    this.initCustomValidators();
    this.storeForm = this.formBuilder.group(
      this.formBuilderDataInputs,
      this.validator
    );
    // console.log(this.f);
    this.routePath = this.navParams.data.routePath;
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.storeForm.controls;
  }

  initCustomValidators() {
    if (this.customValidators.name === 'MustMach') {
      this.validator = {
        validator: MustMatch('password', 'confirmPassword')
      };
    }
  }

  goToList() {
    this.modalController.dismiss();
  }

  isSelected = (o1, o2) => {
    if (o1 === o2 || (o1[0] && o2.id === o1[0].id)) {
      return true;
    } else {
      return false;
    }
  };

  onSubmit() {
    this.submitted = true;


    // stop here if form is invalid
    if (this.storeForm.invalid) {
      return;
    }

    this.presentLoading();

    if (this.routePath === '/roles' || this.routePath === '/users' || this.routePath === '/warehouses' || this.routePath === '/groups' || this.routePath === '/jails' || this.routePath === '/pallets') {
      this.postStore();
    } else if (this.routePath === '/halls') {
      this.postStoreHall();
    }
  }

  postStoreHall() {
    this.storeForm.value.warehouse = this.navParams.data.warehouse;
    this.hallsService
      .postStore(this.storeForm.value)
      .then((data: Observable<HttpResponse<HallModel.ResponseStore>>) => {
        data.subscribe(
          (res: HttpResponse<HallModel.ResponseStore>) => {
            this.dismissLoading();
            this.modalController.dismiss();
            this.intermediaryService.presentToastSuccess(`Pasillo ${res.body.data.hall} creado`, TimesToastType.DURATION_SUCCESS_TOAST_3750);
          },
          (errorResponse: HttpErrorResponse) => {
            this.dismissLoading();
            this.intermediaryService.presentToastError('Error - Errores no estandarizados');
          }
        );
      });
  }

  postStore() {
    this.crudService
      .postStore(this.storeForm.value, this.apiEndpoint)
      .then((data: Observable<HttpResponse<UserModel.ResponseStore>>) => {
        data.subscribe(
          (res: HttpResponse<UserModel.ResponseStore>) => {
            this.dismissLoading();
            this.modalController.dismiss();
            this.intermediaryService.presentToastSuccess(`Usuario ${res.body.data.name} creado`, TimesToastType.DURATION_SUCCESS_TOAST_3750);
          },
          (errorResponse: HttpErrorResponse) => {
            this.dismissLoading();
            this.intermediaryService.presentToastError('Error - Errores no estandarizados');
          }
        );
      });
  }

  async presentLoading() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        message: 'Un momento ...'
      })
      .then(a => {
        a.present().then(() => {
          // console.log('presented');
          if (!this.isLoading) {
            a.dismiss().then(() => { });
          }
        });
      });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController
      .dismiss()
      .then(() => { });
  }

  toggleGroup(group) {
    if (this.isGroupShown(group)) {
      this.shownGroup[group] = true;
    } else {
      this.shownGroup[group] = group;
    }
  };

  isGroupShown(group) {
    return this.shownGroup[group] === group;
  };

  addValueArray(name, child) {
    this.f[name].value.push(child.id);
  }
}


// custom validator to check that two fields match
function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
