import { Injectable } from '@angular/core';
import {PrinterService} from "../printer/printer.service";

@Injectable({
  providedIn: 'root'
})
export class PrinterConnectionService {

  private static readonly MINUTES_CHECK_CONNECTION = 5;
  interval;

  constructor(private printerService: PrinterService) {
  }

  public taskConnection() {
    this.printerService.reConnect();
    if (!this.interval) {
      this.interval = setInterval(() => {
        this.printerService.reConnect();
      }, PrinterConnectionService.MINUTES_CHECK_CONNECTION * 1000 * 60);
    }
  }

  public connect(){
    this.printerService.openConnection();
  }

  public disconnect(){
    this.printerService.closeConnection();
  }

  public checkConnection(){
    this.printerService.checkConnection();
  }

  public reConnect(){
    this.printerService.reConnect();
  }

}
