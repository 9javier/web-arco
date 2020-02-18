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
          stock: '120'
        },
        mini: {
          symbol: '',
          stock: ''
        },
        amazon: {
          symbol: '●',
          stock: ''
        },
        spartoo: {
          symbol: '',
          stock: '452'
        },
        zalando: {
          symbol: '●',
          stock: '788'
        },
        cdiscount: {
          symbol: '',
          stock: '58'
        }
      },
      {
        ref: 2,
        model: 'model2',
        brand: 'brand2',
        ko: {
          symbol: '',
          stock: '120'
        },
        mini: {
          symbol: '●',
          stock: '234'
        },
        amazon: {
          symbol: '●',
          stock: '444'
        },
        spartoo: {
          symbol: '●',
          stock: ''
        },
        zalando: {
          symbol: '●',
          stock: ''
        },
        cdiscount: {
          symbol: '●',
          stock: '858'
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
