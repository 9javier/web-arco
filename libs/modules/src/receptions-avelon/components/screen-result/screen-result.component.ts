import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PrinterService } from 'libs/services/src/lib/printer/printer.service';

@Component({
  selector: 'suite-screen-result',
  templateUrl: './screen-result.component.html',
  styleUrls: ['./screen-result.component.scss']
})
export class ScreenResultComponent implements OnInit {

  @Input('type') type: number
  @Input('reference') reference: string
  @Output('screenExit') exit: EventEmitter<boolean> = new EventEmitter(false)
  constructor(
    private printerService: PrinterService
  ) { }

  ngOnInit() {
    this.printCodes();
  }

  screenExit() {
    this.exit.emit(true)
  }

  private async printCodes() {
    let codes = [this.reference];
    if ((<any>window).cordova) {
      this.printerService.print({ text: codes, type: 2 });
    } else {
      return await this.printerService.printBarcodesOnBrowser(codes);
    }
  }

}
