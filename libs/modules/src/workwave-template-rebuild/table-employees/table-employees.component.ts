import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'table-employees',
  templateUrl: './table-employees.component.html',
  styleUrls: ['./table-employees.component.scss']
})
export class TableEmployeesComponent implements OnInit {

  listEmployees: any[] = [];

  constructor() {}

  ngOnInit() {
    this.listEmployees = [
      {
        name: 'Luis Álvarez',
        active: true,
        start_time: '06:40'
      },
      {
        name: 'Daniel van der Tuck',
        active: false,
        start_time: '07:00'
      },
      {
        name: 'Jordi',
        active: true,
        start_time: '07:50'
      },
      {
        name: 'Yoshua Lino',
        active: true,
        start_time: '07:10'
      },
      {
        name: 'Edgar',
        active: false,
        start_time: '08:15'
      },
      {
        name: 'Pablo Pablo',
        active: false,
        start_time: '08:15'
      },
      {
        name: 'Paco',
        active: true,
        start_time: '10:00'
      },
      {
        name: 'Paco',
        active: true,
        start_time: '10:00'
      },
      {
        name: 'Paco',
        active: true,
        start_time: '10:00'
      },
      {
        name: 'Paco',
        active: false,
        start_time: '10:00'
      },
      {
        name: 'Paco',
        active: true,
        start_time: '10:00'
      },
      {
        name: 'Paco',
        active: false,
        start_time: '10:00'
      },
      {
        name: 'Paco',
        active: false,
        start_time: '10:00'
      }
    ];
  }

}
