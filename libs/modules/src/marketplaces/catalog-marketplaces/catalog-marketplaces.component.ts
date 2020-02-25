import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import * as XLSX from 'xlsx';

@Component({
  selector: 'suite-catalog-marketplaces',
  templateUrl: './catalog-marketplaces.component.html',
  styleUrls: ['./catalog-marketplaces.component.scss']
})

export class CatalogMarketplacesComponent implements OnInit {

  @ViewChild('TABLE') table: ElementRef;
  private catalogData;
  private products: any[];
  private catalogTableData;
  private catalogTableHeader;
  private selectedProducts;
  private selectsPlaceholders = ['Marketplaces', 'Descripción', 'Familia'];
  private marketplaces = [
    {
      name: 'Marketplaces',
      marketId: '-'
    },
    {
      name: 'KO',
      marketId: '1'
    },
    {
      name: 'Mini',
      marketId: '2'
    },
    {
      name: 'Amazon',
      marketId: '3'
    },
    {
      name: 'Spartoo',
      marketId: '4'
    },
    {
      name: 'Zalando',
      marketId: '5'
    },
    {
      name: 'Cdiscount',
      marketId: '6'
    }
  ];
  private description = ['Descripción'];
  private family = ['Familia', 'Hombre', 'Mujer', 'Niño', 'Niña'];
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
  private actionPreselect = this.tableValueSelect[0].name;
  private marketPreselect = this.marketplaces[0].name;
  private descriptionPreselect = this.description[0];
  private familyPreselect = this.family[0];
  private currentType: number = 1;

  constructor() { }

  ngOnInit() {
    this.getProducts();
    this.catalogTableData = new MatTableDataSource(this.products);
    this.catalogTableHeader = ['select', 'ref', 'model', 'brand', 'KO', 'Mini', 'Amazon', 'Spartoo', 'Zalando', 'CDiscount'];
    this.selectedProducts = [];
  }

  getProducts() {
    this.products = [
      {
        reference: '123456',
        name: 'test',
        brand: 'brand test',
        description: 'description test',
        familfy: 'family test',
        marketplaces: [
          {
            marketId: '1',
            avaible: true,
            status: 'active'
          },
          {
            marketId: '3',
            avaible: true,
            status: 'sadasdada'
          },
          
          {
            marketId: '5',
            avaible: true,
            status: 'active'
          }
        ],
        stocks: [
          {
            marketId: '1',
            stock: 123
          },
          {
            marketId: '3',
            stock: 12312
          },
          {
            marketId: '5',
            stock: 5654
          }
        ]
      },
      {
        reference: '987606',
        name: 'test 2',
        brand: 'brand test 2',
        description: 'description test 2',
        familfy: 'family test 2',
        marketplaces: [
          {
            marketId: '2',
            avaible: true,
            status: 'asdasd'
          },
          {
            marketId: '6',
            avaible: true,
            status: 'active'
          }
        ],
        stocks: [
          {
            marketId: '2',
            stock: 654
          },
          {
            marketId: '6',
            stock: 453543
          }
        ]
      }
    ];
  }

  selectProductRow(row) {
    console.log(row);
  }

  getType(type) {
    this.currentType = type;
  }

  getMarket(filterMarket) {
    let filteredMarket = [];

    if(filterMarket.marketId !== '-') {
      this.products.forEach(product => {
        product.marketplaces.forEach(market => {
          if(market.marketId == filterMarket.marketId) {
            filteredMarket.push(product);
          }
        });
      });
      this.catalogTableData = new MatTableDataSource(filteredMarket);
    } else {
      this.catalogTableData = new MatTableDataSource(this.products);
    }
  }
  
  getDescription(description) {
    console.log(description)
  }

  getFamily(family) {
    console.log(family)
  }

  exportToExcel() {
    console.log(this.table)
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'catalog-marketplaces');
    
    XLSX.writeFile(wb, 'catalog-marketplaces.xlsx');
  }
  
}
