import { EventEmitter, Injectable } from '@angular/core';
import { VirtualKeyboardComponent } from './virtual-keyboard.component';
import { PopoverController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class VirtualKeyboardService {

  eventEmitter = new EventEmitter();

  constructor(
    private popoverController: PopoverController
  ) {}

  async openVirtualKeyboard(dataList: any[], type: Number) {
    const popover = await this.popoverController.create({
      component: VirtualKeyboardComponent,
      translucent: true,
      componentProps: { eventOnKeyPress: this.eventEmitter, data: dataList, type: type },
      cssClass: 'virtual-keyboard-component'
    });

    await popover.present();
    return popover;
  }
}
