import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {KeyboardService} from "../../../../services/src/lib/keyboard/keyboard.service";

@Component({
  selector: 'scanner-manual',
  templateUrl: './scanner-manual.component.html',
  styleUrls: ['./scanner-manual.component.scss']
})
export class ScannerManualComponent implements OnInit {

  @Input() placeholder: string = 'NUEVO CÓDIGO';
  @Input() value: string = null;
  @Input() height: string = null;
  @Output() newValue = new EventEmitter();

  constructor(
    private keyboardService: KeyboardService
  ) {
    this.focusToInput();
  }

  ngOnInit() {

  }

  keyUpInput(event) {
    let data = (this.value || "").trim();

    if (event.keyCode == 13 && data) {
      this.newValue.next(data);
    }
  }

  public focusToInput() {
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    },500);
  }

  public setPlaceholder(newPlaceholder: string) {
    this.placeholder = newPlaceholder;
  }

  public setValue(newValue: string) {
    this.value = newValue;
  }

  public onFocus(event){
    if(event && event.target && event.target.id){
      this.keyboardService.setInputFocused(event.target.id);
    }
  }

}
