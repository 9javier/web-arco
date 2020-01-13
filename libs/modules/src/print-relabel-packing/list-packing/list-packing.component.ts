import {Component, OnInit} from '@angular/core';
import {CarrierModel} from "../../../../services/src/models/endpoints/Carrier";
import {ActionSheetController, LoadingController} from "@ionic/angular";
import {Router} from "@angular/router";
import {PrintTagsScanditService} from "../../../../services/src/lib/scandit/print-tags/print-tags.service";
import {CarriersService} from "../../../../services/src/lib/endpoint/carriers/carriers.service";
import { AuthenticationService, IntermediaryService, TypeModel, TypesService, WarehouseModel } from '@suite/services';
import {PrinterService} from "../../../../services/src/lib/printer/printer.service";
import { PositionsToast } from '../../../../services/src/models/positionsToast.type';

@Component({
  selector: 'list-packing-relabel',
  templateUrl: './list-packing.component.html',
  styleUrls: ['./list-packing.component.scss']
})
export class ListPackingRelabelTemplateComponent implements OnInit {

  public listCarriers: CarrierModel.Carrier[];
  public isLoadingData: boolean = true;
  private loading: any;

  private isStoreUser: boolean = false;
  private storeUserObj: WarehouseModel.Warehouse = null;

  private carriersTypes: TypeModel.Type[] = [];

  constructor(
    private router: Router,
    private actionSheetController: ActionSheetController,
    private intermediaryService: IntermediaryService,
    private loadingController: LoadingController,
    private authenticationService: AuthenticationService,
    private carriersService: CarriersService,
    private printTagsScanditService: PrintTagsScanditService,
    private printerService: PrinterService,
    private typesService: TypesService
  ) {}

  async ngOnInit() {
    this.isStoreUser = await this.authenticationService.isStoreUser();
    if (this.isStoreUser) {
      this.storeUserObj = await this.authenticationService.getStoreCurrentUser();
    }

    this.carriersTypes = this.typesService.listPacking;
    this.loadCarriers();
  }

  private async loadCarriers() {
    this.isLoadingData = true;

    let warehouseId = null;
    if (this.storeUserObj) {
      warehouseId = this.storeUserObj.id;
    }

    this.carriersService
      .postListByWarehouse({ warehouseId })
      .subscribe((res: CarrierModel.ResponseListByWarehouse) => {
        this.isLoadingData = false;

        if (res.code === 200) {
          if (res.data && res.data.length > 0) {
            this.listCarriers = res.data;
          }
        } else if (res.code !== 204) {
          console.error('Error::Subscribe::GetCarrierOfProduct::', res);
          let warehouseTypeName = 'de la tienda';
          if (!this.isStoreUser) {
            warehouseTypeName = 'del almacén';
          }
          this.intermediaryService.presentToastError(`Ha ocurrido un error al intentar consultar los recipientes ${warehouseTypeName}.`, PositionsToast.BOTTOM).then(() => {
            setTimeout(() => {
              document.getElementById('input-ta').focus();
            },500);
          });
        }
      }, (error) => {
        this.isLoadingData = false;

        console.error('Error::Subscribe::GetCarrierOfProduct::', error);

        if (error.error.code !== 204) {
          let warehouseTypeName = 'de la tienda';
          if (!this.isStoreUser) {
            warehouseTypeName = 'del almacén';
          }

          this.intermediaryService.presentToastError(`Ha ocurrido un error al intentar consultar los recipientes ${warehouseTypeName}.`, PositionsToast.BOTTOM).then(() => {
            setTimeout(() => {
              document.getElementById('input-ta').focus();
            },500);
          });
        }
      });
  }

  public async relabelPacking() {
    let actionSheet = await this.actionSheetController.create({
      header: 'Contenido del recipiente',
      buttons: [
        {
          text: 'Recipiente con contenido',
          icon: 'square',
          handler: () => {
            this.actionSheetSelectTypeScan();
          }
        }, {
          text: 'Recipiente vacío',
          icon: 'square-outline',
          handler: () => {
            // Create new packing and print label
            this.actionSheetSelectCarrierType();
          }
        }
      ]
    });

    await actionSheet.present();
  }

  // ActionSheet with methods to scan product and print their carrier
  public async actionSheetSelectTypeScan() {
    let actionSheet = await this.actionSheetController.create({
      header: 'Tipo de comprobación',
      buttons: [
        {
          text: 'Escaneo de producto',
          icon: 'qr-scanner',
          handler: () => {
            // Scan product inside packing and get jail where it is to print label
            this.printTagsScanditService.printTagsPackings();
          }
        },
        {
          text: 'Introducción manual de producto',
          icon: 'create',
          handler: () => {
            // Set manually product reference to get carrier and print
            this.router.navigate(['print/packing/manual']);
          }
        }
      ]
    });

    await actionSheet.present();
  }

  // ActionSheet with type of carries to generate
  public async actionSheetSelectCarrierType() {
    let buttons = [];

    for (let carrierType of this.carriersTypes) {
      buttons.push({
        text: carrierType.name,
        icon: 'cube',
        handler: () => {
          this.showLoading('Generando recipiente y mandando a imprimir...');
          this.generateNewCarrier(carrierType);
        }
      });
    }

    let actionSheet = await this.actionSheetController.create({
      header: 'Tipo de recipiente',
      buttons: buttons
    });

    await actionSheet.present();
  }

  private generateNewCarrier(carrierType: TypeModel.Type) {
    this.carriersService
      .postGenerate({
        packingType: carrierType.id
      })
      .subscribe((res: CarrierModel.ResponseGenerate) => {
        this.loading.dismiss();
        if (res.code === 201) {
          this.printerService.print({text: [res.data.reference], type: 0});
        } else {
          console.error('Error::Subscribe::GetCarrierOfProduct::', res);
          let msgErrorByCarrierType = 'un nuevo recipiente';
          if (carrierType.id === 1) {
            msgErrorByCarrierType = 'una nueva jaula';
          } else if (carrierType.id === 2) {
            msgErrorByCarrierType = 'un nuevo pallet';
          }
          this.intermediaryService.presentToastError(`Ha ocurrido un error al intentar generar ${msgErrorByCarrierType}.`, PositionsToast.BOTTOM).then(() => {
            setTimeout(() => {
              document.getElementById('input-ta').focus();
            },500);
          });
        }
      }, (error) => {
        this.loading.dismiss();

        console.error('Error::Subscribe::GetCarrierOfProduct::', error);
        let msgErrorByCarrierType = 'un nuevo recipiente';
        if (carrierType.id === 1) {
          msgErrorByCarrierType = 'una nueva jaula';
        } else if (carrierType.id === 2) {
          msgErrorByCarrierType = 'un nuevo pallet';
        }
        this.intermediaryService.presentToastError(`Ha ocurrido un error al intentar generar ${msgErrorByCarrierType}.`, PositionsToast.BOTTOM).then(() => {
          setTimeout(() => {
            document.getElementById('input-ta').focus();
          },500);
        });
      });
  }

  private async showLoading(message: string) {
    this.loading = await this.loadingController.create({
      message: message,
      translucent: true,
    });
    return await this.loading.present();
  }

}
