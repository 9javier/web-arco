import { Injectable } from '@angular/core';

declare var JsBarcode;
declare var Canvas;

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {

  private _referencesToPrint: string[] = [];

  constructor() {}

  printBarcodes(listBarcodes: string[]) {
    var html = '<html><head></head><body>';
    for (let barcode of listBarcodes) {
      html += '<svg id="barcode"></svg>';
      let canvas = new Canvas();
      let result = JsBarcode(canvas, "Hi world!");
      console.debug('Test::Result -> ', result);
    }
    html += '</body></html>';
    var uri = "data:text/html," + encodeURIComponent(html);
    var newWindow = window.open(uri);
  }

  get referencesToPrint(): string[] {
    return this._referencesToPrint;
  }

  set referencesToPrint(value: string[]) {
    this._referencesToPrint = value;
  }
}
