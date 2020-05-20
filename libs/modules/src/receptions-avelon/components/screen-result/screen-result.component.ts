import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PrinterService } from 'libs/services/src/lib/printer/printer.service';
import {ScreenResult} from "../../enums/screen_result.enum";
import { app } from '../../../../../services/src/environments/environment';

@Component({
  selector: 'suite-screen-result',
  templateUrl: './screen-result.component.html',
  styleUrls: ['./screen-result.component.scss']
})
export class ScreenResultComponent implements OnInit {

  @Input('type') type: number;
  @Input('references') references: string[];
  @Output('screenExit') exit: EventEmitter<boolean> = new EventEmitter(false);

  public screenResultType = ScreenResult;

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
    if (app.name == 'al') {
      this.printerService.printTagBarcode(this.references)
        .subscribe((resPrint) => {
        console.log('Print reference of reception successful');
        if (typeof resPrint == 'boolean') {
          console.log(resPrint);
        } else {
          resPrint.subscribe((resPrintTwo) => {
            console.log('Print reference of reception successful two', resPrintTwo);
          })
        }
      }, (error) => {
        console.error('Some error success to print reference of reception', error);
      });
    } else {
      return;
    }
  }

}
