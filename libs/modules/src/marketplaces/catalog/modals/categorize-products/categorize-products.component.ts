import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from "@ionic/angular";
@Component({
  selector: 'categorize-products',
  templateUrl: './categorize-products.component.html',
  styleUrls: ['./categorize-products.component.scss']
})
export class CategorizeProductsComponent implements OnInit {

  private selectedProducts = [];
  private selectedCategories;
  private productCategoriesTableData = [
    {
      id: 2,
      name: 'Mujer',
      products: 465
    },
    {
      id: 3,
      name: 'Hombre',
      products: 368
    },
    {
      id: 24,
      name: 'Deportivas de mujer',
      products: 134
    },
    {
      id: 25,
      name: 'Deportivas de plataforma',
      products: 79
    },
    {
      id: 27,
      name: 'Deportivas de hombre',
      products: 102
    },
    {
      id: 26,
      name: 'Deportivas blancas',
      products: 175
    },
    {
      id: 2,
      name: 'Mujer',
      products: 465
    },
    {
      id: 3,
      name: 'Hombre',
      products: 0
    },
    {
      id: 24,
      name: 'Deportivas de mujer',
      products: 134
    },
    {
      id: 25,
      name: 'Deportivas de plataforma',
      products: 79
    },
    {
      id: 27,
      name: 'Deportivas de hombre',
      products: 1
    },
    {
      id: 26,
      name: 'Deportivas blancas',
      products: 175
    },
  ];
  private productCategoriesTableHeader: string[] = ['select', 'id', 'name', 'products'];

  constructor(
    private modalController: ModalController,
    private navParams: NavParams

  ) {

  }

  ngOnInit() {
    this.selectedProducts = this.navParams.get('selectedProducts');
    this.selectedCategories = [];
  }

  close() {
    this.modalController.dismiss();
  }

  selectCategoryRow(category) {
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories.splice(this.selectedCategories.indexOf(category), 1);
    } else {
      this.selectedCategories.push(category);
      this.selectedCategories.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
    }
    console.log(this.selectedCategories);
  }

  associateCategories() {

  }

  unlink() {

  }
}
