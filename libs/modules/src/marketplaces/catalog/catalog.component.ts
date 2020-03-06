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
  private products;
  private market;

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private marketplacesService: MarketplacesService
  ) {
    switch (this.route.snapshot.data['name']) {
      case "Miniprecios":
        this.market = "1";
        break;
    }
  }

  ngOnInit() {
    this.catalogData = [];
    this.catalogTableHeader = ['select', 'ref', 'model', 'brand', 'color', 'family', 'description', 'pvp', 'discount', 'units', 'active'];
    this.selectedProducts = [];
    this.getProducts();
  }

  getProducts() {
    this.marketplacesService.getProductCatalog().subscribe(data => {
      let serverData = data.data;
      for (let product of serverData) {
        for (let productMarket of product.productsMarkets) {
          if (productMarket.market.id == this.market && productMarket.onboardStatus == '1') {
            this.catalogData.push({
              ref: product.reference,
              model: product.model,
              brand: product.brand,
              color: product.color ? product.color : '-',
              family: product.family ? product.family : '-',
              description: product.description ? product.description : '-',
              pvp: productMarket.price ? productMarket.price : '-',
              discount: productMarket.discount ? productMarket.discount : '-',
              units: productMarket.stock,
              active: productMarket.available
            });
          }
        }
      }
      this.catalogData.sort((a, b) => (a.ref.length > b.ref.length) ? 1 : ((b.ref.length > a.ref.length) ? -1 : ((parseInt(a.ref) > parseInt(b.ref)) ? 1 : ((parseInt(b.ref) > parseInt(a.ref)) ? -1 : 0))));

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
