import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonInput, ModalController, NavParams } from '@ionic/angular';
import { SorterInputService } from '../../../../../services/src/lib/endpoint/sorter-input/sorter-input.service';
import { InputSorterModel } from '../../../../../services/src/models/endpoints/InputSorter';
import { HttpRequestModel } from '../../../../../services/src/models/endpoints/HttpRequest';
import { IntermediaryService } from '@suite/services';

@Component({
  selector: 'suite-scanner-rack',
  templateUrl: './scanner-rack.component.html',
  styleUrls: ['./scanner-rack.component.scss'],
})
export class ScannerRackComponent implements OnInit, AfterViewInit {
  productReference: '';
  referenceModel: '';
  sizeName: '';
  colorHex: '';
  inputValue: '';
  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private sorterInputService: SorterInputService,
    private intermediaryService: IntermediaryService,
  ) { }

  @ViewChild('input') inputElement: IonInput;

  ngOnInit() {
    this.productReference = this.navParams.data.productReference;
    this.referenceModel = this.navParams.data.model;
    this.sizeName = this.navParams.data.sizeName;
    this.colorHex = this.navParams.data.colorHex;
    this.inputElement.setFocus();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.inputElement.setFocus();
    }, 2000);
  }

  async close(isClose = false) {
    await this.modalCtrl.dismiss({ productReference: this.productReference, close: isClose });
  }

  async keyUpInput(event) {
    const dataWrote = (this.inputValue || "").trim();
    if (event.keyCode === 13 && dataWrote) {
      await this.scanToRack()
    }
  }

  private scanToRack() {
    this.sorterInputService
      .postRackScan({ productReference: this.productReference, rackReference: this.inputValue })
      .subscribe(async (res: InputSorterModel.RackScan) => {
        await this.close()
      }, async (error: HttpRequestModel.Error) => {
        console.log(error);
        let errorMessage = 'Error desconocido, intente nuevamente';
        if (error.error.statusCode === 404) {
          errorMessage = 'Estante Anexo incorrecto';
        } else if (error.error.statusCode === 405) {
          errorMessage = 'El Almacen del producto no coincide con la estanteria Anexa';
        }
        await this.intermediaryService.presentToastError(errorMessage, 1500);
      });
  }
}
