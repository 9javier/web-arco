import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import * as XLSX from 'xlsx';
import { MarketplacesService } from 'libs/services/src/lib/endpoint/marketplaces/marketplaces.service';

@Component({
  selector: 'suite-catalog-marketplaces',
  templateUrl: './catalog-marketplaces.component.html',
  styleUrls: ['./catalog-marketplaces.component.scss']
})

export class CatalogMarketplacesComponent implements OnInit {

  @ViewChild('catalogTable') table: ElementRef;

  private products;
  private unFilteredProducts;
  private catalogTableData;
  private catalogTableHeader;
  private selectedProducts;
  private marketplaces;
  private descriptions;
  private families;
  private actions;
  private actionSelected;
  private marketSelected;
  private descriptionSelected;
  private familySelected;

  constructor(
    private marketplacesService: MarketplacesService
  ) { }

  ngOnInit() {
    this.catalogTableHeader = ['select', 'ref', 'model', 'brand', 'KO', 'Mini', 'Amazon', 'Spartoo', 'Zalando', 'CDiscount'];

    this.products = [];
    this.selectedProducts = [];

    this.actions = [
      {
        id: 1,
        name: 'Activos'
      },
      {
        id: 2,
        name: 'Stocks'
      }
    ];
    this.actionSelected = this.actions[0].id;

    this.marketplaces = [{id: 0, name: 'Marketplaces'}];
    this.marketSelected = this.marketplaces[0].id;

    this.descriptions = [{id: 0, name: 'Descripción'}];
    this.descriptionSelected = this.descriptions[0].id;

    this.families = [{id: 0, name: 'Familia'}];
    this.familySelected = this.families[0].id;

    this.marketplacesService.getProductCatalog().subscribe(data => {
      this.products = data.data;
      this.products.sort((a, b) => (a.reference.length > b.reference.length) ? 1 : ((b.reference.length > a.reference.length) ? -1 : ((parseInt(a.reference) > parseInt(b.reference)) ? 1 : ((parseInt(b.reference) > parseInt(a.reference)) ? -1 : 0))));
      this.unFilteredProducts = this.products.slice();

      this.catalogTableData = new MatTableDataSource(this.products);

      for (let product of this.products) {
        for (let productMarket of product.productsMarkets) {
          if (!this.marketplaces.some(e => e.id == productMarket.market.id)) {
            this.marketplaces.push({id: productMarket.market.id, name: productMarket.market.name});
          }
        }
      }

    });

  }

  selectProductRow(row) {
    console.log(row);
  }

  changeSelectedFilters() {
    this.products = this.unFilteredProducts.slice();

    if (this.marketSelected != 0) {
      let filteredProducts = [];

      for (let product of this.products) {
        for (let productMarket of product.productsMarkets) {
          if (productMarket.market.id == this.marketSelected) {
            filteredProducts.push(product);
          }
        }
      }
      this.products = filteredProducts.slice();
    }

    if (this.descriptionSelected != 0) {
      let filteredProducts = [];

      for (let product of this.products) {
        if (product.description == this.descriptionSelected) {
          filteredProducts.push(product);
        }
      }
      this.products = filteredProducts.slice();
    }

    if (this.familySelected != 0) {
      let filteredProducts = [];

      for (let product of this.products) {
        if (product.family == this.familySelected) {
          filteredProducts.push(product);
        }
      }
      this.products = filteredProducts.slice();
    }

    this.catalogTableData = new MatTableDataSource(this.products);
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    for (let i = 0; i < this.products.length + 1; i++) {
      ws['A' + (i + 1)].t = ws['B' + (i + 1)].t;
      ws['B' + (i + 1)].t = ws['C' + (i + 1)].t;
      ws['C' + (i + 1)].t = ws['D' + (i + 1)].t;
      ws['D' + (i + 1)].t = ws['E' + (i + 1)].t;
      ws['E' + (i + 1)].t = ws['F' + (i + 1)].t;
      ws['F' + (i + 1)].t = ws['G' + (i + 1)].t;
      ws['G' + (i + 1)].t = ws['H' + (i + 1)].t;
      ws['H' + (i + 1)].t = ws['I' + (i + 1)].t;
      ws['I' + (i + 1)].t = ws['J' + (i + 1)].t;
      ws['A' + (i + 1)].v = ws['B' + (i + 1)].v;
      ws['B' + (i + 1)].v = ws['C' + (i + 1)].v;
      ws['C' + (i + 1)].v = ws['D' + (i + 1)].v;
      ws['D' + (i + 1)].v = ws['E' + (i + 1)].v;
      ws['E' + (i + 1)].v = ws['F' + (i + 1)].v;
      ws['F' + (i + 1)].v = ws['G' + (i + 1)].v;
      ws['G' + (i + 1)].v = ws['H' + (i + 1)].v;
      ws['H' + (i + 1)].v = ws['I' + (i + 1)].v;
      ws['I' + (i + 1)].v = ws['J' + (i + 1)].v;
      delete ws['J' + (i + 1)];
    }
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'catalog-marketplaces');
    
    XLSX.writeFile(wb, 'catalog-marketplaces.xlsx');
  }
  
}
