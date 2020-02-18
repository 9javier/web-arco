import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'suite-catalog-marketplaces',
  templateUrl: './catalog-marketplaces.component.html',
  styleUrls: ['./catalog-marketplaces.component.scss']
})

export class CatalogMarketplacesComponent implements OnInit {

  private catalogData;
  private catalogTableData;
  private catalogTableHeader;
  private selectedProducts;
  private selectsPlaceholders = ['Marketplaces', 'Descripción', 'Familia', 'Activos'];

  constructor() { }

  ngOnInit() {
    this.catalogData = [
      {
        ref: 1,
        model: 'model1',
        brand: 'brand1',
        ko: 'x',
        mini: '',
        amazon: 'x',
        spartoo: '',
        zalando: '',
        cdiscount: 'x'
      },
      {
        ref: 2,
        model: 'model2',
        brand: 'brand2',
        ko: 'x',
        mini: 'x',
        amazon: '',
        spartoo: '',
        zalando: 'x',
        cdiscount: 'x'
      }
    ];
    this.catalogTableData = new MatTableDataSource(this.catalogData);
    this.catalogTableHeader = ['select', 'ref', 'model', 'brand', 'KO', 'Mini', 'Amazon', 'Spartoo', 'Zalando', 'CDiscount'];
    this.selectedProducts = [];
  }

  selectProductRow(row) {
  console.log(row)    
  }
}
