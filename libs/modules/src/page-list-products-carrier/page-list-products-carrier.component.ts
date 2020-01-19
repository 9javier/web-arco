import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ListProductsCarrierComponent } from '../components/list-products-carrier/list-products-carrier.component';

@Component({
  selector: 'suite-page-list-products-carrier',
  templateUrl: './page-list-products-carrier.component.html',
  styleUrls: ['./page-list-products-carrier.component.scss'],
})
export class PageListProductsCarrierComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  async openComponent() {
    let modal = (await this.modalController.create({
      component: ListProductsCarrierComponent,
      componentProps: { carrierReference: 'J0005'}
    }));

    modal.onDidDismiss().then((response) => {

    });

    modal.present();
  }
}
