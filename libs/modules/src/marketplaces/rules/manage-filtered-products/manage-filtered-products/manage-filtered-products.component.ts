import { Component, OnInit, ViewChild } from '@angular/core';
import {ModalController} from '@ionic/angular';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'suite-manage-filtered-products',
  templateUrl: './manage-filtered-products.component.html',
  styleUrls: ['./manage-filtered-products.component.scss']
})
export class ManageFilteredProductsComponent implements OnInit {

  productReferences = [
    { 
      name: 'product1',
      reference: 'reference1',
      type: 'Incluyente'
    },
    { 
      name: 'product2',
      reference: 'reference2',
      type: 'Excluyente'
    },
    { 
      name: 'product1',
      reference: 'reference1',
      type: 'Incluyente'
    },
    { 
      name: 'product2',
      reference: 'reference2',
      type: 'Excluyente'
    },
    { 
      name: 'product1',
      reference: 'reference1',
      type: 'Incluyente'
    },
    { 
      name: 'product2',
      reference: 'reference2',
      type: 'Excluyente'
    }
  ];

  @ViewChild('paginatorReferencesNotFilter') paginatorReferencesNotFilter: MatPaginator;
  @ViewChild('paginatorReferencesFilter') paginatorReferencesFilter: MatPaginator;

  displayedColumns: string[] = ['name', 'reference'];
  dataSourceReferencesFilter  = new MatTableDataSource(this.productReferences);
  dataSourceReferencesNotFilter  = new MatTableDataSource(this.productReferences);

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
    setTimeout(() => this.dataSourceReferencesFilter.paginator = this.paginatorReferencesFilter);
    setTimeout(() => this.dataSourceReferencesNotFilter.paginator = this.paginatorReferencesNotFilter);
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
