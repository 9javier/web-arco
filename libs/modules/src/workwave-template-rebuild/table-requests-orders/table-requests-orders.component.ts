import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'table-requests-orders',
  templateUrl: './table-requests-orders.component.html',
  styleUrls: ['./table-requests-orders.component.scss']
})
export class TableRequestsOrdersComponent implements OnInit {

  listRequestOrders: any[] = [];

  constructor() {}

  ngOnInit() {
    this.listRequestOrders = [
      {
        reference: '00235485'
      },
      {
        reference: '00235485'
      },
      {
        reference: '00235485'
      },
      {
        reference: '00235485'
      },
      {
        reference: '00235485'
      },
      {
        reference: '00235485'
      },
      {
        reference: '00235485'
      },
      {
        reference: '00235485'
      },
      {
        reference: '00235485'
      },
      {
        reference: '00235485'
      },
      {
        reference: '00235485'
      },
      {
        reference: '00235485'
      },
      {
        reference: '00235485'
      }
    ];
  }

}
