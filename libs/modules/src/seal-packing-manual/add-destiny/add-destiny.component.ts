import { Component, OnInit, ViewChild} from '@angular/core';
import { Validators } from '@angular/forms';
import { COLLECTIONS } from 'config/base';
import { NavParams, ModalController } from '@ionic/angular';
import { DataComponent } from '../../group-warehouse-picking/modals/data/data.component';
import { WarehousesService, WarehouseModel } from '@suite/services';
import { MatSelectChange } from '@angular/material';
import { CarrierService, IntermediaryService } from '@suite/services'
import { MatFormFieldModule, MatInputModule, MatSelectModule} from '@angular/material';
import {CarrierModel} from "../../../../services/src/models/endpoints/Carrier";
import {CarriersService} from "../../../../services/src/lib/endpoint/carriers/carriers.service";
import {AudioProvider} from "../../../../services/src/providers/audio-provider/audio-provider.provider";
import { PositionsToast } from '../../../../services/src/models/positionsToast.type';
import { TimesToastType } from '../../../../services/src/models/timesToastType';





@Component({
  selector: 'suite-add-destiny',
  templateUrl: './add-destiny.component.html',
  styleUrls: ['./add-destiny.component.scss']
})
export class AddDestinyComponent implements OnInit {

  title = 'Agregar Destino';
  apiEndpoint = COLLECTIONS.find(collection => collection.name === 'Carriers')
    .name;

  redirectTo = '/jails/list';
  private jail: CarrierModel.Carrier;
  warehouses:Array<WarehouseModel.Warehouse> = [];
  warehouse: WarehouseModel.Warehouse;
  private jailToSeal: string;
  listWarehouse=[];

  constructor(
    private carriersService: CarriersService,
    private navParams:NavParams,
    private modalController:ModalController,
    private warehousesService:WarehousesService,
    private carrierService:CarrierService,
    private intermediaryService:IntermediaryService,
    private audioProvider: AudioProvider,

  ) {    this.jail = this.navParams.get("jail");
         this.jailToSeal = this.navParams.get('jailToSeal');
  
}
@ViewChild(DataComponent) data:DataComponent;

  ngOnInit() {
    this.warehousesService.getIndex().then(observable => {
      observable.subscribe(warehouses => {
          this.warehouses = warehouses.body.data;
      });
    })
  }

  close(){
    this.modalController.dismiss();
  }

  selectDestiny(event: MatSelectChange) {
    this.warehouse = event.value;
    this.listWarehouse.push(event.value);
  }

 async submit() {
  
       if(this.listWarehouse.length > 0){
        this.carrierService.setDestination(this.jail.id,this.warehouse.id).subscribe(()=>{
          //this.intermediaryService.presentToastSuccess("Destino agregado con exito");
          this.precintar();
          
        }, (err)=>{
          this.intermediaryService.presentToastSuccess("Error al agregar destino");  
        }, ()=>{
          
    
        })
       }else{
         this.intermediaryService.presentToastError("Selecciona un destino para el embalaje");
       }
   
  }

 async precintar() {
    this.intermediaryService.presentLoading("Precintando embalaje...", ()=>{
      this.carriersService
        .postSeal({
          reference: this.jailToSeal
        })
        .then((res: CarrierModel.ResponseSeal) => {
          this.intermediaryService.dismissLoading();
          if (res.code === 200) {
            this.audioProvider.playDefaultOk();
            this.intermediaryService.presentToastPrimary('El embalaje se ha precintado correctamente.', TimesToastType.DURATION_SUCCESS_TOAST_1500, PositionsToast.BOTTOM).then(() => {
              setTimeout(() => {
                document.getElementById('input-ta').focus();
                this.intermediaryService.dismissLoading();
                this.close();
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
                  this.intermediaryService.dismissLoading();
                  this.close();
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
              this.intermediaryService.dismissLoading();
              this.close();
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
              this.intermediaryService.dismissLoading();
              this.close();
            },500);
          });
        });
    });
  }


}




