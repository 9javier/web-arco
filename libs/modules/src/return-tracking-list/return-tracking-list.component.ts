import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material";

@Component({
  selector: 'suite-return-tracking-list',
  templateUrl: './return-tracking-list.component.html',
  styleUrls: ['./return-tracking-list.component.scss']
})
export class ReturnTrackingListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  returns: {
    id: number,
    type: string,
    provider: string,
    brands: string,
    dateLimit: string,
    warehouse: string,
    status: string,
    dateLastStatus: string,
    userLastStatus: string,
    units: number
  }[];

  constructor() {}

  ngOnInit() {
    this.returns = [
      {
        id: 1,
        type: 'Defectuoso',
        provider: 'Zapatería S.L.',
        brands: 'Adidas',
        dateLimit: '01/01/2020',
        warehouse: '601',
        status: 'En Proceso',
        dateLastStatus: '01/01/2020',
        userLastStatus: 'Juan',
        units: 457
      },
      {
        id: 2,
        type: 'Defectuoso',
        provider: 'Zapatería S.L.',
        brands: 'Adidas',
        dateLimit: '01/01/2020',
        warehouse: '601',
        status: 'En Proceso',
        dateLastStatus: '01/01/2020',
        userLastStatus: 'Juan',
        units: 457
      },
      {
        id: 3,
        type: 'Defectuoso',
        provider: 'Zapatería S.L.',
        brands: 'Adidas',
        dateLimit: '01/01/2020',
        warehouse: '601',
        status: 'En Proceso',
        dateLastStatus: '01/01/2020',
        userLastStatus: 'Juan',
        units: 457
      },
      {
        id: 4,
        type: 'Defectuoso',
        provider: 'Zapatería S.L.',
        brands: 'Adidas',
        dateLimit: '01/01/2020',
        warehouse: '601',
        status: 'En Proceso',
        dateLastStatus: '01/01/2020',
        userLastStatus: 'Juan',
        units: 457
      },
      {
        id: 5,
        type: 'Defectuoso',
        provider: 'Zapatería S.L.',
        brands: 'Adidas',
        dateLimit: '01/01/2020',
        warehouse: '601',
        status: 'En Proceso',
        dateLastStatus: '01/01/2020',
        userLastStatus: 'Juan',
        units: 457
      },
      {
        id: 6,
        type: 'Defectuoso',
        provider: 'Zapatería S.L.',
        brands: 'Adidas',
        dateLimit: '01/01/2020',
        warehouse: '601',
        status: 'En Proceso',
        dateLastStatus: '01/01/2020',
        userLastStatus: 'Juan',
        units: 457
      },
      {
        id: 7,
        type: 'Defectuoso',
        provider: 'Zapatería S.L.',
        brands: 'Adidas',
        dateLimit: '01/01/2020',
        warehouse: '601',
        status: 'En Proceso',
        dateLastStatus: '01/01/2020',
        userLastStatus: 'Juan',
        units: 457
      },
      {
        id: 8,
        type: 'Defectuoso',
        provider: 'Zapatería S.L.',
        brands: 'Adidas',
        dateLimit: '01/01/2020',
        warehouse: '601',
        status: 'En Proceso',
        dateLastStatus: '01/01/2020',
        userLastStatus: 'Juan',
        units: 457
      },
      {
        id: 9,
        type: 'Defectuoso',
        provider: 'Zapatería S.L.',
        brands: 'Adidas',
        dateLimit: '01/01/2020',
        warehouse: '601',
        status: 'En Proceso',
        dateLastStatus: '01/01/2020',
        userLastStatus: 'Juan',
        units: 457
      },
      {
        id: 10,
        type: 'Defectuoso',
        provider: 'Zapatería S.L.',
        brands: 'Adidas',
        dateLimit: '01/01/2020',
        warehouse: '601',
        status: 'En Proceso',
        dateLastStatus: '01/01/2020',
        userLastStatus: 'Juan',
        units: 457
      },
      {
        id: 11,
        type: 'Defectuoso',
        provider: 'Zapatería S.L.',
        brands: 'Adidas',
        dateLimit: '01/01/2020',
        warehouse: '601',
        status: 'En Proceso',
        dateLastStatus: '01/01/2020',
        userLastStatus: 'Juan',
        units: 457
      },
      {
        id: 12,
        type: 'Defectuoso',
        provider: 'Zapatería S.L.',
        brands: 'Adidas',
        dateLimit: '01/01/2020',
        warehouse: '601',
        status: 'En Proceso',
        dateLastStatus: '01/01/2020',
        userLastStatus: 'Juan',
        units: 457
      },
      {
        id: 13,
        type: 'Defectuoso',
        provider: 'Zapatería S.L.',
        brands: 'Adidas',
        dateLimit: '01/01/2020',
        warehouse: '601',
        status: 'En Proceso',
        dateLastStatus: '01/01/2020',
        userLastStatus: 'Juan',
        units: 457
      },
      {
        id: 14,
        type: 'Defectuoso',
        provider: 'Zapatería S.L.',
        brands: 'Adidas',
        dateLimit: '01/01/2020',
        warehouse: '601',
        status: 'En Proceso',
        dateLastStatus: '01/01/2020',
        userLastStatus: 'Juan',
        units: 457
      },
      {
        id: 15,
        type: 'Defectuoso',
        provider: 'Zapatería S.L.',
        brands: 'Adidas',
        dateLimit: '01/01/2020',
        warehouse: '601',
        status: 'En Proceso',
        dateLastStatus: '01/01/2020',
        userLastStatus: 'Juan',
        units: 457
      },
      {
        id: 16,
        type: 'Defectuoso',
        provider: 'Zapatería S.L.',
        brands: 'Adidas',
        dateLimit: '01/01/2020',
        warehouse: '601',
        status: 'En Proceso',
        dateLastStatus: '01/01/2020',
        userLastStatus: 'Juan',
        units: 457
      },
      {
        id: 17,
        type: 'Defectuoso',
        provider: 'Zapatería S.L.',
        brands: 'Adidas',
        dateLimit: '01/01/2020',
        warehouse: '601',
        status: 'En Proceso',
        dateLastStatus: '01/01/2020',
        userLastStatus: 'Juan',
        units: 457
      },
      {
        id: 18,
        type: 'Defectuoso',
        provider: 'Zapatería S.L.',
        brands: 'Adidas',
        dateLimit: '01/01/2020',
        warehouse: '601',
        status: 'En Proceso',
        dateLastStatus: '01/01/2020',
        userLastStatus: 'Juan',
        units: 457
      },
      {
        id: 19,
        type: 'Defectuoso',
        provider: 'Zapatería S.L.',
        brands: 'Adidas',
        dateLimit: '01/01/2020',
        warehouse: '601',
        status: 'En Proceso',
        dateLastStatus: '01/01/2020',
        userLastStatus: 'Juan',
        units: 457
      },
      {
        id: 20,
        type: 'Defectuoso',
        provider: 'Zapatería S.L.',
        brands: 'Adidas',
        dateLimit: '01/01/2020',
        warehouse: '601',
        status: 'En Proceso',
        dateLastStatus: '01/01/2020',
        userLastStatus: 'Juan',
        units: 457
      }
    ];
    this.paginator.pageSizeOptions = [20, 50, 100];
    this.paginator.length = this.returns.length;
  }

}
