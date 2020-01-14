import {Component, OnInit} from '@angular/core';
import {LoadingController, ToastController} from "@ionic/angular";
import {ItemReferencesProvider} from "../../../../services/src/providers/item-references/item-references.provider";
import {environment as al_environment} from "../../../../../apps/al/src/environments/environment";
import {AudioProvider} from "../../../../services/src/providers/audio-provider/audio-provider.provider";
import {MatTableDataSource} from '@angular/material';
import {CarrierService, IntermediaryService} from '@suite/services';
import { FormBuilder, FormGroup } from '@angular/forms';
import {ShopsTransfersService} from "../../../../services/src/lib/endpoint/shops-transfers/shops-transfers.service";
import {ShopsTransfersModel} from "../../../../services/src/models/endpoints/ShopsTransfers";
import { KeyboardService } from "../../../../services/src/lib/keyboard/keyboard.service";
import { ToolbarProvider } from "../../../../services/src/providers/toolbar/toolbar.provider";

@Component({
  selector: 'suite-input-codes',
  templateUrl: './input-codes.component.html',
  styleUrls: ['./input-codes.component.scss']
})
export class InputCodesComponent implements OnInit {

  placeholderDataToWrite: string = 'EMBALAJE';
  codeWrote: string = null;
  lastCodeScanned: string = 'start';
  msgTop: string = 'Escanea un embalaje';

  private isProcessStarted: boolean = false;
  public packingReferenceOrigin: string = null;
  displayedColumns = ['destiny', 'articles'];
  dataSourceDestinies: MatTableDataSource<{reference: string, name: string, numProducts: number}>;
  dataSourcePacking: MatTableDataSource<{reference: string}>;
  totalProducts: number = null;
  totalDestinies: number = null;
  totalPacking: number = null;
  references: string[] = [];
  private loading: HTMLIonLoadingElement = null;

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
    private audioProvider: AudioProvider,
    private keyboardService: KeyboardService,
    private toolbarProvider: ToolbarProvider,
    private shopTransfersService: ShopsTransfersService
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    },500);
  }

  ngOnInit() {

  }

  async getCarriers(jailReference) {
    await this.intermediaryService.presentLoading();
    this.shopTransfersService.getInfoByPacking(jailReference).then((data: ShopsTransfersModel.ResponseInfoByPacking) => {
      if(data.code == 200){
        let destinies = data.data.list_destinies.map(destiny => {
          return {
            reference: destiny.reference,
            name: destiny.name,
            numProducts: destiny.total_products
          }
        });
        let jails = data.data.list_packing.map(packing => {
          return {
            reference: packing.reference,
          }
        });
        this.totalPacking = data.data.total_packing;
        this.totalDestinies = data.data.total_destinies;
        this.totalProducts = data.data.total_products;
        this.dataSourceDestinies = new MatTableDataSource(destinies);
        this.dataSourcePacking = new MatTableDataSource(jails);
        let packings = this.dataSourcePacking.filteredData;
        let packing = null;
        for(packing of packings){
          this.references.push(packing.reference);
        }
        this.audioProvider.playDefaultOk();
        this.isProcessStarted = true;
        this.packingReferenceOrigin = jailReference;
      }else{
          this.packingReferenceOrigin = null;
          this.audioProvider.playDefaultError();
          this.presentToast(data.errors, 'danger');
      }

    });
    setTimeout(() => {
      this.intermediaryService.dismissLoading();
    }, 500);
  }

  reload() {
    this.packingReferenceOrigin = null;
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    },500);
  }

  async keyUpInput(event) {
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
          this.getCarriers(dataWrote);
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

  public onFocus(event){
    if(event && event.target && event.target.id){
      this.keyboardService.setInputFocused(event.target.id);
    }
  }

}
