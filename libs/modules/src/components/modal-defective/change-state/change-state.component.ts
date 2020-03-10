import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from "@ionic/angular";
import { RegistryDetailsComponent } from '../registry-details/registry-details.component';

@Component({
  selector: 'suite-change-state',
  templateUrl: './change-state.component.html',
  styleUrls: ['./change-state.component.scss']
})
export class ChangeStateComponent implements OnInit {
  registry;

  constructor(
    private modalController: ModalController,
    private navParams: NavParams,
  ) {
    this.registry = this.navParams.get("registry");
  }

  async close() {
    await this.modalController.dismiss().then(async () => {
      const modal = await this.modalController.create({
        component: RegistryDetailsComponent,
        componentProps: {
          productId: this.registry.product.id,
          showChangeState: true
        }
      });

      return await modal.present();
    });
  }

  ngOnInit() {

  }
}
