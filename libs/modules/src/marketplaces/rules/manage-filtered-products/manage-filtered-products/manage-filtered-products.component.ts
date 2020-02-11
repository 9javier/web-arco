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

  private displayedColumns: string[] = ['name', 'reference'];
  private dataSourceReferencesFilter  = new MatTableDataSource(this.productReferences);
  private dataSourceReferencesNotFilter  = new MatTableDataSource(this.productReferences);
  private changeBackground: boolean = false;

  private exceptionsToReturn = [];

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

  getRow(e, row) {
    console.log(e.target.outerHTML)
    console.log(row)
    this.exceptionsToReturn.push(row);
    this.changeBackground = !this.changeBackground;
  }

  accept() {
    console.log('accept')
    console.log(this.exceptionsToReturn)
  }
}
