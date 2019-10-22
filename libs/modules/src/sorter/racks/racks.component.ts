import { Component, OnInit } from '@angular/core';
import { COLLECTIONS } from 'config/base';

@Component({
  selector: 'suite-racks',
  templateUrl: './racks.component.html',
  styleUrls: ['./racks.component.scss'],
})
export class RacksComponent implements OnInit {
  title = 'Estantes';
  displayedColumns: string[] = ['name', 'reference', 'select'];
  columns: any[] = [{ name: 'Nombre', value: 'name' }, { name: 'Referencia', value: 'reference' } ];
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Rack Sorter').name;

  routePath = '/sorterRack';
  constructor() { }

  ngOnInit() {}

}
