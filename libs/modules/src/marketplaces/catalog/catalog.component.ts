import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ModalController} from "@ionic/angular";
import {CategorizeProductsComponent} from "./modals/categorize-products/categorize-products.component";
import {MatTableDataSource} from "@angular/material";
import {MarketplacesService} from "../../../../services/src/lib/endpoint/marketplaces/marketplaces.service";

@Component({
  selector: 'suite-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  private catalogData;
  private catalogTableData;
  private catalogTableHeader;
  private selectedProducts;
  private market;
  private unfilteredCatalogData;

  private searchReference;
  private searchModel;
  private searchBrand;
  private searchColor;
  private searchFamily;
  private searchDescription;
  private searchPrice;
  private searchDiscount;
  private searchStock;

  private refresher;

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private marketplacesService: MarketplacesService
  ) {
  }

  ngOnInit() {

    this.searchReference = "";
    this.searchModel = "";
    this.searchBrand = "";
    this.searchColor = "";
    this.searchFamily = "";
    this.searchDescription = "";
    this.searchPrice = "";
    this.searchDiscount = "";
    this.searchStock = "";

    this.catalogData = [];
    this.catalogTableHeader = ['select', 'ref', 'model', 'brand', 'color', 'family', 'description', 'pvp', 'discount', 'units', 'active'];
    this.selectedProducts = [];
    this.marketplacesService.getMarkets().subscribe((data: any) => {
      this.market = null;
      if (data && data.length) {
        for (let market of data) {
          if (this.route.snapshot.data['name'] == market.name) {
            this.market = market.id;
            break;
          }
        }
      }

      this.getProducts();

      this.refresher = setInterval(() => {
        this.getProducts();
        this.changeSelectedFilters()
      }, 60000);

    });

  }

  ngOnDestroy() {
    if (this.refresher) {
      clearInterval(this.refresher);
    }
  }

  changeSelectedFilters() {
    this.catalogData = this.unfilteredCatalogData.slice();

    if (this.searchReference != "" && this.searchReference.trim() != "") {
      let products = [];
      for (let product of this.catalogData) {
        if (product.ref.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchReference.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
          !== -1) {
          products.push(product);
        }
      }
      this.catalogData = products.slice();
    }

    if (this.searchModel != "" && this.searchModel.trim() != "") {
      let products = [];
      for (let product of this.catalogData) {
        if (product.model.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchModel.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
          !== -1) {
          products.push(product);
        }
      }
      this.catalogData = products.slice();
    }

    if (this.searchBrand != "" && this.searchBrand.trim() != "") {
      let products = [];
      for (let product of this.catalogData) {
        if (product.brand.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchBrand.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
          !== -1) {
          products.push(product);
        }
      }
      this.catalogData = products.slice();
    }

    if (this.searchColor != "" && this.searchColor.trim() != "") {
      let products = [];
      for (let product of this.catalogData) {
        if (product.color.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchColor.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
          !== -1) {
          products.push(product);
        }
      }
      this.catalogData = products.slice();
    }

    if (this.searchFamily != "" && this.searchFamily.trim() != "") {
      let products = [];
      for (let product of this.catalogData) {
        if (product.family.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchFamily.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
          !== -1) {
          products.push(product);
        }
      }
      this.catalogData = products.slice();
    }

    if (this.searchDescription != "" && this.searchDescription.trim() != "") {
      let products = [];
      for (let product of this.catalogData) {
        if (product.description.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchDescription.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
          !== -1) {
          products.push(product);
        }
      }
      this.catalogData = products.slice();
    }

    if (this.searchPrice != "" && this.searchPrice.trim() != "") {
      let products = [];
      for (let product of this.catalogData) {
        if (product.pvp.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchPrice.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
          !== -1) {
          products.push(product);
        }
      }
      this.catalogData = products.slice();
    }

    if (this.searchDiscount != "" && this.searchDiscount.trim() != "") {
      let products = [];
      for (let product of this.catalogData) {
        if (product.discount.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchDiscount.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
          !== -1) {
          products.push(product);
        }
      }
      this.catalogData = products.slice();
    }

    if (this.searchStock != "" && this.searchStock.trim() != "") {
      let products = [];
      for (let product of this.catalogData) {
        if (product.units.toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "").search(this.searchStock.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
          !== -1) {
          products.push(product);
        }
      }
      this.catalogData = products.slice();
    }

    this.catalogTableData = new MatTableDataSource(this.catalogData);
  }

  getProducts() {
    this.marketplacesService.getProductCatalog().subscribe(data => {
      for (let product of data) {
        for (let productMarket of product.productsMarkets) {
          if (productMarket.market.id == this.market && productMarket.valid) {
            this.catalogData.push({
              ref: product.reference,
              model: product.model,
              brand: product.brand,
              color: product.color ? product.color : '-',
              family: product.family ? product.family : '-',
              description: product.description ? product.description : '-',
              pvp: productMarket.originalPrice ? parseFloat(productMarket.originalPrice).toFixed(2) : '-',
              discount: productMarket.discountedPrice ? parseFloat(productMarket.discountedPrice).toFixed(2) : '-',
              units: productMarket.stock,
              active: (!productMarket.notSalable && !productMarket.notPublishable)
            });
          }
        }
      }
      this.catalogData.sort((a, b) => (a.ref.length > b.ref.length) ? 1 : ((b.ref.length > a.ref.length) ? -1 : ((parseInt(a.ref) > parseInt(b.ref)) ? 1 : ((parseInt(b.ref) > parseInt(a.ref)) ? -1 : 0))));
      this.unfilteredCatalogData = this.catalogData.slice();

      this.catalogTableData = new MatTableDataSource(this.catalogData);
    });

  }

  selectProductRow(product) {
    if (this.selectedProducts.includes(product)) {
      this.selectedProducts.splice(this.selectedProducts.indexOf(product), 1);
    } else {
      this.selectedProducts.push(product);
      this.selectedProducts.sort((a,b) => (a.ref > b.ref) ? 1 : ((b.ref > a.ref) ? -1 : 0));
    }
    console.log(this.selectedProducts);
  }

  changeProductActive(product) {
    product.active = !product.active;
    console.log(product);
  }

  async openCategoryModal() {
    let modal = await this.modalController.create({
      component: CategorizeProductsComponent,
      componentProps: { selectedProducts: this.selectedProducts }
    });
    return modal.present();
  }

}
