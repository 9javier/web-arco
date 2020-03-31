import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KeyboardService } from "../../../../services/src/lib/keyboard/keyboard.service";
import {PlatformLocation} from "@angular/common";

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
  @Output() currentValue = new EventEmitter();
  @Input() inputId: string = 'input-ta';
  @Input() showKeyboard: boolean = false;

  public isScanBlocked: boolean = false;

  constructor(
    public keyboardService: KeyboardService,
    private location: PlatformLocation
  ) {
    this.focusToInput();
    location.onPopState(() => {
      this.focusToInput();
    });
  }

  ngOnInit() {
    
  }
  ngAfterViewInit(){

  }
  keyUpInput(event) {
    let data = (this.value || "").trim();
    this.currentValue.next(data);
    if (event.keyCode == 13 && data && !this.isScanBlocked) {
      this.newValue.next(data);
      this.setValue(null);
      this.focusToInput();
    } else if (event.keyCode == 13 && this.isScanBlocked) {
      this.setValue(null);
      this.focusToInput();
    }
  }

  public focusToInput() {
    setTimeout(() => {
      const input = document.getElementById('input-ta')
      if(input) {
        input.focus()
      } 
    }, 500);
  }

  public setPlaceholder(newPlaceholder: string) {
    this.placeholder = newPlaceholder;
  }

  public setValue(newValue: string) {
    this.value = newValue;
  }

  public onFocus(event) {
    if (event && event.target && event.target.id) {
      this.keyboardService.setInputFocused(event.target.id);
    }
  }

  public blockScan(mustBlockScan) {
    this.isScanBlocked = mustBlockScan;
  }
}
