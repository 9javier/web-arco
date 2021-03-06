import {Component, Input, OnInit} from '@angular/core';
import {Type} from "../../receptions-avelon/enums/type.enum";
import {VirtualKeyboardService} from "../virtual-keyboard/virtual-keyboard.service";
import { app } from '../../../../services/src/environments/environment';

@Component({
  selector: 'size-input',
  templateUrl: './size-input.component.html',
  styleUrls: ['./size-input.component.scss']
})
export class SizeInputComponent implements OnInit {

  @Input() item: {
    id: number,
    number: string,
    name: string,
    reference: string,
    available: boolean,
    quantity: number,
    color: string
  } = null;

  constructor(
    private virtualKeyboardService: VirtualKeyboardService
  ) { }

  ngOnInit() {

  }

  public selectValue(item) {
    if (app.name == 'al') {
      setTimeout(() => {
        (<any>document.getElementById('input_'+item.id)).select();
      }, 200);
    } else {
      const keyboardEventEmitterSubscribe = this.virtualKeyboardService.eventEmitter.subscribe(
        data => {
          if (data.keyPress && data.keyPress != '') {
            item.quantity = parseInt(data.keyPress);
          } else {
            item.quantity = 0;
          }
        }
      );

      this.virtualKeyboardService.openVirtualKeyboard({type: Type.SIZE_INPUT, layout_type: 'number', placeholder: 'Seleccione la cantidad', initialValue: item.quantity.toString()}, () => keyboardEventEmitterSubscribe.unsubscribe());
    }
  }
}
