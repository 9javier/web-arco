import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import * as XLSX from 'xlsx';
import { MarketplacesService } from 'libs/services/src/lib/endpoint/marketplaces/marketplaces.service';
import {interval} from "rxjs";

@Component({
  selector: 'suite-catalog-marketplaces',
  templateUrl: './catalog-marketplaces.component.html',
  styleUrls: ['./catalog-marketplaces.component.scss']
})

export class CatalogMarketplacesComponent implements OnInit {

  @ViewChild('catalogTable') table: ElementRef;

  private static readonly MINI_MARKET_ID = '406A51C8-EA12-4D6D-B05D-C2EA70A1A609';

  private static readonly NOT_IN_MARKET = 0;
  private static readonly INVALID = 1;
  private static readonly VALID = 2;
  private static readonly VALID_DISABLED = 3;
  private static readonly UPLOADED = 4;
  private static readonly UPLOADED_DISABLED = 5;
  private static readonly MARKET_UPLOADING_ERROR = 6;
  private static readonly INVALID_BUT_PRODUCTS_UPLOADED = 7;
  private static readonly INVALID_BUT_DISABLED_PRODUCTS_UPLOADED = 8;

  products;
  unFilteredProducts;
  catalogTableData;
  catalogTableHeader;
  selectedProducts;
  marketplaces;
  descriptions;
  families;
  actions;
  actionSelected;
  marketSelected;
  descriptionSelected;
  familySelected;
  searchReference;
  searchModel;
  searchBrand;
  searchKO;
  searchMini;
  searchAmazon;
  searchSpartoo;
  searchZalando;
  searchCDiscount;
  statusKO;
  statusMini;
  statusAmazon;
  statusSpartoo;
  statusZalando;
  statusCDiscount;
  status;
  refresher;

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

    this.status = [
      {id: 0, name: '-'},
      {id: 1, name: 'Error de mapeo (no subido)'},
      {id: 2, name: 'Válido (no subido)'},
      {id: 3, name: 'Válido y desactivado (no subido)'},
      {id: 4, name: 'Subido a market'},
      {id: 5, name: 'Subido a market y desactivado'},
      {id: 6, name: 'Error de sincronización (no subido)'},
      {id: 7, name: 'Error de mapeo (subido, producto desactualizado)'},
      {id: 7, name: 'Error de mapeo (subido, producto desactivado desactualizado)'}
    ];

    this.statusKO = 0;
    this.statusMini = 0;
    this.statusAmazon = 0;
    this.statusSpartoo = 0;
    this.statusZalando = 0;
    this.statusCDiscount = 0;

    this.marketplacesService.getProductCatalog().subscribe(data => {
      this.products = data;
      this.products.sort((a, b) => (a.reference.length > b.reference.length) ? 1 : ((b.reference.length > a.reference.length) ? -1 : ((parseInt(a.reference) > parseInt(b.reference)) ? 1 : ((parseInt(b.reference) > parseInt(a.reference)) ? -1 : 0))));
      this.unFilteredProducts = this.products.slice();

      for (let product of this.products) {

        product.stockKO = 0;
        product.stockMini = 0;
        product.stockAmazon = 0;
        product.stockSpartoo = 0;
        product.stockZalando = 0;
        product.stockCDiscount = 0;

        for (let productVariation of product.productVariations) {
          switch (productVariation.market.externalId) {
            case CatalogMarketplacesComponent.MINI_MARKET_ID:
              product.stockMini += productVariation.stock;
              break;
          }
        }

        product.statusKO = CatalogMarketplacesComponent.NOT_IN_MARKET;
        product.statusMini = CatalogMarketplacesComponent.NOT_IN_MARKET;
        product.statusAmazon = CatalogMarketplacesComponent.NOT_IN_MARKET;
        product.statusSpartoo = CatalogMarketplacesComponent.NOT_IN_MARKET;
        product.statusZalando = CatalogMarketplacesComponent.NOT_IN_MARKET;
        product.statusCDiscount = CatalogMarketplacesComponent.NOT_IN_MARKET;

        for (let productMarket of product.productsMarkets) {
          let status = CatalogMarketplacesComponent.NOT_IN_MARKET;

          switch (productMarket.status) {
            case 0:
              status = CatalogMarketplacesComponent.INVALID;
              break;

            case 1:
              status = CatalogMarketplacesComponent.VALID;
              break;

            case 2:
              status = CatalogMarketplacesComponent.VALID_DISABLED;
              break;

            case 3:
              status = CatalogMarketplacesComponent.UPLOADED;
              break;

            case 4:
              status = CatalogMarketplacesComponent.UPLOADED_DISABLED;
              break;

            case 5:
              status = CatalogMarketplacesComponent.MARKET_UPLOADING_ERROR;
              break;

            case 6:
              status = CatalogMarketplacesComponent.INVALID_BUT_PRODUCTS_UPLOADED;
              break;

            case 7:
              status = CatalogMarketplacesComponent.INVALID_BUT_DISABLED_PRODUCTS_UPLOADED;
              break;
          }

          switch (productMarket.market.externalId) {
            case CatalogMarketplacesComponent.MINI_MARKET_ID:
              product.statusMini = status;
              break;
          }

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

      this.catalogTableData = new MatTableDataSource(this.products);

    });

    this.refresher = setInterval(() => {

      this.marketplaces = [{id: 0, name: 'Marketplaces'}];
      this.descriptions = ['Descripción'];
      this.families = ['Familia'];

      this.marketplacesService.getProductCatalog().subscribe(data => {
        this.products = data;
        this.products.sort((a, b) => (a.reference.length > b.reference.length) ? 1 : ((b.reference.length > a.reference.length) ? -1 : ((parseInt(a.reference) > parseInt(b.reference)) ? 1 : ((parseInt(b.reference) > parseInt(a.reference)) ? -1 : 0))));
        this.unFilteredProducts = this.products.slice();

        for (let product of this.products) {

          product.stockKO = 0;
          product.stockMini = 0;
          product.stockAmazon = 0;
          product.stockSpartoo = 0;
          product.stockZalando = 0;
          product.stockCDiscount = 0;

          for (let productVariation of product.productVariations) {
            switch (productVariation.market.externalId) {
              case CatalogMarketplacesComponent.MINI_MARKET_ID:
                product.stockMini += productVariation.stock;
                break;
            }
          }

          product.statusKO = CatalogMarketplacesComponent.NOT_IN_MARKET;
          product.statusMini = CatalogMarketplacesComponent.NOT_IN_MARKET;
          product.statusAmazon = CatalogMarketplacesComponent.NOT_IN_MARKET;
          product.statusSpartoo = CatalogMarketplacesComponent.NOT_IN_MARKET;
          product.statusZalando = CatalogMarketplacesComponent.NOT_IN_MARKET;
          product.statusCDiscount = CatalogMarketplacesComponent.NOT_IN_MARKET;

          for (let productMarket of product.productsMarkets) {
            let status = CatalogMarketplacesComponent.NOT_IN_MARKET;

            switch (productMarket.status) {
              case 0:
                status = CatalogMarketplacesComponent.INVALID;
                break;

              case 1:
                status = CatalogMarketplacesComponent.VALID;
                break;

              case 2:
                status = CatalogMarketplacesComponent.VALID_DISABLED;
                break;

              case 3:
                status = CatalogMarketplacesComponent.UPLOADED;
                break;

              case 4:
                status = CatalogMarketplacesComponent.UPLOADED_DISABLED;
                break;

              case 5:
                status = CatalogMarketplacesComponent.MARKET_UPLOADING_ERROR;
                break;

              case 6:
                status = CatalogMarketplacesComponent.INVALID_BUT_PRODUCTS_UPLOADED;
                break;

              case 7:
                status = CatalogMarketplacesComponent.INVALID_BUT_DISABLED_PRODUCTS_UPLOADED;
                break;
            }

            switch (productMarket.market.externalId) {
              case CatalogMarketplacesComponent.MINI_MARKET_ID:
                product.statusMini = status;
                break;
            }

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

        this.catalogTableData = new MatTableDataSource(this.products);

      });
    }, 60000);

  }

  ngOnDestroy() {
    if (this.refresher) {
      clearInterval(this.refresher);
    }
  }

  selectProductRow(row) {
    console.log(row);
  }

  changeAction() {

    this.statusKO = 0;
    this.statusMini = 0;
    this.statusAmazon = 0;
    this.statusSpartoo = 0;
    this.statusZalando = 0;
    this.statusCDiscount = 0;

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

  changeSearchStatus(market) {
    this.statusKO = (market == 'KO') ? this.statusKO : 0;
    this.statusMini = (market == 'Mini') ? this.statusMini : 0;
    this.statusAmazon = (market == 'Amazon') ? this.statusAmazon : 0;
    this.statusSpartoo = (market == 'Spartoo') ? this.statusSpartoo : 0;
    this.statusZalando = (market == 'Zalando') ? this.statusZalando : 0;
    this.statusCDiscount = (market == 'CDiscount') ? this.statusCDiscount : 0;

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

    if (this.statusKO != 0) {
      let products = [];
      for (let product of this.products) {
        if (product.statusKO == this.statusKO) {
          products.push(product);
        }
      }
      this.products = products.slice();
    }

    if (this.statusMini != 0) {
      let products = [];
      for (let product of this.products) {
        if (product.statusMini == this.statusMini) {
          products.push(product);
        }
      }
      this.products = products.slice();
    }

    if (this.statusAmazon != 0) {
      let products = [];
      for (let product of this.products) {
        if (product.statusAmazon == this.statusAmazon) {
          products.push(product);
        }
      }
      this.products = products.slice();
    }

    if (this.statusSpartoo != 0) {
      let products = [];
      for (let product of this.products) {
        if (product.statusSpartoo == this.statusSpartoo) {
          products.push(product);
        }
      }
      this.products = products.slice();
    }

    if (this.statusZalando != 0) {
      let products = [];
      for (let product of this.products) {
        if (product.statusZalando == this.statusZalando) {
          products.push(product);
        }
      }
      this.products = products.slice();
    }

    if (this.statusCDiscount != 0) {
      let products = [];
      for (let product of this.products) {
        if (product.statusCDiscount == this.statusCDiscount) {
          products.push(product);
        }
      }
      this.products = products.slice();
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
          if (product.stockKO.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchKO.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
            !== -1) {
            products.push(product);
          }
        }
        this.products = products.slice();
      }

      if (this.searchMini != "" && this.searchMini.trim() != "") {
        let products = [];
        for (let product of this.products) {
          if (product.stockMini.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchMini.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
            !== -1) {
            products.push(product);
          }
        }
        this.products = products.slice();
      }

      if (this.searchAmazon != "" && this.searchAmazon.trim() != "") {
        let products = [];
        for (let product of this.products) {
          if (product.stockAmazon.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchAmazon.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
            !== -1) {
            products.push(product);
          }
        }
        this.products = products.slice();
      }

      if (this.searchSpartoo != "" && this.searchSpartoo.trim() != "") {
        let products = [];
        for (let product of this.products) {
          if (product.stockSpartoo.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchSpartoo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
            !== -1) {
            products.push(product);
          }
        }
        this.products = products.slice();
      }

      if (this.searchZalando != "" && this.searchZalando.trim() != "") {
        let products = [];
        for (let product of this.products) {
          if (product.stockZalando.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchZalando.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
            !== -1) {
            products.push(product);
          }
        }
        this.products = products.slice();
      }

      if (this.searchCDiscount != "" && this.searchCDiscount.trim() != "") {
        let products = [];
        for (let product of this.products) {
          if (product.stockCDiscount.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchCDiscount.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
            !== -1) {
            products.push(product);
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
