import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import * as XLSX from 'xlsx';
import { MarketplacesService } from 'libs/services/src/lib/endpoint/marketplaces/marketplaces.service';

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

  constructor(
    private marketplacesService: MarketplacesService
  ) { }

  ngOnInit() {
    
    this.marketplacesService.getProductCatalog().subscribe(data => {
        console.log(data)
        this.products = data.data;
        this.catalogTableData = new MatTableDataSource(this.products);
    });
    this.catalogTableHeader = ['select', 'ref', 'model', 'brand', 'KO', 'Mini', 'Amazon', 'Spartoo', 'Zalando', 'CDiscount'];
    this.selectedProducts = [];
  }

  selectProductRow(row) {
    console.log(row);
  }

  getType(type) {
    this.currentType = type;
  }

  getMarket(filterMarket) {
    let filteredMarket = [];

    if(this.products.length > 0 && filterMarket.marketId !== '-') {
      this.products.forEach(product => {
        product.productsMarkets.forEach(market => {
          if(market.marketId == filterMarket.marketId) {
            filteredMarket.push(product);
          }
        });
      });
      this.catalogTableData = new MatTableDataSource(filteredMarket);
    } else if(this.products.length > 0) {
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
