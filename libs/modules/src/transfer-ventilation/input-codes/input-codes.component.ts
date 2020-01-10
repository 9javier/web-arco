import {Component, OnInit} from '@angular/core';
import {LoadingController, ToastController} from "@ionic/angular";
import {ItemReferencesProvider} from "../../../../services/src/providers/item-references/item-references.provider";
import {environment as al_environment} from "../../../../../apps/al/src/environments/environment";
import {AudioProvider} from "../../../../services/src/providers/audio-provider/audio-provider.provider";
import {CarrierModel} from 'libs/services/src/models/endpoints/carrier.model';
import {MatTableDataSource} from '@angular/material';
import {CarrierService, IntermediaryService} from '@suite/services';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'suite-input-codes',
  templateUrl: './input-codes.component.html',
  styleUrls: ['./input-codes.component.scss']
})
export class InputCodesComponent implements OnInit {

  placeholderDataToWrite: string = 'JAULA';
  codeWrote: string = null;
  lastCodeScanned: string = 'start';
  msgTop: string = 'Escanea una jaula';

  private isProcessStarted: boolean = false;
  public packingReferenceOrigin: string = null;
  public jails: string[] = ["J0008","J0010","J0016","J0009","J0006","J0013"];
  displayedColumns = ['destiny', 'articles'];
  dataSource: MatTableDataSource<{destiny: string, articles: number}>;
  private loading: HTMLIonLoadingElement = null;

  carriers: Array<CarrierModel.Carrier> = [];

  toDelete: FormGroup = this.formBuilder.group({
    jails: this.formBuilder.array([])
  });

  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;

  constructor(
    private formBuilder: FormBuilder,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private carrierService: CarrierService,
    private intermediaryService: IntermediaryService,
    private itemReferencesProvider: ItemReferencesProvider,
    private audioProvider: AudioProvider
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    },800);
  }

  ngOnInit() {

  }

  getCarriers(): void {
    this.intermediaryService.presentLoading();
      setTimeout(() => {
        let carriers = [
          {
            destiny: "005 : MINIPRECIOS",
            articles: 20
          },
          {
            destiny: "000 : Almacén CLOUD",
            articles: 30
          },
          {
            destiny: "miniprecios",
            articles: 20
          },{
            destiny: "miniprecios",
            articles: 20
          }
        ];
        this.dataSource = new MatTableDataSource(carriers);
        this.intermediaryService.dismissLoading();
      }, 1000);
  }

  reload() {
    this.packingReferenceOrigin = null;
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    },500);
  }

  keyUpInput(event) {
    let dataWrote = (this.codeWrote || "").trim();

    if (event.keyCode == 13 && dataWrote) {

      this.codeWrote = null;
      if (dataWrote === this.lastCodeScanned) {
        return;
      }
      this.lastCodeScanned = dataWrote;

      if (this.timeoutStarted) {
        clearTimeout(this.timeoutStarted);
      }
      this.timeoutStarted = setTimeout(() => this.lastCodeScanned = 'start', this.timeMillisToResetScannedCode);

      if (this.itemReferencesProvider.checkCodeValue(dataWrote) == this.itemReferencesProvider.codeValue.PACKING) {
          this.audioProvider.playDefaultOk();
          this.isProcessStarted = true;
          this.packingReferenceOrigin = dataWrote;
          this.getCarriers();
      } else {
        this.audioProvider.playDefaultError();
        this.presentToast('El código escaneado no es válido para la operación que se espera realizar.', 'danger');
      }
    }
  }

  private async showLoading(message: string) {
    this.loading = await this.loadingController.create({
      message: message,
      translucent: true,
    });
    return await this.loading.present();
  }

  private hideLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
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
