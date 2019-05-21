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
  columns: string[] = ['name'];
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Warehouses Groups')
    .name;
  routePath = '/groups';

  constructor() {}

  ngOnInit() {}
}
