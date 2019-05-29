import { Component, OnInit } from '@angular/core';
import { RolModel } from '@suite/services';
import { COLLECTIONS } from 'config/base';
@Component({
  selector: 'suite-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  title = 'Roles';
  displayedColumns: string[] = ['name', 'sga_enabled', 'app_enabled' , 'select'];
  columns: any[] = [{name: 'ID', value: 'id'}, {name: 'Nombre', value: 'name'}, {name: 'Acceso SGA', value: 'sga_enabled'}, {name: 'Acceso AL', value: 'app_enabled'}];
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Roles')
    .name;
  routePath = '/roles';

  constructor() {}

  ngOnInit() {}
}
