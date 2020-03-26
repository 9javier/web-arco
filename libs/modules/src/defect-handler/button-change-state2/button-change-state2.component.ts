import { Component, Input, OnInit } from '@angular/core';
import { ChangeState2Component } from '../change-state2/change-state2.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'suite-button-change-state2',
  templateUrl: './button-change-state2.component.html',
  styleUrls: ['./button-change-state2.component.scss'],
})
export class ButtonChangeState2Component implements OnInit {
  @Input() registry: any;
  @Input() showChangeState: boolean;

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
        component: ChangeState2Component,
        componentProps: {
          registry: this.registry,
          showChangeState: this.showChangeState
        }
      });

      return await modal.present();
    });
  
  
    


  
  }



}
