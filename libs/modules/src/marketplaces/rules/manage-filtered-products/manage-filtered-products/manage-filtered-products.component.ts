import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'suite-manage-filtered-products',
  templateUrl: './manage-filtered-products.component.html',
  styleUrls: ['./manage-filtered-products.component.scss']
})
export class ManageFilteredProductsComponent implements OnInit {

  productReferences = [
    { 
      name: 'product1',
      reference: 'reference1'
    },
    { 
      name: 'product2',
      reference: 'reference2'
    }
  ];

  displayedColumns: string[] = ['name', 'reference', 'delete'];
  dataSource  = new MatTableDataSource(this.productReferences);

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  close(data) {
    this.modalController.dismiss(data);
  }

  deleteProduct(product) {
    for(let i = 0; i < this.productReferences.length; i++) {
      if(this.productReferences[i].reference == product.reference) {
        this.productReferences.splice(i, 1);
      }
    }

    this.dataSource.data = this.productReferences;
  }

}
