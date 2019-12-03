import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonInput, ModalController, NavParams } from '@ionic/angular';
import { SorterInputService } from '../../../../../services/src/lib/endpoint/sorter-input/sorter-input.service';
import { InputSorterModel } from '../../../../../services/src/models/endpoints/InputSorter';
import { HttpRequestModel } from '../../../../../services/src/models/endpoints/HttpRequest';
import { IntermediaryService } from '@suite/services';
import {KeyboardService} from "../../../../../services/src/lib/keyboard/keyboard.service";

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
    private keyboardService: KeyboardService,
  ) { }

  @ViewChild('input') inputElement: IonInput;

  ngOnInit() {
    this.productReference = this.navParams.data.productScanned.reference;
    this.referenceModel = this.navParams.data.productScanned.model.reference;
    this.sizeName = this.navParams.data.productScanned.size.name;
    this.destinyWarehouse = this.navParams.data.productScanned.destinyWarehouse;
    this.inputElement.setFocus();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.inputElement.setFocus();
    }, 800);
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
        let errorMessage = 'Ha ocurrido un error al procesar la estantería escaneda.';
        if (error.error) {
          if (error.error.errors) {
            errorMessage = error.error.errors;
          } else if (error.error.statusCode === 404) {
            errorMessage = 'Estante Anexo incorrecto';
          } else if (error.error.statusCode === 405) {
            errorMessage = 'El Almacen del producto no coincide con la estanteria Anexa';
          }
        }
        await this.intermediaryService.presentToastError(errorMessage, 1500);
      });
  }

  public onFocus(event){
    if(event && event.target && event.target.id){
      this.keyboardService.setInputFocused(event.target.id);
    }
  }
}
