import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ModalController} from "@ionic/angular";
import {CategorizeProductsComponent} from "./modals/categorize-products/categorize-products.component";
import {MatTableDataSource} from "@angular/material";

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

  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController
  ) {
    console.log(this.route.snapshot.data['name'])
  }

  ngOnInit() {
    this.getProducts();
    this.catalogTableData = new MatTableDataSource(this.catalogData);
    this.catalogTableHeader = ['select', 'ref', 'model', 'brand', 'color', 'family', 'description', 'pvp', 'discount', 'units', 'active'];
    this.selectedProducts = [];
  }

  getProducts() {
    this.catalogData = [
      {
        ref: 1,
        model: 'model1',
        brand: 'brand1',
        color: 'color1',
        family: 'family1',
        description: 'description1',
        pvp: 22.5,
        discount: 19.5,
        units: 5,
        active: false
      },
      {
        ref: 2,
        model: 'model2',
        brand: 'brand2',
        color: 'color2',
        family: 'family2',
        description: 'description2',
        pvp: 12.5,
        discount: 8.15,
        units: 8,
        active: false
      },
      {
        ref: 3,
        model: 'model3',
        brand: 'brand3',
        color: 'color3',
        family: 'family3',
        description: 'description3',
        pvp: 49.99,
        discount: 24.99,
        units: 13,
        active: true
      },
      {
        ref: 4,
        model: 'model4',
        brand: 'brand4',
        color: 'color4',
        family: 'family4',
        description: 'description4',
        pvp: 38.2,
        discount: 32.79,
        units: 5,
        active: false
      }
    ];
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
