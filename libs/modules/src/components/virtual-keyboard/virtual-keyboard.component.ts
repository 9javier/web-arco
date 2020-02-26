import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import Keyboard from 'simple-keyboard';
import layout from 'simple-keyboard-layouts/build/layouts/spanish';
import { KeyboardFilteringService } from '../../../../services/src/lib/keyboard-filtering/keyboard-filtering.service';
import { NavParams, PopoverController } from '@ionic/angular';
import {Type} from "../../receptions-avelon/enums/type.enum";

@Component({
  selector: 'suite-virtual-keyboard',
  templateUrl: './virtual-keyboard.component.html',
  styleUrls: ['./virtual-keyboard.component.scss'],
})
export class VirtualKeyboardComponent implements OnInit, AfterViewInit {
  value = "";
  keyboard: Keyboard;
  searchTerm: string = "";
  items: any;
  type: number;
  @Output() eventOnKeyPress = new EventEmitter<any>();

  layout_type: 'qwerty'|'number';
  placeholder: string = 'Ingrese el texto';
  initialValue: string = null;

  result = {
    keyPress: '',
    selected: null
  };

  constructor(
    private keyboardFilteringService: KeyboardFilteringService,
    private navParams: NavParams,
    private popoverController: PopoverController
  ) {
    const items = this.navParams.get('data');
    this.type = this.navParams.get('type');
    this.keyboardFilteringService.setItems(items);
  }

  ngAfterViewInit() {
    let keyboardConfiguration: any = {
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button),
    };

    if (this.layout_type == 'qwerty') {
      keyboardConfiguration.layout = layout;
    } else {
      keyboardConfiguration.layout = {
        default: ['7 8 9', '4 5 6', '1 2 3', '{down_hide} 0 {backspace}']
      };

      keyboardConfiguration.display = {
        "{down_hide}": "▼",
        "{backspace}": "◄",
      };
      keyboardConfiguration.theme = "hg-theme-default hg-layout-numeric numeric-theme";
      keyboardConfiguration.mergeDisplay = true;
    }

    this.keyboard = new Keyboard(keyboardConfiguration);

    if (this.initialValue && this.initialValue != '' && this.initialValue != '0') {
      this.searchTerm = this.initialValue;
      this.result.keyPress = this.initialValue;
      this.keyboard.setInput(this.initialValue);
    }
  }

  setFilteredItems() {
    this.items = this.keyboardFilteringService.filterItems(this.searchTerm);
  }

  onChange = (input: string) => {
    this.searchTerm = input;
    this.result.keyPress = input;
    this.eventOnKeyPress.emit(this.result);
  };

  onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") {
      this.handleShift();
    }
    if (button === "{enter}" && (!this.type || this.type == Type.EXPEDITION_NUMBER || this.type == Type.EAN_CODE)) {
      this.selectItem(this.searchTerm);
    }
    if (button === '{down_hide}') {
      this.popoverController.dismiss();
    }
  };

  handleShift = () => {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";

    this.keyboard.setOptions({
      layoutName: shiftToggle
    });
  };

  ngOnInit(): void {
    this.setFilteredItems();
  }

  itemClick(item){
    if(this.type == 5){
      this.selectItem(item.value)
    } else{
      this.selectItem(item.id)
    }
  }

  async selectItem(id: any) {
    this.result.selected = {id, type: this.type};
    this.eventOnKeyPress.emit(this.result);
    await this.popoverController.dismiss();
  }
}
