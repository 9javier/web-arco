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
import { forEach } from '@angular/router/src/utils/collection';

declare let cordova: any;

@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  private static readonly MAX_PRINT_ATTEMPTS = 5;

  /**urls for printer service */
  private getProductsByReferenceUrl:string = environment.apiBase+"/products/references";
  private printNotifyUrl:string = environment.apiBase+"/filter/prices/printReferences";

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


  /**
   * Print string
   * @param strToPrint string to print
   * @param macAddress 
   */
  public async printProductBoxTag(strToPrint: string, macAddress?: string) {
    if (macAddress) {
      this.address = macAddress;
    } else {
      this.address = await this.getConfiguredAddress();
    }
    if (this.address) {
      return await this.toPrintFromString(strToPrint);
    } else {
      console.debug('Zbtprinter: Not connected');
      return await this.connect()
        .then(() => this.toPrintFromString(strToPrint));
    }
  }

  /**
   * Turn an array of objects into string ready to be printed
   * @param options - the options to be converted in the needed string
   */
  buildString(options:Array<PrintModel.Print>):string{
    let strToPrint:string = "";
    /**If need separator between labels */
    let separator:string = "";
    options.forEach(option=>{ 
      strToPrint+=this.getTextToPrinter(option)+separator;
    });
    return strToPrint;
  }

  

  /**
   * Esta función es la equivalente a @see printProductBoxTag
   * pero con la diferencia que será usada para imprimir los precios
   * el asunto es que no sabía que labeltype correspondía a cada printOption
   * así que por ahora haré un diccionario y ustedes modifíquenlo a su conveniencia
   */
  public async printPricesInZebra(strToPrint: string, macAddress?: string) {
    if (macAddress) {
      this.address = macAddress;
    } else {
      this.address = await this.getConfiguredAddress();
    }
    if (this.address) {
      return await this.toPrintFromString(strToPrint);
    } else {
      console.debug('Zbtprinter: Not connected');
      return await this.connect()
        .then(() => this.toPrintFromString(strToPrint));
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
    console.log("ac[a es que falla")
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
        let options:Array<PrintModel.Print> = [];
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
                id:price.id,
                percent: price.percent,
                percentOutlet: price.percentOutlet,
                totalPrice: price.totalPrice,
                priceOriginal: price.priceOriginal,
                priceDiscount: price.priceDiscount,
                priceDiscountOutlet: price.priceDiscountOutlet,
                typeLabel:price.typeLabel,
                numRange: price.range?price.range.numRange:0,
                valueRange: (price.range?String(price.range.startRange):'')+'-'+(price.range?String(price.range.endRange):''),
              };
            }
            let dictionaryOfCaseTypes = {
              "1": PrintModel.LabelTypes.LABEL_INFO_PRODUCT,
              "2": PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF,
              "3": PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF_OUTLET,
              "4": PrintModel.LabelTypes.LABEL_PRICE_WITH_TARIF_WITHOUT_DISCOUNT,
              "5": PrintModel.LabelTypes.LABEL_PRICE_WITH_TARIF_WITHOUT_DISCOUNT_OUTLET,
              "6": PrintModel.LabelTypes.LABEL_PRICE_WITH_TARIF_WITH_DISCOUNT,
              "7": PrintModel.LabelTypes.LABEL_PRICE_WITH_TARIF_WITH_DISCOUNT_OUTLET
            }
            printOptions.type = dictionaryOfCaseTypes[printOptions.price.typeLabel];
            options.push(printOptions);    
          })
        });
        let strToPrint:string = this.buildString(options);
        innerObservable = innerObservable.pipe(flatMap(product=>{
            return from(this.printPricesInZebra(strToPrint).catch((_=>{})));
        })).pipe(flatMap(response=>{
          return this.printNotify(options.map(option=>option.price.id));
        }));
        return innerObservable;
      }));
    }));
    return observable;    
  }

  /**
   * Send notification to server after print any labels
   * @param ids - the ids of printed labels
   */
  printNotify(ids:Array<Number>):Observable<boolean>{
    return this.http.post(this.printNotifyUrl,{references:ids}).pipe(map(response=>{
      return true;
    }));
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
        let options:Array<PrintModel.Print> = [];
        /**Iterate and build object to print */
        products.forEach(product=>{
          let printOptions:PrintModel.Print = {
            /**build the needed data for print */
            product: {
              productShoeUnit: {
                reference: product.reference,
                size: {
                  name: product.size?product.size.name:''
                },
                manufacturer: {
                  name: product.brand?product.brand.name:''
                },
                model: {
                  name: product.model?product.model.name:'',
                  reference: product.model?product.model.reference:'',
                  color: {
                    name: product.color? product.color.name:''
                  },
                  season: {
                    name: product.season ? product.season.name : ''
                  }
                }
              }
            }
          };
          printOptions.type = 1;
          /**Build the array for obtain the string to send to printer */
          options.push(printOptions);
        });
        /**Obtain the string from options */
        let strToPrint = this.buildString(options);
        innerObservable = innerObservable.pipe(flatMap(product=>{
          return from(this.printProductBoxTag(strToPrint));
        }));
        return innerObservable;
      }));
    }));
    return observable;
  }

  /**
   * Print the prices of products
   * @param listReferences references of products
   */
  printTagPrices(listReferences: string[]): Observable<Boolean> {
    let observable: Observable<boolean> = new Observable(observer => observer.next(true)).pipe(flatMap(dummyValue => {
      let innerObservable: Observable<any> = new Observable(observer => {
        observer.next(true);
      }).pipe(flatMap((r) => {
        return new Observable(s => {
          return s.next();
        })
      }));

      return this.priceService.postPricesByProductsReferences({references: listReferences}).pipe(flatMap((prices) => {
        let options: Array<PrintModel.Print> = [];
        prices.forEach(price => {
          let printOptions: PrintModel.Print = {};
          if(price.typeLabel){
            printOptions.product = {
              productShoeUnit:{
                model:{
                  reference:price.model.reference
                }
              }
            }
            printOptions.price = {
              id:price.id,
              percent: price.percent,
              percentOutlet: price.percentOutlet,
              totalPrice: price.totalPrice,
              priceOriginal: price.priceOriginal,
              priceDiscount: price.priceDiscount,
              priceDiscountOutlet: price.priceDiscountOutlet,
              typeLabel:price.typeLabel,
              numRange: price.range?price.range.numRange:0,
              valueRange: (price.range?String(price.range.startRange):'')+'-'+(price.range?String(price.range.endRange):''),
            };
          }
          let dictionaryOfCaseTypes = {
            "1": PrintModel.LabelTypes.LABEL_INFO_PRODUCT,
            "2": PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF,
            "3": PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF_OUTLET,
            "4": PrintModel.LabelTypes.LABEL_PRICE_WITH_TARIF_WITHOUT_DISCOUNT,
            "5": PrintModel.LabelTypes.LABEL_PRICE_WITH_TARIF_WITHOUT_DISCOUNT_OUTLET,
            "6": PrintModel.LabelTypes.LABEL_PRICE_WITH_TARIF_WITH_DISCOUNT,
            "7": PrintModel.LabelTypes.LABEL_PRICE_WITH_TARIF_WITH_DISCOUNT_OUTLET
          }
          printOptions.type = dictionaryOfCaseTypes[printOptions.price.typeLabel];
          options.push(printOptions);
        });
        let strToPrint:string = this.buildString(options);
        innerObservable = innerObservable.pipe(flatMap(product=>{
          return from(this.printPricesInZebra(strToPrint).catch((_=>{})));
        })).pipe(flatMap(response=>{
          return this.printNotify(options.map(option=>option.price.id));
        }));
        return innerObservable;
      }));
    }));

    return observable;
  }

  printTagPrice(product: PrintModel.ProductSizeRange) {

  }


  /**
   * Print labels with the zebra printed from string
   * @param textToPrint string to be printed
   */
  private async toPrintFromString(textToPrint:string) {
    if (this.address) {
      if (typeof cordova != "undefined" && cordova.plugins.zbtprinter) {
        return new Promise((resolve, reject) => {
          let printAttempts = 0;
          let tryToPrintFn = () => {
            printAttempts++;
            cordova.plugins.zbtprinter.print(this.address, textToPrint,
              (success) => {
                //console.debug("Zbtprinter print success: " + success, { text: printOptions.text || printOptions.product.productShoeUnit.reference, mac: this.address, textToPrint: textToPrint });
                resolve();
              }, (fail) => {
                if (printAttempts >= PrinterService.MAX_PRINT_ATTEMPTS) {
                  //console.debug("Zbtprinter print finally fail:" + fail, { text: printOptions.text || printOptions.product.productShoeUnit.reference, mac: this.address, textToPrint: textToPrint });
                  this.presentToast('No ha sido posible conectarse con la impresora', 'danger');
                  reject();
                } else {
                  //console.debug("Zbtprinter print attempt " + printAttempts + " fail:" + fail + ", retrying...", { text: printOptions.text || printOptions.product.productShoeUnit.reference, mac: this.address, textToPrint: textToPrint });
                  setTimeout(tryToPrintFn, 1000);
                }
              }
            );
          };
          tryToPrintFn();
        });
      } else {
        //console.debug("Zbtprinter not cordova, failed to print " + (printOptions.text || printOptions.product.productShoeUnit.reference) + " to " + this.address);
      }
    } else {
      //console.debug('Zbtprinter: Not connected, failed to print ' + (printOptions.text || printOptions.product.productShoeUnit.reference) + " to " + this.address);
    }
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
    let toPrintReturn = '';
    if (printOptions.text){
      for (let i = 0; i < printOptions.text.length; i++) {
        toPrintReturn += this.addTextToPrint(toPrint, printOptions.text[i], printOptions);
      }
    } else {
      toPrintReturn += this.addTextToPrint(toPrint, printOptions.product.productShoeUnit.reference, printOptions);
    }

    return toPrintReturn;
  }

  private addTextToPrint(toPrint, stringToBarcode, printOptions) {
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
