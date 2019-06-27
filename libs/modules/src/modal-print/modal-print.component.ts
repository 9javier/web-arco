import { Component, OnInit } from '@angular/core';
import JsBarcode from 'jsbarcode';
import {ModalController} from "@ionic/angular";
import {PdfGeneratorService} from "../../../services/src/lib/pdf-generator/pdf-generator.service";

@Component({
  selector: 'suite-ui-crud-modal-print',
  templateUrl: './modal-print.component.html',
  styleUrls: ['./modal-print.component.scss']
})
export class ModalPrintComponent implements OnInit {

  referencesToPrint: string[] = [];

  constructor(
    private modalController: ModalController,
    private pdfGeneratorService: PdfGeneratorService
  ) {}

  ngOnInit() {
    this.referencesToPrint = this.pdfGeneratorService.referencesToPrint;
    let divBarcodes = document.getElementById('list-barcodes');
    for (let reference of this.referencesToPrint) {
      let newImage = document.createElement('img');
      newImage.id = reference;
      newImage.className = 'barcode';
      divBarcodes.appendChild(newImage);
      JsBarcode("#"+reference, reference);
    }
  }

  goToList() {
    this.modalController.dismiss();
  }

  printCodes() {
    let myWindow = window.open('', 'PRINT', 'height=400,width=600');

    myWindow.document.write('<html><head><title>' + document.title  + '</title>');
    myWindow.document.write('</head><body >');
    myWindow.document.write(document.getElementById('list-barcodes').innerHTML);
    myWindow.document.write('</body></html>');

    myWindow.document.close(); // necessary for IE >= 10
    myWindow.focus(); // necessary for IE >= 10*/

    myWindow.print();
    myWindow.close();

    return true;
  }

}
