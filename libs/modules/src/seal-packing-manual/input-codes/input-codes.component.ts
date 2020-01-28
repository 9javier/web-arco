import {Component, OnInit} from '@angular/core';
import {ItemReferencesProvider} from "../../../../services/src/providers/item-references/item-references.provider";
import {CarriersService} from "../../../../services/src/lib/endpoint/carriers/carriers.service";
import {CarrierModel} from "../../../../services/src/models/endpoints/Carrier";
import {environment as al_environment} from "../../../../../apps/al/src/environments/environment";
import {AudioProvider} from "../../../../services/src/providers/audio-provider/audio-provider.provider";
import {KeyboardService} from "../../../../services/src/lib/keyboard/keyboard.service";
import { PositionsToast } from '../../../../services/src/models/positionsToast.type';
import { TimesToastType } from '../../../../services/src/models/timesToastType';
import { AddDestinyComponent} from '../add-destiny/add-destiny.component';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { WarehouseService } from 'libs/services/src/lib/endpoint/warehouse/warehouse.service';
import { CarrierService, WarehouseModel, IntermediaryService } from '@suite/services';


@Component({
  selector: 'suite-input-codes',
  templateUrl: './input-codes.component.html',
  styleUrls: ['./input-codes.component.scss']
})
export class InputCodesComponent implements OnInit {

  dataToWrite: string = 'RECIPIENTE';
  inputProduct: string = null;
  lastCodeScanned: string = 'start';

  public typeTagsBoolean: boolean = false;

  private timeoutStarted = null;
  private readonly timeMillisToResetScannedCode: number = 1000;
  carriers: Array<CarrierModel.Carrier> = [];
  warehouses: Array<WarehouseModel.Warehouse> = [];
  private JailReference: string;
   constructor(
    private carriersService: CarriersService,
    private itemReferencesProvider: ItemReferencesProvider,
    private intermediaryService: IntermediaryService,
    private audioProvider: AudioProvider,
    private keyboardService: KeyboardService,
    private modalCtrl: ModalController
  ) {
    this.timeMillisToResetScannedCode = al_environment.time_millis_reset_scanned_code;
    setTimeout(() => {
      document.getElementById('input-ta').focus();
    },800);
  }

  ngOnInit() {

  }

  async keyUpInput(event) {
    let dataWrote = (this.inputProduct || "").trim();
    
    if (event.keyCode === 13 && dataWrote) {
      if (dataWrote === this.lastCodeScanned) { 
            this.inputProduct = null; 
        
        return;
      }
      this.lastCodeScanned = dataWrote;
      if (this.timeoutStarted) {
        clearTimeout(this.timeoutStarted);
      }
      this.timeoutStarted = setTimeout(() => this.lastCodeScanned = 'start', this.timeMillisToResetScannedCode);

      this.inputProduct = null;

      if (this.itemReferencesProvider.checkCodeValue(dataWrote) === this.itemReferencesProvider.codeValue.PACKING) {
      
        this.carriersService.getByReferences(dataWrote).subscribe((res)=>{
          if(res.packingInventorys.length=== 0){
            this.intermediaryService.dismissLoading();
            this.audioProvider.playDefaultError();
            let errorMsg = 'El Embalaje no tiene productos';
            this.intermediaryService.presentToastError(errorMsg, PositionsToast.BOTTOM).then(() => {
              setTimeout(() => {
                document.getElementById('input-ta').focus();
              },500);
            });            
          }else{
            if(res.carrierWarehousesDestiny.length === 0 ){
              this.JailReference = res.reference;
              this.addDestinyModal(res);
             }
          }
      },(err) =>{
        this.intermediaryService.dismissLoading();
        this.audioProvider.playDefaultError();
        let errorMsg = 'Ha ocurrido un error al escanear el código';
        this.intermediaryService.presentToastError(errorMsg, PositionsToast.BOTTOM).then(() => {
          setTimeout(() => {
            document.getElementById('input-ta').focus();
          },500);
        });      });
      } else {
        this.audioProvider.playDefaultError();
        this.intermediaryService.presentToastError('El código escaneado no es válido para la operación que se espera realizar.', PositionsToast.BOTTOM).then(() => {
          setTimeout(() => {
            document.getElementById('input-ta').focus();
          },500);
        });
      }
    }
  }


  precintar() {
    this.intermediaryService.presentLoading("Precintando embalaje...", ()=>{
      this.carriersService
        .postSeal({
          reference: this.JailReference
        })
        .then((res: CarrierModel.ResponseSeal) => {
          this.intermediaryService.dismissLoading();
          if (res.code === 200) {
            this.audioProvider.playDefaultOk();
            this.intermediaryService.presentToastPrimary('El embalaje se ha precintado correctamente.', TimesToastType.DURATION_SUCCESS_TOAST_1500, PositionsToast.BOTTOM).then(() => {
              setTimeout(() => {
                document.getElementById('input-ta').focus();
              },500);
            });
          } else {
            if (res.code === 404) {
              this.audioProvider.playDefaultError();
              let errorMsg = res && res.error && res.error.errors ? res.error.errors : res.errors;
              this.intermediaryService.presentToastError(errorMsg, PositionsToast.BOTTOM).then(() => {
                setTimeout(() => {
                  document.getElementById('input-ta').focus();
                },500);
              });
            } else {
              this.audioProvider.playDefaultError();
              let errorMsg = res && res.error && res.error.errors ? res.error.errors : 'Ha ocurrido un error al intentar precintar el recipiente.';
              this.intermediaryService.presentToastError(errorMsg, PositionsToast.BOTTOM).then(() => {
                setTimeout(() => {
                  document.getElementById('input-ta').focus();
                },500);
              });
            }
          }
        }, (error) => {
          this.intermediaryService.dismissLoading();
          this.audioProvider.playDefaultError();
          let errorMsg = error && error.error && error.error.errors ? error.error.errors : 'Ha ocurrido un error al intentar precintar el recipiente.';
          this.intermediaryService.presentToastError(errorMsg, PositionsToast.BOTTOM).then(() => {
            setTimeout(() => {
              document.getElementById('input-ta').focus();
            },500);
          });
        })
        .catch((error) => {
          this.intermediaryService.dismissLoading();
          this.audioProvider.playDefaultError();
          let errorMsg = error && error.error && error.error.errors ? error.error.errors : 'Ha ocurrido un error al intentar precintar el recipiente.';
          this.intermediaryService.presentToastError(errorMsg, PositionsToast.BOTTOM).then(() => {
            setTimeout(() => {
              document.getElementById('input-ta').focus();
            },500);
          });
        });
    });
  }
  
  async addDestinyModal(jail) {
    let modal = (await this.modalCtrl.create({
      component: AddDestinyComponent,
      componentProps: {
        jail: jail
      },
      cssClass: 'modalStyles'
    }))
    modal.onDidDismiss().then(() => {
     // this.getCarriers();
     this.precintar();
    })
    modal.present();
}
  public onFocus(event){
    if(event && event.target && event.target.id){
      this.keyboardService.setInputFocused(event.target.id);
    }
  }

}
