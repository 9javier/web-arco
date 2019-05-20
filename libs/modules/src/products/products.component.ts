import { Component, OnInit } from '@angular/core';
import {
  ProductModel,
  ProductsService
} from '@suite/services';

import {HttpResponse} from '@angular/common/http';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})

export class ProductsComponent implements OnInit {
  products: ProductModel.Product[] = [];
  displayedColumns: string[] = ['reference', 'initialWarehouse', 'model', 'size'];

  constructor(
    private productsService: ProductsService,
  ) {}

  ngOnInit() {
    this.initProducts();
  }

  initProducts(){
    Promise.all([
      this.productsService.getIndex()
    ]).then(
      (data: any) => {
        data[0].subscribe(
          (res: HttpResponse<ProductModel.ResponseIndex>) => {
            this.products = res.body.data;
            console.log(this.products);
          });
      },
      err => {
        console.log(err);
      }
    );
  }
}


