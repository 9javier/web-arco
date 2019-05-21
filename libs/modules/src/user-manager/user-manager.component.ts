import { Component, OnInit } from '@angular/core';

import {
  UserModel,
  UsersService,
  ProcessesService,
  ProcessModel, WarehouseModel
} from '@suite/services';

import {HttpResponse} from '@angular/common/http';
import { MatTableDataSource } from '@angular/material';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.scss']
})

export class UserManagerComponent implements OnInit {
  users: UserModel.User[] = [];
  processes: ProcessModel.Process[] = [];
  displayedColumns: string[] = ['name'];
  dataColumns: string[];
  updateForm: FormGroup;
  constructor(
    private usersService: UsersService,
    private processesService: ProcessesService
  ) {}

  ngOnInit() {
    this.initUsers();
  }

  initUsers(){
    Promise.all([
      this.usersService.getIndex(),
      this.processesService.getIndex()
    ]).then(
      (data: any) => {
        data[0].subscribe(
          (res: HttpResponse<UserModel.ResponseIndex>) => {
            this.users = res.body.data;
            console.log(this.users);
          });
        data[1].subscribe(
          (res: HttpResponse<ProcessModel.ResponseIndex>) => {
            this.processes = res.body.data;
            this.dataColumns = this.processes.map(process => process.name );
            this.displayedColumns = this.displayedColumns.concat(this.dataColumns).concat(['productivity']);
            console.log('dataColumns');
            console.log(this.dataColumns);
            console.log('Processes');
            console.log(this.processes);
          });
      },
      err => {
        console.log(err);
      }
    );
  }

  onSubmit(){

  }
}


