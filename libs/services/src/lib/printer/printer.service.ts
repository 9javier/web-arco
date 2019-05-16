import {Injectable} from '@angular/core';
import {PRINTER_MAC} from "../../../../../config/base";
import {ToastController} from "@ionic/angular";

declare let cordova: any;

@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  private address: string;

  constructor(private toastController: ToastController) {
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
            this.presentToast('No ha sido posible conectarse con la impresora', 'danger');
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
    let size = '';
    if (text.length >= 11) {
      size = '45';
    } else if (text.length >= 8) {
      size = '80';
    } else if (text.length >= 6) {
      size = '100';
    } else {
      // tested for >=4 but will use as default measure
      size = '120';
    }
    let toPrint = '^XA^FO' + size + ',30^BY2\n' +
      '^A0N,60,60\n' +
      // ^BC orientation, height, interpretation line, i.l. above code, check digit, mode (N/U/A/D)
      '^BCN,100,Y,N,N\n' +
      '^FD' + text + '^XZ\n';
    return toPrint;
  }

  async presentToast(msg, color) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 3750,
      color: color || "primary"
    });
    toast.present();
  }

}
