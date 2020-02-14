import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import Keyboard from 'simple-keyboard';
import layout from 'simple-keyboard-layouts/build/layouts/spanish';
import { KeyboardFilteringService } from '../../../../services/src/lib/keyboard-filtering/keyboard-filtering.service';
import { NavParams, PopoverController } from '@ionic/angular';

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
    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      onKeyPress: button => this.onKeyPress(button),
      layout: layout
    });
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
    if (button === "{shift}" || button === "{lock}") this.handleShift();
    if (!this.type && button === "{enter}") this.selectItem(this.searchTerm);
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

  async selectItem(id: any) {
    this.result.selected = {id, type: this.type};
    this.eventOnKeyPress.emit(this.result);
    await this.popoverController.dismiss();
  }
}
