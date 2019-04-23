import { Component, OnInit } from '@angular/core';
import { UserModel } from '@suite/services';
import { COLLECTIONS } from 'config/base';
import { ListComponent } from "@suite/common/ui/crud";

@Component({
  selector: 'app-jail',
  templateUrl: './jail.component.html',
  styleUrls: ['./jail.component.scss']
})

export class JailComponent implements OnInit {
  public title = 'Jaulas';
  public displayedColumns: string[] = ['id', 'name', 'email', 'select'];
  public columns: string[] = ['id', 'name', 'email'];
  public apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Users').name;
  public routePath = '/jail';

  constructor() {
  }

  ngOnInit() {
  this.title = 'Jaulas';
  this.displayedColumns = ['id', 'name', 'email', 'select'];
  this.columns = ['id', 'name', 'email'];
  this.apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Users').name;
  this.routePath = '/jail';
  }

}




