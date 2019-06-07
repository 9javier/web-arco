import {Injectable} from '@angular/core';
import {PRINTER_MAC} from "../../../../../config/base";
import {ToastController} from "@ionic/angular";
import {PrintModel} from "../../models/endpoints/Print";

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

  public print(printOptions: PrintModel.Print, macAddress?: string) {
    if (macAddress) this.address = macAddress;
    if (this.address) {
      this.toPrint(printOptions);
    } else {
      console.debug('Zbtprinter: Not connected');
      this.connect(() => {
        this.toPrint(printOptions);
      });
    }
  }

  private toPrint(printOptions: PrintModel.Print) {
    if (this.address) {
      if (typeof cordova != "undefined" && cordova.plugins.zbtprinter) {
        let textToPrint = this.getTextToPrinter(printOptions);
        cordova.plugins.zbtprinter.print(this.address, textToPrint,
          (success) => {
            console.debug("Zbtprinter print success: " + success, {text: printOptions.text || printOptions.product.productShoeUnit.reference, mac: this.address, textToPrint: textToPrint});
          }, (fail) => {
            console.debug("Zbtprinter print fail:" + fail, {text: printOptions.text || printOptions.product.productShoeUnit.reference, mac: this.address, textToPrint: textToPrint});
            this.presentToast('No ha sido posible conectarse con la impresora', 'danger');
          }
        );
      } else {
        console.debug("Zbtprinter not cordova, failed to print " + printOptions.text || printOptions.product.productShoeUnit.reference);
      }
    } else {
      console.debug('Zbtprinter: Not connected, failed to print ' + printOptions.text || printOptions.product.productShoeUnit.reference);
    }
  }

  private getTextToPrinter(printOptions: PrintModel.Print) {
    let toPrint = '';
    let stringToBarcode = printOptions.text || printOptions.product.productShoeUnit.reference;

    switch (printOptions.type) {
      case 0: // Test with Barcode and string of data below
        let size = '';
        if (stringToBarcode.length >= 11) {
          size = '45';
        } else if (stringToBarcode.length >= 8) {
          size = '80';
        } else if (stringToBarcode.length >= 6) {
          size = '100';
        } else {
          // tested for >=4 but will use as default measure
          size = '120';
        }

        toPrint = '^XA^FO' + size + ',30^BY2\n' +
          '^A0N,60,60\n' +
          // ^BC orientation, height, interpretation line, i.l. above code, check digit, mode (N/U/A/D)
          '^BCN,100,Y,N,N\n' +
          '^FD' + stringToBarcode + '^XZ\n';
        break;
      case 1: // Tag with product price
        toPrint = "^XA^LH28,0^CI27^AFN^FO0,30^FB320,1,0,R,0^FD"+'Iniciales'+"^FS^ADN^FO10,95^FB320,1,0,L,0^FD"+'TagSzRng'+"^FS^AVN^FO0,55^FB320,1,0,C,0^FD"+'saleprice1'+" €^FS^AP^FO0,115^GB320,0,3^FS^AQ^FWB^FO5,130^FD"+'item'+"^FS^LH28,0^FWN^FO40,125^BY2,3.0^BCN,50,N,N,N^FD"+'barcode'+"^FS^AAN^FO0,190^FB315,1,0,L,0^FD"+'brand'+"^FS^AAN^FO0,190^FB315,1,0,C,0^FD"+'style'+"^FS^AAN^FO0,190^FB315,1,0,R,0^FD"+'detcol'+"^FS^ADN^FO0,125^FB330,1,0,R,0^FD"+'siglas'+"^FS^ADN^FO0,145^FB330,1,0,R,0^FD"+'porcent'+"^FS^XZ";
        break;
      case 2: // Tag with current product price and previous price
        toPrint = "^XA^LH28,0^CI27^AFN^FO0,30^FB320,1,0,R,0^FD"+'iniciales'+"^FS^ADN^FO10,130^FB320,1,0,L,0^FD"+'TagSzRng'+"^FS^AEN^FO10,30^FB310,1,0,L,0^FD"+'saleprice1'+"€^FS^FO25,25^GD90,30,8,B,L^FS^FO25,25^GD90,30,8,B,R^FS^AVN^FO0,70^FB340,1,0,C,0^FD"+'saleprice2'+" €^FS^AP^FO0,145^GB335,0,3^FS^AQ^FWB^FO5,155^FD"+'item'+"^FS^FWN^FO40,155^BY2,3.0^BCN,50,N,N,N^FD"+'barcode'+"^FS^ADN^FO0,155^FB330,1,0,R,0^FD"+'siglas'+"^FS^ADN^FO0,175^FB330,1,0,R,0^FD"+'porcent'+"^FS^XZ";
        break;
      case 3: // Tag with current product price and previous price
        toPrint = "^XA^LH28,0^CI27^AFN^FO0,30^FB320,1,0,R,0^FD"+'iniciales'+"^FS^ADN^FO10,130^FB320,1,0,L,0^FD"+'TagSzRng'+"^FS^AEN^FO10,30^FB310,1,0,L,0^FD"+'saleprice1'+"€^FS^FO25,25^GD90,30,8,B,L^FS^FO25,25^GD90,30,8,B,R^FS^AVN^FO0,70^FB340,1,0,C,0^FD"+'saleprice3'+" €^FS^AP^FO0,145^GB335,0,3^FS^AQ^FWB^FO5,155^FD"+'item'+"^FS^FWN^FO40,155^BY2,3.0^BCN,50,N,N,N^FD"+'barcode'+"^FS^ADN^FO0,155^FB330,1,0,R,0^FD"+'siglas'+"^FS^ADN^FO0,175^FB330,1,0,R,0^FD"+'porcent'+"^FS^XZ";
        break;
      case 4: // Tag with current product price and previous price
        toPrint = "^XA^LH28,0^CI27^AFN^FO0,30^FB320,1,0,R,0^FD"+'iniciales'+"^FS^ADN^FO10,130^FB320,1,0,L,0^FD"+'TagSzRng'+"^FS^AEN^FO10,30^FB310,1,0,L,0^FD"+'saleprice1'+"€^FS^FO25,25^GD90,30,8,B,L^FS^FO25,25^GD90,30,8,B,R^FS^AVN^FO0,70^FB340,1,0,C,0^FD"+'saleprice4'+" €^FS^AP^FO0,145^GB335,0,3^FS^AQ^FWB^FO5,155^FD"+'item'+"^FS^FWN^FO40,155^BY2,3.0^BCN,50,N,N,N^FD"+'barcode'+"^FS^ADN^FO0,155^FB330,1,0,R,0^FD"+'siglas'+"^FS^ADN^FO0,175^FB330,1,0,R,0^FD"+'porcent'+"^FS^XZ";
        break;
      case 5: // Tag with original product pvp and product pvp for outlet
        toPrint = "^XA^LH28,0^CI27^AFN^FO0,30^FB320,1,0,R,0^FD"+'iniciales'+"^FS^ADN^FO0,120^FB320,1,0,L,0^FD"+'TagSzRng'+"^FS^AFN^FO0,30^FB310,1,0,L,0^FDPVP:"+'saleprice1'+"€^FS^AUN^FO0,80^FB335,1,0,R,0^FD"+'saleprice4'+" €^FS^ARN^FO0,80^FB340,1,0,L,0^FDPVP Outlet:^FS^AP^FO0,145^GB335,0,3^FS^AQ^FWB^FO5,155^FD"+'item'+"^FS^FWN^FO40,155^BY2,3.0^BCN,50,N,N,N^FD"+'barcode'+"^FS^ADN^FO0,155^FB330,1,0,R,0^FD"+'siglas'+"^FS^ADN^FO0,175^FB330,1,0,R,0^FD"+'porcent'+"^FS^XZ";
        break;
      case 6: // Tag with original product pvp, product pvp for outlet and last product price
        toPrint = "^XA^LH28,0^CI27^AFN^FO0,30^FB320,1,0,R,0^FD"+'iniciales'+"^FS^ADN^FO10,130^FB320,1,0,L,0^FD"+'TagSzRng'+"^FS^AFN^FO0,30^FB310,1,0,L,0^FDPVP:"+'saleprice1'+"€^FS^AFN^FO0,60^FB310,1,0,L,0^FDPVP Outlet:"+'saleprice4'+"€^FS^ATN^FO0,100^FB335,1,0,R,0^FD"+'saleprice5'+" €^FS^ARN^FO0,100^FB340,1,0,L,0^FDÚltimo precio:^FS^AP^FO0,145^GB335,0,3^FS^AQ^FWB^FO5,155^FD"+'item'+"^FS^FWN^FO40,155^BY2,3.0^BCN,50,N,N,N^FD"+'barcode'+"^FS^ADN^FO0,155^FB330,1,0,R,0^FD"+'siglas'+"^FS^ADN^FO0,175^FB330,1,0,R,0^FD"+'porcent'+"^FS^XZ";
        break;
      case 7: // Tag with current product price and previous price
        toPrint = "^XA^LH28,0^CI27^AFN^FO0,30^FB320,1,0,R,0^FD"+'iniciales'+"^FS^ADN^FO10,130^FB320,1,0,L,0^FD"+'TagSzRng'+"^FS^AEN^FO10,30^FB310,1,0,L,0^FD"+'saleprice1'+"€^FS^FO25,25^GD90,30,8,B,L^FS^FO25,25^GD90,30,8,B,R^FS^AVN^FO0,70^FB340,1,0,C,0^FD"+'saleprice5'+" €^FS^AP^FO0,145^GB335,0,3^FS^AQ^FWB^FO5,155^FD"+'item'+"^FS^FWN^FO40,155^BY2,3.0^BCN,50,N,N,N^FD"+'barcode'+"^FS^ADN^FO0,155^FB330,1,0,R,0^FD"+'siglas'+"^FS^ADN^FO0,175^FB330,1,0,R,0^FD"+'porcent'+"^FS^XZ";
        break;
      case 8: // Tag with product reference, size and model details
        toPrint = "^XA^LH30,5^CI27^AVN^FO1,5^FD"
          + printOptions.product.productShoeUnit.model.reference
          + "^FS^AVN^FO0,15^FB325,1,0,R,0^FD";
        if (printOptions.product.productShoeUnit.size.name) {
          toPrint += printOptions.product.productShoeUnit.size.name;
        }
        toPrint += "^FS^ABN^FO3,70^FD";
        if (printOptions.product.productShoeUnit.manufacturer && printOptions.product.productShoeUnit.manufacturer.name) {
          toPrint += printOptions.product.productShoeUnit.manufacturer.name;
        }
        toPrint += "^FS^ABN^FO3,85^FD";
        if (printOptions.product.productShoeUnit.model.name) {
          toPrint += printOptions.product.productShoeUnit.model.name;
        }
        toPrint += "^FS^ABN^FO3,100^FD";
        if (printOptions.product.productShoeUnit.model.color.name) {
          toPrint += printOptions.product.productShoeUnit.model.color.name;
        }
        toPrint += "^FS^AQN^FO0,110^FB325,1,0,R,0^FD";
        if (printOptions.product.productShoeUnit.model.season && printOptions.product.productShoeUnit.model.season.name) {
          toPrint += printOptions.product.productShoeUnit.model.season.name;
        }
        toPrint += "^FS^FO10,125^BY2,3.0^BCN,40,Y,N,N^FD>;"
          + "001043061200829979"
          + "^FS^XZ";
        break;
    }

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
