import {Injectable} from '@angular/core';
import {PRINTER_MAC} from "../../../../../config/base";

declare let cordova: any;

@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  private address: string;

  constructor() {
    //FORCE PRINTER MAC
    this.address = PRINTER_MAC;
  }

  public connect(callback?: () => void) {
    if (cordova.plugins.zbtprinter) {
      cordova.plugins.zbtprinter.find(
        (result) => {
          let address = '';
          if (typeof result == 'string') {
            address = result;
          } else {
            address = result.address;
          }
          this.address = address;
          console.debug('Zbtprinter: connect success: ' + address);
          if (callback) {
            callback();
          }
        }, (error) => {
          console.debug('Zbtprinter: connect fail: ' + error);
        }
      );
    } else {
      console.debug('Zbtprinter: not cordova');
    }
  }

  public print(text: string, macAddress?: string) {
    if (macAddress) this.address = macAddress;
    if (this.address) {
      this.toPrint(text);
    } else {
      console.debug('Zbtprinter: Not connected');
      this.connect(() => {
        this.toPrint(text);
      });
    }
  }

  private toPrint(text: string) {
    if (this.address) {
      if (cordova.plugins.zbtprinter) {
        let textToPrint = this.getTextToPrinter(text);
        cordova.plugins.zbtprinter.print(this.address, textToPrint,
          (success) => {
            console.debug("Zbtprinter print success: " + success, {text: text, mac: this.address, textToPrint: textToPrint});
          }, (fail) => {
            console.debug("Zbtprinter print fail:" + fail, {text: text, mac: this.address, textToPrint: textToPrint});
          }
        );
      } else {
        console.debug("Zbtprinter not cordova");
      }
    } else {
      console.debug('Zbtprinter: Not connected');
    }
  }

  private getTextToPrinter(text: string) {
    // 80 8 letras, 100 6 letras, 120 4, 45 ubicación...
    let size = '';
    switch (text.length) {
      case 11:
        size = '45';
        break;
      case 4:
        size = '120';
        break;
      case 6:
        size = '100';
        break;
      case 8:
        size = '80';
        break;
      default:
        size = '45';
        break;
    }
    let toPrint = '^XA^FO80,30^BY2\n' +
      '^A0N,60,60\n' +
      // ^BC orientation, height, interpretation line, i.l. above code, check digit, mode (N/U/A/D)
      '^BCN,' + size + ',Y,N,N\n' +
      '^FD' + text + '^XZ\n';
    return toPrint;
  }

}
