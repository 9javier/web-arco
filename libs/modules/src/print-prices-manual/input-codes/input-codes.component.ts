import {Component, Input, OnInit} from '@angular/core';
import {ToastController} from "@ionic/angular";
import {PrinterService} from "../../../../services/src/lib/printer/printer.service";

@Component({
  selector: 'suite-input-codes',
  templateUrl: './input-codes.component.html',
  styleUrls: ['./input-codes.component.scss']
})
export class InputCodesComponent implements OnInit {

  dataToWrite: string = 'PRODUCTO';
  inputProduct: string = null;
  lastCodeScanned: string = 'start';

  @Input() typeTags: number = 1;
  public typeTagsBoolean: boolean = false;

  constructor(
    private toastController: ToastController,
    private printerService: PrinterService
  ) {
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    },500);
  }

  async ngOnInit() {
    this.typeTagsBoolean = this.typeTags != 1;
  }

  keyUpInput(event) {
    let dataWrote = (this.inputProduct || "").trim();

    if (event.keyCode == 13 && dataWrote) {
      if (dataWrote === this.lastCodeScanned) {
        this.inputProduct = null;
        return;
      }
      this.lastCodeScanned = dataWrote;

      if (dataWrote.length == 18) {
        if (!this.typeTagsBoolean) {
          this.typeTags = 1;
        } else {
          this.typeTags = 2;
        }

        switch (this.typeTags) {
          case 1:
            this.inputProduct = null;
            this.printerService.printTagBarcode([dataWrote])
              .subscribe((res) => {
                console.log('Printed product tag ... ', res);
              }, (error) => {
                console.warn('Error to print tag ... ', error);
              });
            break;
          case 2:
            this.inputProduct = null;
            this.printerService.printTagPrices([dataWrote])
              .subscribe((res) => {
                console.log('Printed price tag ... ', res);
              }, (error) => {
                console.warn('Error to print tag ... ', error);
              });
            break;
        }
      } else {
        let typeCode = 'caja';
        if (this.typeTags == 2) {
          typeCode = 'precio';
        }
        this.inputProduct = null;
        this.presentToast(`Escanea un código de caja para imprimir la etiqueta de ${typeCode} del producto.`, 'danger');
      }
    }
  }

  private async presentToast(msg: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: msg,
      position: 'bottom',
      duration: 1500,
      color: color
    });

    toast.present()
      .then(() => {
        setTimeout(() => {
          document.getElementById('input-ta').focus();
        },500);
      });
  }

}
