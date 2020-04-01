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
  private searchReference;
  private searchModel;
  private searchBrand;
  private searchKO;
  private searchMini;
  private searchAmazon;
  private searchSpartoo;
  private searchZalando;
  private searchCDiscount;

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

    this.descriptions = ['Descripción'];
    this.descriptionSelected = this.descriptions[0];

    this.families = ['Familia'];
    this.familySelected = this.families[0];

    this.searchReference = "";
    this.searchModel = "";
    this.searchBrand = "";
    this.searchKO = "";
    this.searchMini = "";
    this.searchAmazon = "";
    this.searchSpartoo = "";
    this.searchZalando = "";
    this.searchCDiscount = "";

    this.marketplacesService.getProductCatalog().subscribe(data => {
      this.products = data;
      this.products.sort((a, b) => (a.reference.length > b.reference.length) ? 1 : ((b.reference.length > a.reference.length) ? -1 : ((parseInt(a.reference) > parseInt(b.reference)) ? 1 : ((parseInt(b.reference) > parseInt(a.reference)) ? -1 : 0))));
      this.unFilteredProducts = this.products.slice();

      this.catalogTableData = new MatTableDataSource(this.products);

      for (let product of this.products) {
        for (let productMarket of product.productsMarkets) {
          if (!this.marketplaces.some(e => e.id == productMarket.market.id)) {
            this.marketplaces.push({id: productMarket.market.id, name: productMarket.market.name});
          }
        }

        if (!this.descriptions.some(e => e == product.description)) {
          this.descriptions.push(product.description);
        }

        if (!this.families.some(e => e == product.family)) {
          this.families.push(product.family);
        }
      }

    });

  }

  selectProductRow(row) {
    console.log(row);
  }

  changeAction() {
    if (this.actionSelected == 1) {
      this.searchKO = "";
      this.searchMini = "";
      this.searchAmazon = "";
      this.searchSpartoo = "";
      this.searchZalando = "";
      this.searchCDiscount = "";
    }

    this.changeSelectedFilters();
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

    if (this.descriptionSelected != 'Descripción') {
      let filteredProducts = [];

      for (let product of this.products) {
        if (product.description == this.descriptionSelected) {
          filteredProducts.push(product);
        }
      }
      this.products = filteredProducts.slice();
    }

    if (this.familySelected != 'Familia') {
      let filteredProducts = [];

      for (let product of this.products) {
        if (product.family == this.familySelected) {
          filteredProducts.push(product);
        }
      }
      this.products = filteredProducts.slice();
    }

    if (this.searchReference != "" && this.searchReference.trim() != "") {
      let products = [];
      for (let product of this.products) {
        if (product.reference.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchReference.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
          !== -1) {
          products.push(product);
        }
      }
      this.products = products.slice();
    }

    if (this.searchModel != "" && this.searchModel.trim() != "") {
      let products = [];
      for (let product of this.products) {
        if (product.model.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchModel.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
          !== -1) {
          products.push(product);
        }
      }
      this.products = products.slice();
    }

    if (this.searchBrand != "" && this.searchBrand.trim() != "") {
      let products = [];
      for (let product of this.products) {
        if (product.brand.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchBrand.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
          !== -1) {
          products.push(product);
        }
      }
      this.products = products.slice();
    }

    if (this.actionSelected == 2) {

      if (this.searchKO != "" && this.searchKO.trim() != "") {
        let products = [];
        for (let product of this.products) {
          for (let productMarket of product.productsMarkets) {
            if (productMarket.market.name == "KrackOnline") {
              if (productMarket.stock.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchKO.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
                !== -1) {
                products.push(product);
              }
              break;
            }
          }
        }
        this.products = products.slice();
      }

      if (this.searchMini != "" && this.searchMini.trim() != "") {
        let products = [];
        for (let product of this.products) {
          for (let productMarket of product.productsMarkets) {
            if (productMarket.market.name == "Miniprecios") {
              if (productMarket.stock.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchMini.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
                !== -1) {
                products.push(product);
              }
              break;
            }
          }
        }
        this.products = products.slice();
      }

      if (this.searchAmazon != "" && this.searchAmazon.trim() != "") {
        let products = [];
        for (let product of this.products) {
          for (let productMarket of product.productsMarkets) {
            if (productMarket.market.name == "Amazon") {
              if (productMarket.stock.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchAmazon.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
                !== -1) {
                products.push(product);
              }
              break;
            }
          }
        }
        this.products = products.slice();
      }

      if (this.searchSpartoo != "" && this.searchSpartoo.trim() != "") {
        let products = [];
        for (let product of this.products) {
          for (let productMarket of product.productsMarkets) {
            if (productMarket.market.name == "Spartoo") {
              if (productMarket.stock.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchSpartoo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
                !== -1) {
                products.push(product);
              }
              break;
            }
          }
        }
        this.products = products.slice();
      }

      if (this.searchZalando != "" && this.searchZalando.trim() != "") {
        let products = [];
        for (let product of this.products) {
          for (let productMarket of product.productsMarkets) {
            if (productMarket.market.name == "Zalando") {
              if (productMarket.stock.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchZalando.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
                !== -1) {
                products.push(product);
              }
              break;
            }
          }
        }
        this.products = products.slice();
      }

      if (this.searchCDiscount != "" && this.searchCDiscount.trim() != "") {
        let products = [];
        for (let product of this.products) {
          for (let productMarket of product.productsMarkets) {
            if (productMarket.market.name == "CDiscount") {
              if (productMarket.stock.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchCDiscount.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
                !== -1) {
                products.push(product);
              }
              break;
            }
          }
        }
        this.products = products.slice();
      }

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
