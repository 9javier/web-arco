import { Component, OnInit } from '@angular/core';

import {
  UserModel,
  UsersService,
  ProcessesService,
  ProcessModel, WarehouseModel, UserProcessesModel
} from '@suite/services';

import {HttpResponse} from '@angular/common/http';
import { MatTableDataSource } from '@angular/material';
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {forEach} from "@angular/router/src/utils/collection";


@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss']
})

export class UserManagerComponent implements OnInit {
  users: UserProcessesModel.UserProcesses[] = [];
  processes: ProcessModel.Process[] = [];
  displayedColumns: string[] = ['name'];
  dataSourceTable: object[] = [];
  dataColumns: string[];
  formGroup: FormGroup;
  items: FormArray;

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private processesService: ProcessesService
  ) {}

  ngOnInit() {
    this.initUsers();

  }

  initUsers(){
    Promise.all([
      this.processesService.getUsersProcesses(),
      this.processesService.getIndex()
    ]).then(
      (data: any) => {
        data[0].subscribe(
          (res: HttpResponse<UserProcessesModel.ResponseIndex>) => {
            this.users = res.body.data;
            console.log(this.users);
          });
        data[1].subscribe(
          (res: HttpResponse<ProcessModel.ResponseIndex>) => {
            this.processes = res.body.data;
            this.dataColumns = this.processes.map(process => process.name );
            this.displayedColumns = this.displayedColumns.concat(this.dataColumns).concat(['productivity']);

            this.formGroup = this.formBuilder.group({
              items: this.formBuilder.array(() => {
                for(let user of this.users){

                  let name = user.name;
                  let productivity = user.performance;
                  let processes: object[] = [];

                  for (let process of this.processes) {
                    let value = false;
                    for (let userp of user.processes) {
                      if (process.name == userp.name){
                        value = true;
                      }
                    }
                    processes.push({id: process.id, name: process.name, value: value});
                  }

                  this.items = this.formGroup.get('items') as FormArray;
                  this.items.push(this.createItem(name, processes, productivity));
                }
              })
            });

            console.log(this.items);
          });
      },
      err => {
        console.log(err);
      }
    );
  }

  onSubmit(){

  }

  cleanForm(){

  }

  createItem(name, processes, productivity) {
    let arrayForm: {};
    arrayForm['name'] = name;

    for (let process of processes){
        arrayForm[process.name] = process.value
    }

    arrayForm['productivity'] = productivity;

    return this.formBuilder.group(arrayForm);
  }
}


