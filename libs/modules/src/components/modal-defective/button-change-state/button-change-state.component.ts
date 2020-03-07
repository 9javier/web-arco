import { Component, Input, OnInit } from '@angular/core';
import { ChangeStateComponent } from '../change-state/change-state.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'suite-button-change-state',
  templateUrl: './button-change-state.component.html',
  styleUrls: ['./button-change-state.component.scss'],
})
export class ButtonChangeStateComponent implements OnInit {
  @Input() registry: any;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {}

  async close() {
    await this.modalController.dismiss();
  }

  async changeState() {
    this.close().then(async () => {
      const modal = await this.modalController.create({
        component: ChangeStateComponent,
        componentProps: {
          registry: this.registry
        }
      });

      return await modal.present();
    });
  }
}
