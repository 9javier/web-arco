import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { ProductModel, ProductsService } from '@suite/services';
import Product = ProductModel.Product;
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { PredistributionsService } from '../../../services/src/lib/endpoint/predistributions/predistributions.service';

@Component({
  selector: 'suite-new-products',
  templateUrl: './new-products.component.html',
  styleUrls: ['./new-products.component.scss'],
})
export class NewProductsComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['select', 'reference', 'model', 'color', 'size'];
  dataSource;
  selection = new SelectionModel<Product>(true, []);
  constructor(
    private productsService: ProductsService
  ) {
    this.productsService.getIndex().then((ELEMENT_DATA) => {
      console.log(ELEMENT_DATA);
      // this.dataSource = new MatTableDataSource<ProductModel.ResponseIndex>(ELEMENT_DATA);
    });
  }

  ngOnInit() {
    this.paginator._intl.itemsPerPageLabel = 'Ver';
    this.paginator._intl.getRangeLabel = this.getRangeLabel;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data ? this.dataSource.data.length : 0;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: Product): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  printProduct() {

  }

  getRangeLabel = (page: number, pageSize: number, length: number) =>  {
    if (length === 0 || pageSize === 0) {
      return `0 / ${length}`;
    }
    length = Math.max(length, 0);
    return `${length} resultados / pág. ${page + 1} de ${Math.ceil(length / pageSize)}`;
  };
}
