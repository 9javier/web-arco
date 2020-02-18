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
  private selectsPlaceholders = ['Marketplaces', 'Descripción', 'Familia'];
  private tableValueSelect = [
    {
      name: 'Activos',
      type: 1
    },
    {
      name: 'Stocks',
      type: 2
    }
  ];
  private preselect = this.tableValueSelect[0].name;
  private currentType: number = 1;

  constructor() { }

  ngOnInit() {
    this.catalogData = [
      {
        ref: 1,
        model: 'model1',
        brand: 'brand1',
        ko: {
          symbol: '●',
          stock: '120',
          activate: true
        },
        mini: {
          symbol: '',
          stock: '',
          activate: false
        },
        amazon: {
          symbol: '●',
          stock: '452',
          activate: true
        },
        spartoo: {
          symbol: '',
          stock: '',
          activate: false
        },
        zalando: {
          symbol: '●',
          stock: '788',
          activate: true
        },
        cdiscount: {
          symbol: '●',
          stock: '58',
          activate: false
        }
      },
      {
        ref: 2,
        model: 'model2',
        brand: 'brand2',
        ko: {
          symbol: '●',
          stock: '120',
          activate: false
        },
        mini: {
          symbol: '●',
          stock: '234',
          activate: true
        },
        amazon: {
          symbol: '',
          stock: ''
        },
        spartoo: {
          symbol: '●',
          stock: '333',
          activate: false
        },
        zalando: {
          symbol: '',
          stock: ''
        },
        cdiscount: {
          symbol: '●',
          stock: '858',
          activate: true
        }
      }
    ];
    this.catalogTableData = new MatTableDataSource(this.catalogData);
    this.catalogTableHeader = ['select', 'ref', 'model', 'brand', 'KO', 'Mini', 'Amazon', 'Spartoo', 'Zalando', 'CDiscount'];
    this.selectedProducts = [];
  }

  selectProductRow(row) {
    console.log(row);
  }

  getType(type) {
    this.currentType = type;
  }

  exportToExcel() {
    console.log('Export to Excel');
  }
}
