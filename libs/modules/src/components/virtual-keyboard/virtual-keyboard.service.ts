import { EventEmitter, Injectable } from '@angular/core';
import { VirtualKeyboardComponent } from './virtual-keyboard.component';
import { PopoverController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class VirtualKeyboardService {

  eventEmitter = new EventEmitter();
  aKeyboardIsOpen: boolean = false;

  constructor(
    private popoverController: PopoverController
  ) {}

  async openVirtualKeyboard(options: {dataList?: any[], type: Number, layout_type?: 'qwerty'|'number', placeholder?: string, initialValue?: string}, callbackOnDidDismiss?) {
    const params: any = {
      eventOnKeyPress: this.eventEmitter,
      type: options.type,
      layout_type: options.layout_type || 'qwerty',
      data: options.dataList || []
    };
    if (options.placeholder) {
      params.placeholder = options.placeholder;
    }
    if (options.initialValue) {
      params.initialValue = options.initialValue;
    }

    const popover = await this.popoverController.create({
      component: VirtualKeyboardComponent,
      translucent: true,
      componentProps: params,
      cssClass: 'virtual-keyboard-component'
    });

    if (callbackOnDidDismiss) {
      popover.onDidDismiss().then(() => {
        this.aKeyboardIsOpen = false;
        callbackOnDidDismiss();
      });
    }

    await popover.present().then(() => this.aKeyboardIsOpen = true);

    setTimeout(() => this.aKeyboardIsOpen = false, 800);

    return popover;
  }
}
