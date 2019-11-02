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
  destinyWarehouse: any;
  inputValue: '';
  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private sorterInputService: SorterInputService,
    private intermediaryService: IntermediaryService,
  ) { }

  @ViewChild('input')  inputElement: IonInput;

  ngOnInit() {
    console.log(this.navParams.data);
    this.productReference = this.navParams.data.productScanned.reference;
    this.referenceModel = this.navParams.data.productScanned.model.reference;
    this.sizeName = this.navParams.data.productScanned.size.name;
    this.destinyWarehouse = this.navParams.data.productScanned.destinyWarehouse;
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
          errorMessage = 'No se pudo encontrar la Jaula';
        } else if (error.error.statusCode === 405) {
          errorMessage = 'El destino del producto no coincide con el del rack';
        }
        await this.intermediaryService.presentToastError(errorMessage, 1500);
      });
  }
}
