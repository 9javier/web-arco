import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';

import {
  ProductModel,
  ProductsService,
  FiltersService
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
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild(MatSort) sort: MatSort;

  constructor(
    private filterServices:FiltersService,
    private productsService: ProductsService,
  ) {}

  ngOnInit() {
    this.initProducts();
    this.getColors();
  }

  /**
   * get colors to using in filters
   */
  getColors():void{
    this.filterServices.getColors().subscribe(colors=>{
    });
  }

  initProducts(){
    Promise.all([
      this.productsService.getIndex()
    ]).then(
      (data: any) => {
        data[0].subscribe(
          (res: HttpResponse<ProductModel.ResponseIndex>) => {
            this.products = res.body.data;
            this.dataSource = new MatTableDataSource<ProductModel.Product>(res.body.data);
            this.dataSource.paginator = this.paginator;
            console.log(this.products);
          });
      },
      err => {
        console.log(err);
      }
    );
  }
}


