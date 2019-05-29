import { Component, OnInit } from '@angular/core';
import { COLLECTIONS } from 'config/base';

@Component({
  selector: 'suite-roles',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {
  title = 'Grupos de tiendas';
  displayedColumns: string[] = ['name', 'select'];
  columns: any[] = [{name: 'Nombre', value: 'name'}];
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Warehouses Group')
    .name;
  routePath = '/groups';

  constructor() {}

  ngOnInit() {}
}
