import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'suite-manage-filtered-products',
  templateUrl: './manage-filtered-products.component.html',
  styleUrls: ['./manage-filtered-products.component.scss']
})
export class ManageFilteredProductsComponent implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  close(data) {
    this.modalController.dismiss(data);
  }

}
