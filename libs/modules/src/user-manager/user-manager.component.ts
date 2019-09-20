import { Component, OnInit, ViewChild } from '@angular/core';

import {
  UserModel,
  UsersService,
  ProcessesService,
  ProcessModel, WarehouseModel,
  TypeModel, TypesService, TypeUsersProcesses
} from './../../../services/src/index';

import { HttpResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { forEach } from "@angular/router/src/utils/collection";
import { UserProcessesService, UserProcessesModel } from '@suite/services';
import { from, Observable } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import { UtilsComponent } from "../components/utils/utils.component";


@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss']
})

export class UserManagerComponent implements OnInit {
  users: UserProcessesModel.UserProcesses[] = [];
  processes: ProcessModel.Process[] = [];
  displayedColumns: string[];
  dataSourceTable: object[] = [];
  dataColumns: string[];
  formGroup: FormGroup;
  items: FormArray;
  /**previous value of form to delete */
  toDelete;
  @ViewChild(UtilsComponent) utils: UtilsComponent;
  typeProcesses: Array<TypeModel.TypeProcess> = [];
  constructor(
    private typeService: TypesService,
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private processesService: ProcessesService,
    private userProcessService: UserProcessesService
  ) { }

  ngOnInit() {
    this.buildFormWithData();
  }

  /**
   * Get all processes types for build the table header
   */
  getTypes(): Observable<Array<TypeModel.TypeProcess>> {
    return Observable.create(observer => {
      this.typeService.getIndexProcesses().subscribe(types => {
        observer.next(types);
      })
    });
  }

  /**
   * Get all user process to show
   */
  getUserProcess(): Observable<Array<TypeUsersProcesses.UsersProcesses>> {
    return Observable.create(observer => {
      this.userProcessService.getIndex().subscribe(userProcess => {
        observer.next(userProcess)
      });
    });
  }

  /**
   * handle de async of the get data methods
   */
  buildFormWithData() {
    this.formGroup = null;
    this.displayedColumns = [];
    if (this.utils)
      this.utils.presentLoading();
    /**get the types of processes */
    this.getTypes().pipe(flatMap(types => {
      this.typeProcesses = types;
      this.displayedColumns = ["name"].concat(this.displayedColumns.concat(types.map(type => type.name)).concat("performance"));
      /**therefore call user processes and build the form */
      return this.getUserProcess();
    })).subscribe(userProccess => {
      this.formGroup = this.buildForm(userProccess);
      this.toDelete = this.formGroup.value;
      if (this.utils)
        this.utils.dismissLoading();
    });
  }

  /**
   * build form from user process data
   * @param usersProcesss array of user process data
   */
  buildForm(usersProcesss: Array<TypeUsersProcesses.UsersProcesses>): FormGroup {
    let userProcessForm: FormGroup = this.formBuilder.group({
      users: this.formBuilder.array([])
    });
    usersProcesss.forEach(userProcess => {
      (<FormArray>userProcessForm.get("users")).push(this.formBuilder.group({
        id: userProcess.id,
        name: userProcess.name,
        processes: this.formBuilder.array(this.typeProcesses.map(typeProcess => {
          return new FormControl(!!(userProcess.processes.map(userProcess => userProcess.processType).indexOf(typeProcess.id) + 1));
        })),
        performance: userProcess.performance || 0
      }));
    });
    return userProcessForm;
  }

  /**
   * sanitize the object to the format needed by the endpoint
   * @param toSanitize object to sanitize
   */
  sanitize(toSanitize) {
    /**transform the true values into ids */
    toSanitize.users.forEach(user => {
      user.processes = user.processes.map((process, i) => process ? this.typeProcesses[i].id : false).filter(process => process);
      user.performance = user.performance || 0;
    });
    return toSanitize;
  }

  /**
   * Update the values for the user processes
   */
  submit(): void {
    this.utils.presentLoading();
    let formValues = this.sanitize(JSON.parse(JSON.stringify(this.formGroup.value)));
    let toDeleteValues = this.sanitize(JSON.parse(JSON.stringify(this.toDelete)));
    this.userProcessService.postUnAssign(toDeleteValues).subscribe(response => {
      this.userProcessService.postAssign(formValues).subscribe(response => {
        this.utils.presentAlert("Éxito", "Nueva configuración asignada");
        this.toDelete = this.formGroup.value;
        this.utils.dismissLoading();
      })
    });
  }

  /**
   * clear all fields of the form
   */
  clear() {
    let clearValues = JSON.parse(JSON.stringify(this.formGroup.value));
    clearValues.users.forEach(user => {
      user.processes = user.processes.map(process => false);
      user.performance = 0;
    });
    this.formGroup.patchValue(clearValues);
  }

  /**
   * recover the form to a previous value
   */
  undo(): void {
    this.formGroup.patchValue(this.toDelete);
  }

  cleanForm() {
  }
}


