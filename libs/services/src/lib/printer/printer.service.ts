import { Injectable } from '@angular/core';
import { ToastController } from "@ionic/angular";
import { PrintModel } from "../../models/endpoints/Print";
import { SettingsService } from "../storage/settings/settings.service";
import { AppSettingsModel } from "../../models/storage/AppSettings";
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable,from } from 'rxjs';
import { map,switchMap, flatMap } from 'rxjs/operators';
import { PriceService } from '../endpoint/price/price.service';
import * as JsBarcode from 'jsbarcode';

declare let cordova: any;

@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  private static readonly MAX_PRINT_ATTEMPTS = 5;

  /**urls for printer service */
  private getProductsByReferenceUrl:string = environment.apiBase+"/products/references";

  private address: string;

  constructor(private http:HttpClient,private toastController: ToastController, private settingsService: SettingsService,private priceService:PriceService) {
  }

  private async getConfiguredAddress(): Promise<string> {
    return <Promise<string>>(this.settingsService.getDeviceSettings()
      .then((incomingDataObservable) => new Promise((resolve, reject) => {
        incomingDataObservable.subscribe((settings: AppSettingsModel.AppSettings) =>
          resolve(settings.printerBluetoothMacAddress || "")
        );
      }))
    );
  }

  public async connect() {
    return new Promise((resolve, reject) => {
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
            resolve();
          }, (error) => {
            console.debug('Zbtprinter: connect fail: ' + error);
            reject();
          }
        );
      } else {
        console.debug('Zbtprinter: not cordova');
        reject();
      }
    });
  }

  public async print(printOptions: PrintModel.Print, macAddress?: string) {
    printOptions.type = 0;

    if (macAddress) {
      this.address = macAddress;
    } else {
      this.address = await this.getConfiguredAddress();
    }
    if (this.address) {
      return await this.toPrint(printOptions);
    } else {
      console.debug('Zbtprinter: Not connected');
      return await this.connect()
        .then(() => this.toPrint(printOptions));
    }
  }

  public async printProductBoxTag(printOptions: PrintModel.Print, macAddress?: string) {
    console.log("Estoy en la impresora zebra imprimiento este objeto: ",printOptions);
    printOptions.type = 1;

    if (macAddress) {
      this.address = macAddress;
    } else {
      this.address = await this.getConfiguredAddress();
    }
    if (this.address) {
      return await this.toPrint(printOptions);
    } else {
      console.debug('Zbtprinter: Not connected');
      return await this.connect()
        .then(() => this.toPrint(printOptions));
    }
  }

  

  /**
   * Esta función es la equivalente a @see printProductBoxTag
   * pero con la diferencia que será usada para imprimir los precios
   * el asunto es que no sabía que labeltype correspondía a cada printOption
   * así que por ahora haré un diccionario y ustedes modifíquenlo a su conveniencia
   */
  public async printPricesInZebra(printOptions: PrintModel.Print, macAddress?: string) {
    /**
     * este diccionario será utilizado para que a modo de clave valor se pueda obtener fácilmente
     * cada clave corresponde con un tipo en el enum, y cada valor corresponde a un printOptionType para ser usado en el case
     * @todo cambiar todos los valores que por ahora están en el caso 4 por su correspondiente(es el valor que lo hace entrar en un case u otro)
     */
    let dictionaryOfCaseTypes = {
      "1": PrintModel.LabelTypes.LABEL_INFO_PRODUCT,
      "2": PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF,
      "3": PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF_OUTLET,
      "4": PrintModel.LabelTypes.LABEL_PRICE_WITH_TARIF_WITHOUT_DISCOUNT,
      "5": PrintModel.LabelTypes.LABEL_PRICE_WITH_TARIF_WITHOUT_DISCOUNT_OUTLET,
      "6": PrintModel.LabelTypes.LABEL_PRICE_WITH_TARIF_WITH_DISCOUNT,
      "7": PrintModel.LabelTypes.LABEL_PRICE_WITH_TARIF_WITH_DISCOUNT_OUTLET
    }

    /*
     * Example object to print product prices
     *
        printOptions.product = {
          productShoeUnit:{
            model:{
              reference:price.model.reference
            }
          }
        };
        printOptions.price = {
          percent: price.percent,
          percentOutlet: price.percentOutlet,
          totalPrice: price.totalPrice,
          priceOriginal: price.priceOriginal,
          priceDiscount: price.priceDiscount,
          priceDiscountOutlet: price.priceDiscountOutlet,
          typeLabel: price.typeLabel,
          numRange: price.numRange,
        };
        printOptions.range = {
          numRange: price.numRange,
          value: '36-40'
        };
    */

    /**si se modifica el diccionario no hay necesidad de modificar esto */
    printOptions.type = dictionaryOfCaseTypes[printOptions.price.typeLabel];

    console.log("Imprimiendo el precio",printOptions)

    if (macAddress) {
      this.address = macAddress;
    } else {
      this.address = await this.getConfiguredAddress();
    }
    if (this.address) {
      return await this.toPrint(printOptions);
    } else {
      console.debug('Zbtprinter: Not connected');
      return await this.connect()
        .then(() => this.toPrint(printOptions));
    }
  }


  /**
   * Get products by reference in api
   * @returns an observable with the list of products needed
   */
  getProductsByReference(references: string[]):Observable<Array<any>>{
    return this.http.post(this.getProductsByReferenceUrl,{references}).pipe(map((response:any)=>{
      return response.data;
    }))
  }

  /**
   * Obtain the prices by reference and then print each of these prices
   * @param referencesObject - object with the array of references to be sended
   */
  printPrices(referencesObject){
    let observable:Observable<boolean> = new Observable(observer=>observer.next(true)).pipe(flatMap(dummyValue=>{
      let innerObservable:Observable<any> = new Observable(observer=>{
        observer.next(true);
      }).pipe(flatMap((r)=>{
        return new Observable(s=>{
          return s.next();
        })
      }));
      /**obtain the products */
      return this.priceService.getIndexByModelTariff(referencesObject).pipe(flatMap((prices)=>{
        /**Iterate and build object to print */
        prices.forEach(pricesArray=>{
          pricesArray.forEach(price=>{
            let printOptions:PrintModel.Print = {};
            if(price.typeLabel){
              printOptions.product = {
                productShoeUnit:{
                  model:{
                    reference:price.model.reference
                  }
                }
              }
              printOptions.price = {
                percent: price.percent,
                percentOutlet: price.percentOutlet,
                totalPrice: price.totalPrice,
                priceOriginal: price.priceOriginal,
                priceDiscount: price.priceDiscount,
                priceDiscountOutlet: price.priceDiscountOutlet,
                typeLabel:price.typeLabel,
                numRange: price.range.numRange,
                valueRange: price.range.startRange+'-'+price.range.endRange,
              };
            }
            innerObservable = innerObservable.pipe(flatMap(product=>{
              /**Transform the promise in observable and merge that with the other prints */
              return from(this.printPricesInZebra(printOptions)
              // stop errors and attempt to print next tag
                .catch(reason => {}))
            }))            
          })
        });
        return innerObservable;
      }));
    }));
    return observable;    
  }

  /**
   * Obtain product by reference and then print each of these products
   * @param listReferences references to print
   */
   printTagBarcode(listReferences: string[]):Observable<Boolean>{
    /** declare and obsevable to merge all print results */
    let observable:Observable<boolean> = new Observable(observer=>observer.next(true)).pipe(flatMap(dummyValue=>{
      let innerObservable:Observable<any> = new Observable(observer=>{
        observer.next(true);
      }).pipe(flatMap((r)=>{
        return new Observable(s=>{
          return s.next();
        })
      }));
      /**obtain the products */
      return this.getProductsByReference(listReferences).pipe(flatMap((products)=>{
        /**Iterate and build object to print */
        products.forEach(product=>{
          let printOptions:PrintModel.Print = {
            /**build the needed data for print */
            product: {
              productShoeUnit: {
                reference: product.reference,
                size: {
                  name: product.size.name
                },
                manufacturer: {
                  name: product.brand.name
                },
                model: {
                  name: product.model.name,
                  reference: product.model.reference,
                  color: {
                    name: product.color.name
                  },
                  season: {
                    name: product.season ? product.season.name : ''
                  }
                }
              }
            }
          };
          innerObservable = innerObservable.pipe(flatMap(product=>{
            /**Transform the promise in observable and merge that with the other prints */
            return from(this.printProductBoxTag(printOptions)
            // stop errors and attempt to print next tag
              .catch(reason => {}))
          }))
        });
        return innerObservable;
      }));
    }));
    return observable;
  }

  /**
   * Print the prices of products
   * @param listReferences references of products
   */
  printTagPrices(listReferences: string[]):Observable<Boolean>{
    console.log("entra en el servicio");
    /** declare and obsevable to merge all print results */
    let observable:Observable<boolean> = new Observable(observer=>observer.next(true)).pipe(switchMap(dummyValue=>{
      console.log("entra en el primer observable");
      let innerObservable:Observable<any> = new Observable(observer=>{
        observer.next(true);
      })
      /**obtain the products */
      return this.getProductsByReference(listReferences).pipe(switchMap((products)=>{
        console.log("busca los productos en el servicio",products);

        /**Iterate and build object to print */
        products.forEach(product=>{

          let printOptions:PrintModel.Print = {
            /**build the needed data for print */
            product: {
              productShoeUnit: {
                reference: product.reference,
                size: {
                  name: product.size.name
                },
                manufacturer: {
                  name: product.brand.name
                },
                model: {
                  name: product.model.name,
                  reference: product.model.reference,
                  color: {
                    name: product.color.name
                  },
                  season: {
                    name: product.season ? product.season.name : ''
                  }
                }
              }
            }
          };
          console.log(product);
          console.log("lo que env[ia",printOptions);
          innerObservable = innerObservable.pipe(switchMap(product=>{
            /**Transform the promise in observable and merge that with the other prints */
            return from(this.printProductBoxTag(printOptions)
            // stop errors and attempt to print next tag
              .catch(reason => {}))
          }))
        });
        return innerObservable;
      }));
    }));
    return observable;
  }

  printTagPrice(product: PrintModel.ProductSizeRange) {

  }

  private async toPrint(printOptions: PrintModel.Print) {
    if (this.address) {
      if (typeof cordova != "undefined" && cordova.plugins.zbtprinter) {
        let textToPrint = this.getTextToPrinter(printOptions);
        return new Promise((resolve, reject) => {
          let printAttempts = 0;
          let tryToPrintFn = () => {
            printAttempts++;
            cordova.plugins.zbtprinter.print(this.address, textToPrint,
              (success) => {
                console.debug("Zbtprinter print success: " + success, { text: printOptions.text || printOptions.product.productShoeUnit.reference, mac: this.address, textToPrint: textToPrint });
                resolve();
              }, (fail) => {
                if (printAttempts >= PrinterService.MAX_PRINT_ATTEMPTS) {
                  console.debug("Zbtprinter print finally fail:" + fail, { text: printOptions.text || printOptions.product.productShoeUnit.reference, mac: this.address, textToPrint: textToPrint });
                  this.presentToast('No ha sido posible conectarse con la impresora', 'danger');
                  reject();
                } else {
                  console.debug("Zbtprinter print attempt " + printAttempts + " fail:" + fail + ", retrying...", { text: printOptions.text || printOptions.product.productShoeUnit.reference, mac: this.address, textToPrint: textToPrint });
                  setTimeout(tryToPrintFn, 1000);
                }
              }
            );
          };
          tryToPrintFn();
        });
      } else {
        console.debug("Zbtprinter not cordova, failed to print " + (printOptions.text || printOptions.product.productShoeUnit.reference) + " to " + this.address);
      }
    } else {
      console.debug('Zbtprinter: Not connected, failed to print ' + (printOptions.text || printOptions.product.productShoeUnit.reference) + " to " + this.address);
    }
  }

  private getTextToPrinter(printOptions: PrintModel.Print) {
    let toPrint = '';
    let stringToBarcode = printOptions.text || printOptions.product.productShoeUnit.reference;

    switch (printOptions.type) {
      case PrintModel.LabelTypes.LABEL_BARCODE_TEXT: // Test with Barcode and string of data below
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
      case PrintModel.LabelTypes.LABEL_INFO_PRODUCT: // Tag with product reference, size and model details
        toPrint = "^XA^CI28^LH30,5^AVN^FO1,5^FD"
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
          + printOptions.product.productShoeUnit.reference
          + "^FS^XZ";
        break;
      case PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF: // Tag with product price
      case PrintModel.LabelTypes.LABEL_PRICE_WITH_TARIF_WITHOUT_DISCOUNT: // Tag with product price
        toPrint = "^XA^CI28^LH28,0^AFN^FO0,30^FB320,1,0,R,0^FD^FS^ADN^FO10,95^FB320,1,0,L,0^FD";
        // toPrint += 'TagSzRng';
        toPrint += "^FS^AVN^FO0,55^FB320,1,0,C,0^FD";
        if (printOptions.price.priceOriginal) {
          toPrint += printOptions.price.priceOriginal + '€';
        }
        toPrint += "^FS^AP^FO0,115^GB320,0,3^FS^AQ^FWB^FO5,130^FD"
          + printOptions.product.productShoeUnit.model.reference
          + "^FS^LH28,0^FWN^FO40,125^BY2,3.0^BCN,50,N,N,N^FD"
          + printOptions.product.productShoeUnit.model.reference
          + "^FS^AAN^FO0,190^FB315,1,0,L,0^FD"
          // + 'brand'
          + "^FS^AAN^FO0,190^FB315,1,0,C,0^FD"
          // + 'style'
          + "^FS^AAN^FO0,190^FB315,1,0,R,0^FD"
          // + 'detcol'
          + "^FS^ADN^FO0,125^FB330,1,0,R,0^FD"
          // + 'modelName'
          + "^FS^ADN^FO0,145^FB330,1,0,R,0^FD";
        if (printOptions.price.valueRange) {
          toPrint += printOptions.price.valueRange;
        }
        toPrint += "^FS^XZ";
        break;
      case PrintModel.LabelTypes.LABEL_PRICE_WITH_TARIF_WITH_DISCOUNT: // Tag with current product price and previous price
        toPrint = "^XA^CI28^LH28,0^AFN^FO0,30^FB320,1,0,R,0^FD^FS^ADN^FO10,130^FB320,1,0,L,0^FD";
        if (printOptions.price.percent) {
          toPrint += printOptions.price.percent + '%';
        }
        toPrint += "^FS^AEN^FO10,30^FB310,1,0,L,0^FD";
        if (printOptions.price.priceOriginal) {
          toPrint += printOptions.price.priceOriginal + '€';
        }
        toPrint += "^FS^FO25,25^GD90,30,8,B,L^FS^FO25,25^GD90,30,8,B,R^FS^AVN^FO0,70^FB340,1,0,C,0^FD";
        if (printOptions.price.priceDiscount) {
          toPrint += printOptions.price.priceDiscount + '€';
        }
        toPrint += "^FS^AP^FO0,145^GB335,0,3^FS^AQ^FWB^FO5,155^FD"
          + printOptions.product.productShoeUnit.model.reference
          + "^FS^FWN^FO40,155^BY2,3.0^BCN,50,N,N,N^FD"
          + printOptions.product.productShoeUnit.model.reference
          + "^FS^ADN^FO0,155^FB330,1,0,R,0^FD";
        // toPrint += 'name';
        toPrint += "^FS^ADN^FO0,175^FB330,1,0,R,0^FD";
        if (printOptions.price.valueRange) {
          toPrint += printOptions.price.valueRange;
        }
        toPrint += "^FS^XZ";
        break;
      case PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF_OUTLET: // Tag with original product pvp and product pvp for outlet
      case PrintModel.LabelTypes.LABEL_PRICE_WITH_TARIF_WITHOUT_DISCOUNT_OUTLET: // Tag with original product pvp and product pvp for outlet
        toPrint = "^XA^CI28^LH28,0^AFN^FO0,30^FB320,1,0,R,0^FD^FS^ADN^FO0,120^FB320,1,0,L,0^FD";
        // toPrint += 'TagSzRng';
        toPrint += "^FS^AFN^FO0,30^FB310,1,0,L,0^FD"
          + "PVP:";
        if (printOptions.price.priceOriginal) {
          toPrint += printOptions.price.priceOriginal + '€';
        }
        toPrint += "^FS^AUN^FO0,80^FB335,1,0,R,0^FD";
        if (printOptions.price.priceDiscount) {
          toPrint += printOptions.price.priceDiscount + '€';
        }
        toPrint += "^FS^ARN^FO0,80^FB340,1,0,L,0^FD"
          + "PVP Outlet:"
          + "^FS^AP^FO0,145^GB335,0,3^FS^AQ^FWB^FO5,155^FD"
          + printOptions.product.productShoeUnit.model.reference
          + "^FS^FWN^FO40,155^BY2,3.0^BCN,50,N,N,N^FD"
          + printOptions.product.productShoeUnit.model.reference
          + "^FS^ADN^FO0,155^FB330,1,0,R,0^FD";
        if (printOptions.price.percentOutlet) {
          toPrint += printOptions.price.percentOutlet + '%';
        }
        toPrint += "^FS^ADN^FO0,175^FB330,1,0,R,0^FD";
        if (printOptions.price.valueRange) {
          toPrint += printOptions.price.valueRange;
        }
        toPrint += "^FS^XZ";
        break;
      case PrintModel.LabelTypes.LABEL_PRICE_WITH_TARIF_WITH_DISCOUNT_OUTLET: // Tag with original product pvp, product pvp for outlet and last product price
        toPrint = "^XA^CI28^LH28,0^AFN^FO0,30^FB320,1,0,R,0^FD^FS^ADN^FO10,130^FB320,1,0,L,0^FD";
        toPrint += "^FS^AFN^FO0,30^FB310,1,0,L,0^FD"
          + "PVP:";
        if (printOptions.price.priceOriginal) {
          toPrint += printOptions.price.priceOriginal + '€';
        }
        toPrint += "^FS^AFN^FO0,60^FB310,1,0,L,0^FD"
          + "PVP Outlet:";
        if (printOptions.price.priceDiscount) {
          toPrint += printOptions.price.priceDiscount + '€';
        }
        toPrint += "^FS^ATN^FO0,100^FB335,1,0,R,0^FD";
        if (printOptions.price.priceDiscountOutlet) {
          toPrint += printOptions.price.priceDiscountOutlet + '€';
        }
        toPrint += "^FS^ARN^FO0,100^FB340,1,0,L,0^FD"
          + "Último precio:"
          + "^FS^AP^FO0,145^GB335,0,3^FS^AQ^FWB^FO5,155^FD"
          + printOptions.product.productShoeUnit.model.reference
          + "^FS^FWN^FO40,155^BY2,3.0^BCN,50,N,N,N^FD"
          + printOptions.product.productShoeUnit.model.reference
          + "^FS^ADN^FO0,155^FB330,1,0,R,0^FD";
        if (printOptions.price.percentOutlet) {
          toPrint += printOptions.price.percentOutlet + '%';
        }
        toPrint += "^FS^ADN^FO0,175^FB330,1,0,R,0^FD";
        if (printOptions.price.valueRange) {
          toPrint += printOptions.price.valueRange;
        }
        toPrint += "^FS^XZ";
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

  async printBarcodesOnBrowser(codes: string[]) {

    let divBarcodes = document.createElement('div');
    divBarcodes.style.display = "none";
    document.body.append(divBarcodes);

    let imageLoadPromises: Promise<void>[] = [];

    for (let reference of codes) {
      let newImage = document.createElement('img');
      imageLoadPromises.push(new Promise((resolve) => { newImage.onload = <any>resolve; }));
      newImage.id = reference;
      newImage.className = 'barcode';
      divBarcodes.appendChild(newImage);
      JsBarcode("#"+reference, reference);
    }

    return Promise.all(imageLoadPromises)
      .then(() => new Promise((resolve) => {
        const barcodesHTML = divBarcodes.innerHTML;
        divBarcodes.remove();

        let barcodesPopupWindow = window.open('', 'PRINT', 'height=800,width=800');

        const printPageHtml = `
<html>
<head>
    <title></title>
    <style>
        @media print {
            @page { margin: 0; }
            body { margin: 1.6cm; }
        }
    </style>
</head>
<body>
    ${barcodesHTML}
</body>
</html>`;
        barcodesPopupWindow.document.write(printPageHtml);

        barcodesPopupWindow.document.close(); // necessary for IE >= 10
        barcodesPopupWindow.focus(); // necessary for IE >= 10*/

        barcodesPopupWindow.print();
        barcodesPopupWindow.close();

        resolve();
      }));
  }

}
