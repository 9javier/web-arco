import { Injectable } from '@angular/core';
import { ToastController } from "@ionic/angular";
import { PrintModel } from "../../models/endpoints/Print";
import { SettingsService } from "../storage/settings/settings.service";
import { AppSettingsModel } from "../../models/storage/AppSettings";
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { map, switchMap, flatMap } from 'rxjs/operators';
import { PriceService } from '../endpoint/price/price.service';
import * as JsBarcode from 'jsbarcode';
import { forEach } from '@angular/router/src/utils/collection';
import { ProductModel } from "@suite/services";
import { RequestsProvider } from "../../providers/requests/requests.provider";
import { HttpRequestModel } from "../../models/endpoints/HttpRequest";

declare let cordova: any;

@Injectable({
  providedIn: 'root'
})
export class PrinterService {

  private static readonly MAX_PRINT_ATTEMPTS = 5;

  /**urls for printer service */
  private getProductsByReferenceUrl: string = environment.apiBase + "/products/references";
  private printNotifyUrl: string = environment.apiBase + "/tariffs/printReferences";

  private address: string;

  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private settingsService: SettingsService,
    private priceService: PriceService,
    private requestsProvider: RequestsProvider) { }

  public async openConnection(showAlert: boolean = false) {
    this.address = await this.getConfiguredAddress();
    console.debug("PRINT::openConnection 1 [" + new Date().toJSON() + "]", this.address);
    return new Promise((resolve, reject) => {
      if (this.address) {
        if (cordova.plugins.zbtprinter) {
          cordova.plugins.zbtprinter.openConnection(this.address,
            (result) => {
              if (showAlert) {
                this.presentToast('Conectado a la impresora', 'success');
              }
              console.debug("PRINT::openConnection 2 [" + new Date().toJSON() + "]", result);
              resolve();
            }, (error) => {
              if (showAlert) {
                this.presentToast('No ha sido posible conectarse con la impresora', 'danger');
              }
              console.debug("PRINT::openConnection 3 [" + new Date().toJSON() + "]", error);
              reject();
            });
        } else {
          if (showAlert) {
            this.presentToast('No ha sido posible conectarse con la impresora', 'danger');
          }
          console.debug("PRINT::openConnection 4 [" + new Date().toJSON() + "]");
          reject();
        }
      } else {
        if (showAlert) {
          this.presentToast('No está configurada la impresora', 'danger');
        }
        console.debug("PRINT::openConnection 5 [" + new Date().toJSON() + "]");
        reject();
      }
    });
  }

  public async closeConnection() {
    return new Promise((resolve, reject) => {
      if (cordova.plugins.zbtprinter) {
        cordova.plugins.zbtprinter.closeConnection(
          (result) => {
            console.debug("PRINT::closeConnection 1 [" + new Date().toJSON() + "]", result);
            resolve();
          }, (error) => {
            console.debug("PRINT::closeConnection 2 [" + new Date().toJSON() + "]", error);
            reject();
          });
      } else {
        console.debug("PRINT::closeConnection 3 [" + new Date().toJSON() + "]");
        reject();
      }
    });
  }

  public async checkConnection() {
    return new Promise((resolve, reject) => {
      if (cordova.plugins.zbtprinter) {
        cordova.plugins.zbtprinter.checkConnection(
          (result) => {
            console.debug("PRINT::checkConnection 1 [" + new Date().toJSON() + "]", result);
            resolve(result);
          }, (error) => {
            console.debug("PRINT::checkConnection 2 [" + new Date().toJSON() + "]", error);
            reject();
          });
      } else {
        console.debug("PRINT::checkConnection 3 [" + new Date().toJSON() + "]");
        reject();
      }
    });
  }

  public async reConnect() {
    console.debug("PRINT::reConnect 1 [" + new Date().toJSON() + "]");
    return new Promise((resolve, reject) => {
      if (cordova.plugins.zbtprinter) {
        cordova.plugins.zbtprinter.checkConnection(
          (result) => {
            console.debug("PRINT::reConnect 2 [" + new Date().toJSON() + "]", result);
            if (result == "connect") {
              resolve(result);
            } else {
              resolve(this.openConnection());
            }
          }, (error) => {
            console.debug("PRINT::reConnect 3 [" + new Date().toJSON() + "]", error);
            resolve(this.openConnection());
          });
      } else {
        console.debug("PRINT::reConnect 4 [" + new Date().toJSON() + "]");
        reject();
      }
    });
  }

  private async getConfiguredAddress(): Promise<string> {
    console.debug("PRINT::getConfiguredAddress 1 [" + new Date().toJSON() + "]");
    return <Promise<string>>(this.settingsService.getDeviceSettings()
      .then((incomingDataObservable) => new Promise((resolve, reject) => {
        console.debug("PRINT::getConfiguredAddress 2 [" + new Date().toJSON() + "]");
        incomingDataObservable.subscribe((settings: AppSettingsModel.AppSettings) =>
          resolve(settings.printerBluetoothMacAddress || "")
        );
      }))
    );
  }

  public async connect() {
    console.debug("PRINT::connect 1 [" + new Date().toJSON() + "]");
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
            console.debug("PRINT::connect 2 [" + new Date().toJSON() + "]");
            resolve();
          }, (error) => {
            console.debug("PRINT::connect 3 [" + new Date().toJSON() + "]", error);
            reject();
          }
        );
      } else {
        console.debug("PRINT::connect 4 [" + new Date().toJSON() + "]");
        reject();
      }
    });
  }

  public async print(printOptions: PrintModel.Print, macAddress?: string) {
    console.debug("PRINT::print 1 [" + new Date().toJSON() + "]", { printOptions, macAddress });
    printOptions.type = 0;

    if (macAddress) {
      this.address = macAddress;
    } else {
      this.address = await this.getConfiguredAddress();
    }
    console.debug("PRINT::print 2 [" + new Date().toJSON() + "]", { printOptions, macAddress: this.address });
    if (this.address) {
      return await this.toPrint(printOptions);
    } else {
      console.debug("PRINT::print 3 [" + new Date().toJSON() + "]", { printOptions, macAddress: this.address });
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
    console.debug("PRINT::printProductBoxTag 1 [" + new Date().toJSON() + "]", { strToPrint, macAddress: macAddress });
    if (macAddress) {
      this.address = macAddress;
    } else {
      this.address = await this.getConfiguredAddress();
    }
    console.debug("PRINT::printProductBoxTag 2 [" + new Date().toJSON() + "]", { strToPrint, macAddress: this.address });
    if (this.address) {
      return await this.toPrintFromString(strToPrint);
    } else {
      console.debug("PRINT::printProductBoxTag 3 [" + new Date().toJSON() + "]", { strToPrint, macAddress: this.address });
      return await this.connect()
        .then(() => this.toPrintFromString(strToPrint));
    }
  }

  /**
   * Turn an array of objects into string ready to be printed
   * @param options - the options to be converted in the needed string
   */
  buildString(options: Array<PrintModel.Print>): string {
    console.debug("PRINT::buildString 1 [" + new Date().toJSON() + "]", options);
    let strToPrint: string = "";
    /**If need separator between labels */
    let separator: string = "";
    options.forEach(option => {
      strToPrint += this.getTextToPrinter(option) + separator;
    });
    console.debug("PRINT::buildString 2 [" + new Date().toJSON() + "]", strToPrint);
    return strToPrint;
  }



  /**
   * Esta función es la equivalente a @see printProductBoxTag
   * pero con la diferencia que será usada para imprimir los precios
   * el asunto es que no sabía que labeltype correspondía a cada printOption
   * así que por ahora haré un diccionario y ustedes modifíquenlo a su conveniencia
   */
  public async printPricesInZebra(strToPrint: string, macAddress?: string) {
    console.debug("PRINT::printPricesInZebra 1 [" + new Date().toJSON() + "]", { strToPrint, macAddress });
    if (macAddress) {
      this.address = macAddress;
    } else {
      this.address = await this.getConfiguredAddress();
    }
    console.debug("PRINT::printPricesInZebra 2 [" + new Date().toJSON() + "]", { strToPrint, macAddress: this.address });
    if (this.address) {
      return await this.toPrintFromString(strToPrint);
    } else {
      console.debug("PRINT::printPricesInZebra 3 [" + new Date().toJSON() + "]", { strToPrint, macAddress: this.address });
      return await this.connect()
        .then(() => this.toPrintFromString(strToPrint));
    }
  }


  /**
   * Get products by reference in api
   * @returns an observable with the list of products needed
   */
  getProductsByReference(references: string[]): Promise<HttpRequestModel.Response> {
    console.debug("PRINT::getProductsByReference 1 [" + new Date().toJSON() + "]", references);
    return this.requestsProvider.post(this.getProductsByReferenceUrl, { references });
  }

  /**
   * Obtain the prices by reference and then print each of these prices
   * @param referencesObject - object with the array of references to be sended
   */
  printPrices(referencesObject) {

    console.log("para impirmir", referencesObject);
    console.debug("PRINT::printPrices 1 [" + new Date().toJSON() + "]", referencesObject);
    let observable: Observable<boolean> = new Observable(observer => observer.next(true)).pipe(flatMap(dummyValue => {
      let innerObservable: Observable<any> = new Observable(observer => {
        observer.next(true);
      }).pipe(flatMap((r) => {
        return new Observable(s => {
          console.debug("PRINT::printPrices 2 [" + new Date().toJSON() + "]", referencesObject);
          return s.next();
        })
      }));
      /**obtain the products */
      console.debug("PRINT::printPrices 3 [" + new Date().toJSON() + "]", referencesObject);
      return this.priceService.getIndexByModelTariff(referencesObject).pipe(flatMap((prices) => {
        let dataToPrint = this.processProductToPrintTagPrice(prices);
        console.debug("PRINT::printPrices 4 [" + new Date().toJSON() + "]", prices);
        innerObservable = innerObservable.pipe(flatMap(product => {
          return from(this.toPrintFromString(dataToPrint.valuePrint).catch((_ => { })));
        })).pipe(flatMap(response => {
          console.debug("PRINT::printPrices 5 [" + new Date().toJSON() + "]", response);
          return this.printNotify(dataToPrint.options.map(option => option.price.id));
        }));
        console.debug("PRINT::printPrices 6 [" + new Date().toJSON() + "]");
        return innerObservable;
      }));
    }));
    console.debug("PRINT::printPrices 7 [" + new Date().toJSON() + "]");
    return observable;
  }

  /**
   * Send notification to server after print any labels
   * @param ids - the ids of printed labels
   */
  printNotify(ids: Array<Number>): Observable<boolean> {
    console.log("okis doqui", ids);
    console.debug("PRINT::printNotify 1 [" + new Date().toJSON() + "]", ids);
    return this.http.post(this.printNotifyUrl, { references: ids }).pipe(map(response => {
      console.debug("PRINT::printNotify 2 [" + new Date().toJSON() + "]", ids);
      return true;
    }));
  }

  /**
   * Obtain product by reference and then print each of these products
   * @param listReferences references to print
   */
  printTagBarcode(listReferences: string[]): Observable<Boolean | Observable<any>> {
    console.debug("PRINT::printTagBarcode 1 [" + new Date().toJSON() + "]", listReferences);
    /** declare and obsevable to merge all print results */
    let observable: Observable<boolean | Observable<any>> = new Observable(observer => observer.next(true)).pipe(flatMap(dummyValue => {
      let innerObservable: Observable<any> = new Observable(observer => {
        observer.next(true);
      }).pipe(flatMap((r) => {
        return new Observable(s => {
          return s.next();
        })
      }));
      /**obtain the products */
      console.debug("PRINT::printTagBarcode 2 [" + new Date().toJSON() + "]", listReferences);
      return this.getProductsByReference(listReferences).then((response: HttpRequestModel.Response) => {
        console.debug("PRINT::getProductsByReference 2 [" + new Date().toJSON() + "]", response);
        let products = response.data;
        let dataToPrint = this.processProductToPrintTagBarcode(products);

        innerObservable = innerObservable.pipe(flatMap(product => {
          return from(this.toPrintFromString(dataToPrint));
        }));
        console.debug("PRINT::printTagBarcode 3 [" + new Date().toJSON() + "]", listReferences);
        return innerObservable;
      });
    }));
    console.debug("PRINT::printTagBarcode 4 [" + new Date().toJSON() + "]", listReferences);
    return observable;
  }

  public printTagBarcodeUsingProduct(product: ProductModel.Product) {
    console.debug("PRINT::printTagBarcodeUsingProduct 1 [" + new Date().toJSON() + "]", product);
    let dataToPrint = this.processProductToPrintTagBarcode(product);
    console.debug("PRINT::printTagBarcodeUsingProduct 2 [" + new Date().toJSON() + "]", dataToPrint);
    if (dataToPrint) {
      this.toPrintFromString(dataToPrint);
    }
  }

  private processProductToPrintTagBarcode(dataToProcess: (ProductModel.Product | Array<ProductModel.Product>)): string {
    console.debug("PRINT::processProductToPrintTagBarcode 1 [" + new Date().toJSON() + "]", dataToProcess);
    let options: Array<PrintModel.Print> = [];
    let arrayProductsToProcess: Array<ProductModel.Product> = [];

    if (!Array.isArray(dataToProcess)) {
      arrayProductsToProcess.push(dataToProcess);
    } else {
      arrayProductsToProcess = dataToProcess;
    }
    console.debug("PRINT::processProductToPrintTagBarcode 2 [" + new Date().toJSON() + "]", arrayProductsToProcess);
    /** Iterate and build object to print */
    for (let iProduct in arrayProductsToProcess) {
      let product = arrayProductsToProcess[iProduct];

      let printOptions: PrintModel.Print = {
        /** Build the needed data for print */
        type: 1,
        product: {
          productShoeUnit: {
            reference: product.reference,
            size: {
              name: product.size ? product.size.name : ''
            },
            manufacturer: {
              name: product.brand ? product.brand.name : ''
            },
            model: {
              name: product.model ? product.model.name : '',
              reference: product.model ? product.model.reference : '',
              color: {
                name: product.model.color ? product.model.color.name : ''
              },
              season: {
                name: product.season ? product.season.name : ''
              }
            }
          }
        }
      };

      /** Build the array for obtain the string to send to printer */
      options.push(printOptions);
    }

    console.debug("PRINT::processProductToPrintTagBarcode 3 [" + new Date().toJSON() + "]", options);
    if (options) {
      /** Obtain the string from options */
      return this.buildString(options);
    } else {
      return null;
    }
  }

  /**
   * Print the prices of products
   * @param listReferences references of products
   */
  printTagPrices(listReferences: string[]): Observable<Boolean | Observable<any>> {
    console.debug("PRINT::printTagPrices 1 [" + new Date().toJSON() + "]", listReferences);
    let observable: Observable<boolean | Observable<any>> = new Observable(observer => observer.next(true)).pipe(flatMap(dummyValue => {
      let innerObservable: Observable<any> = new Observable(observer => {
        observer.next(true);
      }).pipe(flatMap((r) => {
        return new Observable(s => {
          return s.next();
        })
      }));
      console.debug("PRINT::printTagPrices 2 [" + new Date().toJSON() + "]", listReferences);
      return this.priceService.postPricesByProductsReferences({ references: listReferences }).then((prices) => {
        let dataToPrint = this.processProductToPrintTagPrice(prices);
        console.debug("PRINT::printTagPrices 3 [" + new Date().toJSON() + "]", prices);
        innerObservable = innerObservable.pipe(flatMap(product => {
          return from(this.toPrintFromString(dataToPrint.valuePrint).catch((_ => { })));
        })).pipe(flatMap(response => {
          return this.printNotify(dataToPrint.options.map(option => option.price.id));
        }));
        return innerObservable;
      });
    }));
    console.debug("PRINT::printTagPrices 4 [" + new Date().toJSON() + "]", listReferences);
    return observable;
  }

  public printTagPriceUsingPrice(price) {
    console.debug("PRINT::printTagPriceUsingPrice 1 [" + new Date().toJSON() + "]", price);
    let dataToPrint = this.processProductToPrintTagPrice(price);
    console.debug("PRINT::printTagPriceUsingPrice 2 [" + new Date().toJSON() + "]", dataToPrint);
    if (dataToPrint) {
      this.toPrintFromString(dataToPrint.valuePrint);
    }
  }

  private processProductToPrintTagPrice(dataToProcess: (any | Array<any>)): { valuePrint, options } {
    console.debug("PRINT::processProductToPrintTagPrice 1 [" + new Date().toJSON() + "]", dataToProcess);
    const dictionaryOfCaseTypes = {
      "1": PrintModel.LabelTypes.LABEL_INFO_PRODUCT,
      "2": PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF,
      "3": PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF_OUTLET,
      "4": PrintModel.LabelTypes.LABEL_PRICE_WITH_TARIF_WITHOUT_DISCOUNT,
      "5": PrintModel.LabelTypes.LABEL_PRICE_WITH_TARIF_WITHOUT_DISCOUNT_OUTLET,
      "6": PrintModel.LabelTypes.LABEL_PRICE_WITH_TARIF_WITH_DISCOUNT,
      "7": PrintModel.LabelTypes.LABEL_PRICE_WITH_TARIF_WITH_DISCOUNT_OUTLET
    };

    let options: Array<PrintModel.Print> = [];
    let arrayPricesToProcess: Array<any> = [];

    if (!Array.isArray(dataToProcess)) {
      arrayPricesToProcess.push(dataToProcess);
    } else {
      arrayPricesToProcess = dataToProcess;
    }
    console.debug("PRINT::processProductToPrintTagPrice 2 [" + new Date().toJSON() + "]", arrayPricesToProcess);
    /** Iterate and build object to print */
    for (let iPrice in arrayPricesToProcess) {
      let price = arrayPricesToProcess[iPrice];

      if (price.typeLabel) {
        if (price.typeLabel == 7 && price.priceDiscount <= price.priceDiscountOutlet) {
          price.priceDiscount = price.priceDiscountOutlet;
          price.typeLabel = 5;
        }

        let printOptions: PrintModel.Print = {
          type: dictionaryOfCaseTypes[price.typeLabel],
          product: {
            productShoeUnit: {
              model: {
                reference: price.model.reference,
                name: price.model.name,
                color: {
                  name: price.model.color.name
                },
                detailColor: price.model.detailColor,
                lifestyle: price.model.lifestyle,
                category: price.model.category
              },
              manufacturer: {
                name: price.model.brand.name
              }
            }
          },
          price: {
            id: price.id,
            percent: price.percent,
            percentOutlet: price.percentOutlet,
            totalPrice: price.totalPrice.toString().replace('.', ','),
            priceOriginal: price.priceOriginal.toString().replace('.', ','),
            priceDiscount: price.priceDiscount.toString().replace('.', ','),
            priceDiscountOutlet: price.priceDiscountOutlet.toString().replace('.', ','),
            typeLabel: price.typeLabel,
            numRange: price.range ? price.range.numRange : 0,
            valueRange: this.getCorrectValueRange(price)
          }
        };

        /** Build the array for obtain the string to send to printer */
        options.push(printOptions);
      }
    }
    console.debug("PRINT::processProductToPrintTagPrice 3 [" + new Date().toJSON() + "]", options);
    if (options) {
      /** Obtain the string from options */
      return { valuePrint: this.buildString(options), options: options };
    } else {
      return null;
    }
  }

  private getCorrectValueRange(dataToObtainValueRange): string {
    console.debug("PRINT::getCorrectValueRange 1 [" + new Date().toJSON() + "]", dataToObtainValueRange);
    if (dataToObtainValueRange && dataToObtainValueRange.rangesNumbers) {
      let rangesNumbers = dataToObtainValueRange.rangesNumbers;
      if (rangesNumbers.sizeRangeNumberMin && rangesNumbers.sizeRangeNumberMax && rangesNumbers.sizeRangeNumberMin == rangesNumbers.sizeRangeNumberMax) {
        console.debug("PRINT::getCorrectValueRange 2 [" + new Date().toJSON() + "]", String(rangesNumbers.sizeRangeNumberMin));
        return String(rangesNumbers.sizeRangeNumberMin);
      } else {
        console.debug("PRINT::getCorrectValueRange 3 [" + new Date().toJSON() + "]", String(rangesNumbers.sizeRangeNumberMin) + '-' + String(rangesNumbers.sizeRangeNumberMax));
        return String(rangesNumbers.sizeRangeNumberMin) + '-' + String(rangesNumbers.sizeRangeNumberMax);
      }
    } else {
      return '';
    }
  }

  tail: Array<string> = [];
  /**es el texto que se va a imprimir, pero también funciona a modo de bandera que nos dice si algo está imprimiéndose */
  tailStr: string = "";
  printInterval;
  failed = false;


  /**
   * Print labels with the zebra printed from string
   * @param textToPrint - string to be printed
   * @param failed - the solicitude comes from a failed request
   */
  private async toPrintFromString(textToPrint: string, macAddress?) {
    console.debug("PRINT::toPrintFromString 1 [" + new Date().toJSON() + "]", { textToPrint, macAddress });
    /**añadimos esto a la lógica del toPrint */
    if (macAddress) {
      this.address = macAddress;
      console.debug("PRINT::toPrintFromString 2 [" + new Date().toJSON() + "]", { textToPrint, macAddress: this.address });
    } else {
      this.address = await this.getConfiguredAddress();
      console.debug("PRINT::toPrintFromString 3 [" + new Date().toJSON() + "]", { textToPrint, macAddress: this.address });
    }

    console.debug("PRINT::toPrintFromString 4 [" + new Date().toJSON() + "]", { textToPrint, macAddress: this.address });
    if (!this.address) {
      await this.connect();
      console.debug("PRINT::toPrintFromString 5 [" + new Date().toJSON() + "]", { textToPrint, macAddress: this.address });
    }

    console.debug("PRINT::toPrintFromString 6 [" + new Date().toJSON() + "]", { textToPrint, macAddress: this.address });
    if (this.address) {
      if (typeof cordova != "undefined" && cordova.plugins.zbtprinter) {
        console.debug("PRINT::toPrintFromString 7 [" + new Date().toJSON() + "]", { textToPrint, macAddress: this.address });
        return new Promise((resolve, reject) => {
          let printAttempts = 0;
          console.debug("PRINT::toPrintFromString 8 [" + new Date().toJSON() + "]", { textToPrint, macAddress: this.address, printAttempts });
          let tryToPrintFn = () => {
            printAttempts++;
            console.debug("PRINT::toPrintFromString 9 [" + new Date().toJSON() + "]", { textToPrint, macAddress: this.address, printAttempts });
            cordova.plugins.zbtprinter.printWithConnection(this.address, textToPrint,
              (success) => {
                console.debug("PRINT::toPrintFromString 10 [" + new Date().toJSON() + "]", { textToPrint, macAddress: this.address, printAttempts });
                //console.debug("Zbtprinter print success: " + success, { text: printOptions.text || printOptions.product.productShoeUnit.reference, mac: this.address, textToPrint: textToPrint });
                resolve();
              }, (fail) => {
                console.debug("PRINT::toPrintFromString 11 [" + new Date().toJSON() + "]", { textToPrint, macAddress: this.address, printAttempts });
                if (printAttempts >= PrinterService.MAX_PRINT_ATTEMPTS) {
                  console.debug("PRINT::toPrintFromString 12 [" + new Date().toJSON() + "]", { textToPrint, macAddress: this.address, printAttempts });
                  //console.debug("Zbtprinter print finally fail:" + fail, { text: printOptions.text || printOptions.product.productShoeUnit.reference, mac: this.address, textToPrint: textToPrint });
                  this.presentToast('No ha sido posible conectarse con la impresora', 'danger');
                  reject();
                } else {
                  console.debug("PRINT::toPrintFromString 13 [" + new Date().toJSON() + "]", { textToPrint, macAddress: this.address, printAttempts });
                  //console.debug("Zbtprinter print attempt " + printAttempts + " fail:" + fail + ", retrying...", { text: printOptions.text || printOptions.product.productShoeUnit.reference, mac: this.address, textToPrint: textToPrint });
                  setTimeout(tryToPrintFn, 1000);
                }
              }
            );
          };
          tryToPrintFn();
        });
      } else {
        console.debug("PRINT::toPrintFromString 14 [" + new Date().toJSON() + "]", { textToPrint, macAddress: this.address });
      }
    } else {
      console.debug("PRINT::toPrintFromString 15 [" + new Date().toJSON() + "]", { textToPrint, macAddress: this.address });
    }
  }


  private async toPrint(printOptions: PrintModel.Print) {
    console.debug("PRINT::toPrint 1 [" + new Date().toJSON() + "]", printOptions);
    if (this.address) {
      if (typeof cordova != "undefined" && cordova.plugins.zbtprinter) {
        let textToPrint = this.getTextToPrinter(printOptions);
        return new Promise((resolve, reject) => {
          let printAttempts = 0;
          console.debug("PRINT::toPrint 2 [" + new Date().toJSON() + "]", { printOptions, address: this.address, printAttempts });
          let tryToPrintFn = () => {
            printAttempts++;
            console.debug("PRINT::toPrint 3 [" + new Date().toJSON() + "]", { printOptions, address: this.address, printAttempts });
            cordova.plugins.zbtprinter.printWithConnection(this.address, textToPrint,
              (success) => {
                console.debug("PRINT::toPrint 4 [" + new Date().toJSON() + "]", { printOptions, address: this.address, printAttempts, success });
                resolve();
              }, (fail) => {
                if (printAttempts >= PrinterService.MAX_PRINT_ATTEMPTS) {
                  console.debug("PRINT::toPrint 5 [" + new Date().toJSON() + "]", { printOptions, address: this.address, printAttempts });
                  this.presentToast('No ha sido posible conectarse con la impresora', 'danger');
                  reject();
                } else {
                  console.debug("PRINT::toPrint 6 [" + new Date().toJSON() + "]", { printOptions, address: this.address, printAttempts });
                  setTimeout(tryToPrintFn, 1000);
                }
              }
            );
          };
          tryToPrintFn();
        });
      } else {
        console.debug("PRINT::toPrint 7 [" + new Date().toJSON() + "]", { printOptions, address: this.address });
      }
    } else {
      console.debug("PRINT::toPrint 8 [" + new Date().toJSON() + "]", { printOptions, address: this.address });
    }
  }

  private getTextToPrinter(printOptions: PrintModel.Print) {
    console.debug("PRINT::getTextToPrinter 1 [" + new Date().toJSON() + "]", printOptions);
    let toPrint = '';
    let toPrintReturn = '';
    if (printOptions.text) {
      for (let i = 0; i < printOptions.text.length; i++) {
        toPrintReturn += this.addTextToPrint(toPrint, printOptions.text[i], printOptions);
      }
    } else {
      toPrintReturn += this.addTextToPrint(toPrint, printOptions.product.productShoeUnit.reference, printOptions);
    }
    console.debug("PRINT::getTextToPrinter 2 [" + new Date().toJSON() + "]", { printOptions, toPrintReturn });
    return toPrintReturn;
  }

  private addTextToPrint(toPrint, stringToBarcode, printOptions) {
    console.debug("PRINT::addTextToPrint 1 [" + new Date().toJSON() + "]", { toPrint, stringToBarcode, printOptions });
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
        /*
         * Original Code
        ^XA^LH30,5^CI27^AVN^FO1,5^FD@item^FS^AVN^FO0,15^FB325,1,0,R,0^FD@talla^FS^ABN^FO3,70^FD@brand^FS^ABN^FO3,85^FD@style^FS^ABN^FO3,100^FD@detcol^FS^AQN^FO0,110^FB325,1,0,R,0^FD@season^FS^FO10,125^BY2,3.0^BCN,40,Y,N,N^FD>;@barcode^FS^XZ
        */
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
        /*
         * Original Code
        ^XA^LH28,0^CI27^AFN^FO0,30^FB320,1,0,R,0^FD@iniciales^FS^ADN^FO10,95^FB320,1,0,R,0^FD@porcent^FS^AVN^FO0,55^FB320,1,0,C,0^FD@saleprice1 €^FS^AP^FO0,115^GB320,0,3^FS^AQ^FWB^FO5,123^FD@item^FS^LH28,0^FWN^FO40,125^BY2,3.0^BCN,50,N,N,N^FD@barcode^FS^AAN^FO0,145^FB330,1,0,R,0^FD@brand^FS^AAN^FO10,190^FB315,1,0,L,0^FD@style^FS^AAN^FO0,190^FB315,1,0,R,0^FD@detcol^FS^ADN^FO0,125^FB330,1,0,R,0^FD@siglas^FS^ADN^FO0,157^FB330,1,0,R,0^FD@TagSzRng^FS^XZ
        */
        toPrint = "^XA^CI28^LH28,0^AFN^FO0,30^FB320,1,0,R,0^FD"
          + printOptions.product.productShoeUnit.model.reference
          + "^FS^ADN^FO10,95^FB320,1,0,R,0^FD";
        toPrint += "^FS^AVN^FO0,55^FB320,1,0,C,0^FD";
        if (printOptions.price.priceOriginal) {
          toPrint += printOptions.price.priceOriginal + ' €';
        }
        toPrint += "^FS^AP^FO0,115^GB320,0,3^FS^AQ^FWB^FO5,123^FD";
        if (printOptions.product.productShoeUnit.model.lifestyle && printOptions.product.productShoeUnit.model.lifestyle.reference && printOptions.product.productShoeUnit.model.category) {
          toPrint += printOptions.product.productShoeUnit.model.lifestyle.reference.substring(0, 1) + printOptions.product.productShoeUnit.model.category.reference;
        }
        toPrint += "^FS^LH28,0^FWN^FO40,125^BY2,3.0^BCN,50,N,N,N^FD"
          + printOptions.product.productShoeUnit.model.reference
          + "^FS^AAN^FO0,145^FB330,1,0,R,0^FD"
          + printOptions.product.productShoeUnit.manufacturer.name
          + "^FS^AAN^FO10,190^FB315,1,0,L,0^FD"
          + printOptions.product.productShoeUnit.model.name
          + "^FS^AAN^FO0,190^FB315,1,0,R,0^FD";
        if (printOptions.product.productShoeUnit.model.detailColor) {
          toPrint += printOptions.product.productShoeUnit.model.detailColor;
        }
        toPrint += "^FS^ADN^FO0,125^FB330,1,0,R,0^FD"
          + "^FS^ADN^FO0,157^FB330,1,0,R,0^FD";
        if (printOptions.price.valueRange) {
          toPrint += printOptions.price.valueRange;
        }
        toPrint += "^FS^XZ";
        break;
      case PrintModel.LabelTypes.LABEL_PRICE_WITH_TARIF_WITH_DISCOUNT: // Tag with current product price and previous price
        /*
         * Original Code
        ^XA^LH28,0^CI27^AFN^FO0,30^FB320,1,0,R,0^FD@iniciales^FS^ADN^FO8,108^FB320,1,0,R,0^FD@porcent^FS^AEN^FO10,30^FB310,1,0,L,0^FD@saleprice1€^FS^FO25,25^GD90,30,8,B,L^FS^FO25,25^GD90,30,8,B,R^FS^AVN^FO0,58^FB340,1,0,C,0^FD@saleprice2 €^FS^AP^FO0,123^GB335,0,3^FS^AQ^FWB^FO5,130^FD@item^FS^FWN^FO40,135^BY2,3.0^BCN,50,N,N,N^FD@barcode^FS^ADN^FO0,130^FB330,1,0,R,0^FD@siglas^FS^AAN^FO0,155^FB330,1,0,R,0^FD@brand^FS^ADN^FO0,175^FB330,1,0,R,0^FD@TagSzRng^FS^XZ
        */
        toPrint = "^XA^CI28^LH28,0^AFN^FO0,30^FB320,1,0,R,0^FD^FS^ADN^FO8,108^FB320,1,0,R,0^FD";
        if (printOptions.price.percent) {
          toPrint += printOptions.price.percent + '%';
        }
        toPrint += "^FS^AEN^FO10,30^FB310,1,0,L,0^FD";
        if (printOptions.price.priceOriginal) {
          toPrint += printOptions.price.priceOriginal + ' €';
        }
        toPrint += "^FS^FO25,25^GD90,30,8,B,L^FS^FO25,25^GD90,30,8,B,R^FS^AVN^FO0,58^FB340,1,0,C,0^FD";
        if (printOptions.price.priceDiscount) {
          toPrint += printOptions.price.priceDiscount + '€';
        }
        toPrint += "^FS^AP^FO0,123^GB335,0,3^FS^AQ^FWB^FO5,130^FD"
          + printOptions.product.productShoeUnit.model.reference
          + "^FS^FWN^FO40,135^BY2,3.0^BCN,50,N,N,N^FD"
          + printOptions.product.productShoeUnit.model.reference
          + "^FS^AAN^FO0,155^FB330,1,0,R,0^FD";
        // toPrint += 'name';
        toPrint += "^FS^ADN^FO0,175^FB330,1,0,R,0^FD";
        if (printOptions.price.valueRange) {
          toPrint += printOptions.price.valueRange;
        }
        toPrint += "^FS^XZ";
        break;
      case PrintModel.LabelTypes.LABEL_PRICE_WITHOUT_TARIF_OUTLET: // Tag with original product pvp and product pvp for outlet
      case PrintModel.LabelTypes.LABEL_PRICE_WITH_TARIF_WITHOUT_DISCOUNT_OUTLET: // Tag with original product pvp and product pvp for outlet
        /*
         * Original Code
        ^XA^LH28,0^CI27^AFN^FO0,30^FB320,1,0,R,0^FD@iniciales^FS^AFN^FO0,30^FB310,1,0,L,0^FDPVP:@saleprice1€^FS^AUN^FO0,80^FB335,1,0,R,0^FD@saleprice4 €^FS^ARN^FO0,80^FB340,1,0,L,0^FDPVP Outlet:^FS^AP^FO0,127^GB335,0,3^FS^AQ^FWB^FO5,135^FD@item^FS^FWN^FO40,155^BY2,3.0^BCN,50,N,N,N^FD@barcode^FS^ADN^FO0,137^FB330,1,0,R,0^FD@siglas^FS^ADN^FO0,155^FB330,1,0,R,0^FD@porcent^FS^ADN^FO0,175^FB330,1,0,R,0^FD@TagSzRng^FS^XZ
        */
        toPrint = "^XA^CI28^LH28,0^AFN^FO0,30^FB320,1,0,R,0^FD";
        // toPrint += 'TagSzRng';
        toPrint += "^FS^AFN^FO0,30^FB310,1,0,L,0^FD"
          + "PVP:";
        if (printOptions.price.priceOriginal) {
          toPrint += printOptions.price.priceOriginal + ' €';
        }
        toPrint += "^FS^AUN^FO0,80^FB335,1,0,R,0^FD";
        if (printOptions.price.priceDiscount) {
          toPrint += printOptions.price.priceDiscount + ' €';
        }
        toPrint += "^FS^ARN^FO0,80^FB340,1,0,L,0^FD"
          + "PVP Outlet:"
          + "^FS^AP^FO0,127^GB335,0,3^FS^AQ^FWB^FO5,135^FD"
          + printOptions.product.productShoeUnit.model.reference
          + "^FS^FWN^FO40,155^BY2,3.0^BCN,50,N,N,N^FD"
          + printOptions.product.productShoeUnit.model.reference
          + "^FS^ADN^FO0,137^FB330,1,0,R,0^FD^FS^ADN^FO0,155^FB330,1,0,R,0^FD";
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
        /*
         * Original Code
        ^XA^LH28,0^CI27^AFN^FO0,30^FB320,1,0,R,0^FD@iniciales^FS^AFN^FO0,30^FB310,1,0,L,0^FDPVP:@saleprice1€^FS^AFN^FO0,60^FB310,1,0,L,0^FDPVP Outlet:@saleprice4€^FS^ATN^FO0,90^FB335,1,0,R,0^FD@saleprice5 €^FS^ARN^FO0,100^FB340,1,0,L,0^FDÚltimo precio:^FS^AP^FO0,127^GB335,0,3^FS^AQ^FWB^FO5,135^FD@item^FS^FWN^FO40,155^BY2,3.0^BCN,50,N,N,N^FD@barcode^FS^ADN^FO0,137^FB330,1,0,R,0^FD@siglas^FS^ADN^FO0,155^FB330,1,0,R,0^FD@porcent^FS^ADN^FO10,175^FB320,1,0,R,0^FD@TagSzRng^FS^XZ
        */
        toPrint = "^XA^CI28^LH28,0^AFN^FO0,30^FB320,1,0,R,0^FD";
        toPrint += "^FS^AFN^FO0,30^FB310,1,0,L,0^FD"
          + "PVP:";
        if (printOptions.price.priceOriginal) {
          toPrint += printOptions.price.priceOriginal + ' €';
        }
        toPrint += "^FS^AFN^FO0,60^FB310,1,0,L,0^FD"
          + "PVP Outlet:";
        if (printOptions.price.priceDiscount) {
          toPrint += printOptions.price.priceDiscount + ' €';
        }
        toPrint += "^FS^ATN^FO0,90^FB335,1,0,R,0^FD";
        if (printOptions.price.priceDiscountOutlet) {
          toPrint += printOptions.price.priceDiscountOutlet + ' €';
        }
        toPrint += "^FS^ARN^FO0,100^FB340,1,0,L,0^FD"
          + "Último precio:"
          + "^FS^AP^FO0,127^GB335,0,3^FS^AQ^FWB^FO5,135^FD"
          + printOptions.product.productShoeUnit.model.reference
          + "^FS^FWN^FO40,155^BY2,3.0^BCN,50,N,N,N^FD"
          + printOptions.product.productShoeUnit.model.reference
          + "^FS^ADN^FO0,137^FB330,1,0,R,0^FD^FS^ADN^FO0,155^FB330,1,0,R,0^FD";
        if (printOptions.price.percentOutlet) {
          toPrint += printOptions.price.percentOutlet + '%';
        }
        toPrint += "^FS^ADN^FO10,175^FB320,1,0,R,0^FD";
        if (printOptions.price.valueRange) {
          toPrint += printOptions.price.valueRange;
        }
        toPrint += "^FS^XZ";
        break;
    }
    console.debug("PRINT::addTextToPrint 2 [" + new Date().toJSON() + "]", { toPrint, stringToBarcode, printOptions });
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
      JsBarcode("#" + reference, reference);
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
            img { width: 20%; height: auto; margin-right: 0.6cm; margin-top: 20px; }
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

        resolve();
      }));
  }

}
