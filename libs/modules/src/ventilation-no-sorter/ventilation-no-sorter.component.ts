import {Component, OnInit, ViewChild} from "@angular/core";
import {ItemReferencesProvider} from "../../../services/src/providers/item-references/item-references.provider";
import {AudioProvider} from "../../../services/src/providers/audio-provider/audio-provider.provider";
import {
  CarrierService,
  IntermediaryService,
  InventoryService,
  SizeModel, UsersService,
  WarehouseModel,
  WarehousesService
} from "@suite/services";
import {ScannerManualComponent} from "../components/scanner-manual/scanner-manual.component";
import {PickingStoreService} from "../../../services/src/lib/endpoint/picking-store/picking-store.service";
import Warehouse = WarehouseModel.Warehouse;
import Size = SizeModel.Size;
import {CarrierModel} from "../../../services/src/models/endpoints/carrier.model";
import { TimesToastType } from '../../../services/src/models/timesToastType';
import { PositionsToast } from '../../../services/src/models/positionsToast.type';

@Component({
  selector: 'app-ventilation-no-sorter',
  templateUrl: './ventilation-no-sorter.component.html',
  styleUrls: ['./ventilation-no-sorter.component.scss']
})

export class VentilationNoSorterComponent implements OnInit {

  @ViewChild('scannerManual') scannerManual: ScannerManualComponent;

  inputValue: string = '';
  showScanner: boolean = true;
  originScan;
  destinyWarehouse: Warehouse;
  waitingForPacking: boolean = false;
  withoutOutputScan: boolean = false;
  scannedCode: string;
  scannedPacking: string;
  size: Size;
  newDestiny: boolean;
  scanMessage: string = '¡Hola! Escanea un artículo para comenzar';
  packingPhase: boolean = false;
  packing: CarrierModel.Carrier;
  destinies: string[] = [];
  packingMessage: string;
  loading: boolean = false;


  constructor(
    private itemReferencesProvider: ItemReferencesProvider,
    private audioProvider: AudioProvider,
    private intermediaryService: IntermediaryService,
    private pickingStoreService: PickingStoreService,
    private warehousesService: WarehousesService,
    private inventoryService: InventoryService,
    private carrierService: CarrierService
  ) {}

  ngOnInit() {
    this.scannerManual.focusToInput();
  }

  updateValue(event){
    this.inputValue = event;
  }

  async scan(){
    if (!this.loading){
      await this.intermediaryService.presentLoading('Procesando...');
      this.loading = true;
    }
    try {
      if (!this.packingPhase) {
        if (this.itemReferencesProvider.checkCodeValue(this.inputValue) === this.itemReferencesProvider.codeValue.PRODUCT) {
          await this.pickingStoreService.getByProductReference({reference: this.inputValue})
            .then(response => {
              this.originScan = response.data
            });
          if (this.originScan && this.originScan.picking_store_products_destinyWarehouseId) {
            await this.warehousesService.getWarehouseAndSize({
              warehouse: this.originScan.picking_store_products_destinyWarehouseId,
              size: this.originScan.product_shoes_unit_sizeId
            })
              .then(response => {
                this.destinyWarehouse = response.data.warehouse;
                this.size = response.data.size;
              });
            if (this.destinies[this.destinyWarehouse.reference]) {
              this.newDestiny = false;
              this.packingMessage = 'ASIGNAR A EMBALAJE ' + this.destinies[this.destinyWarehouse.reference];
            } else {
              this.newDestiny = true;
              this.packingMessage = 'ASIGNAR A EMBALAJE';
            }
            this.scannedCode = this.inputValue;
            this.resetScanner();
            this.showScanner = false;
            this.waitingForPacking = true;
            this.withoutOutputScan = false;
            this.packingPhase = true;
          } else {
            this.size = {
              reference: this.originScan.product_shoes_unit_size_reference,
              number: this.originScan.product_shoes_unit_size_name,
              name: this.originScan.product_shoes_unit_size_name
            };
            this.scannedCode = this.inputValue;
            this.resetScanner();
            this.showScanner = false;
            this.waitingForPacking = true;
            this.withoutOutputScan = true;
            this.packingPhase = true;
          }
        } else {
          this.audioProvider.playDefaultError();
          await this.intermediaryService.presentToastError('Escanea un código de caja de producto.', 1500);
          this.resetScanner();
          this.scannerManual.focusToInput();
        }
      } else {
        if (this.itemReferencesProvider.checkCodeValue(this.inputValue) === this.itemReferencesProvider.codeValue.PACKING) {
          this.scannedPacking = this.inputValue;
          this.carrierService.getSingle(this.scannedPacking).subscribe(value => {
            this.packing = value;
            this.destinies[this.destinyWarehouse.reference] = this.packing.reference;
            this.resetScanner();
            this.assignToPacking();
          });
        } else {
          this.audioProvider.playDefaultError();
          await this.intermediaryService.presentToastError('Escanea un código de embalaje.', 1500);
          this.resetScanner();
          this.scannerManual.focusToInput();
        }
      }
      if (this.loading){
        await this.intermediaryService.dismissLoading();
        this.loading = false;
      }
    } catch (exception) {
      if (this.loading){
        await this.intermediaryService.dismissLoading();
        this.loading = false;
      }
      this.audioProvider.playDefaultError();
      await this.intermediaryService.presentToastError('Ha ocurrido un error. Inténtelo de nuevo más tarde.', 1500);
      this.resetScanner();
      this.scannerManual.focusToInput();
    }
  }

  scanPacking(packingToSave?: string){
    if (packingToSave == 'zero') {
      this.destinyWarehouse = {
        reference: '000'
      };
    } else if (packingToSave == 'incidence') {
      this.destinyWarehouse = {
        reference: 'incidence'
      };
    }

    this.scanMessage = 'Escanea un embalaje para continuar';
    this.waitingForPacking = false;
    this.withoutOutputScan = false;
    this.showScanner = true;
    this.scannerManual.focusToInput();
  }

  async assignToPacking(){
    try {
      let inventoryProcess = {
        productReference: this.scannedCode,
        packingReference: this.scannedPacking,
        force: true,
        avoidAvelonMovement: true
      };
      await this.inventoryService.postStore(inventoryProcess);
      this.resetScanner();
      this.scanMessage = '¡Hola! Escanea un artículo para comenzar';
      this.waitingForPacking = false;
      this.withoutOutputScan = false;
      this.showScanner = true;
      this.packingPhase = false;
      this.audioProvider.playDefaultOk();
      this.intermediaryService.presentToastSuccess('Artículo asignado a embalaje correctamente.', TimesToastType.DURATION_SUCCESS_TOAST_2000, PositionsToast.BOTTOM);
      this.scannerManual.focusToInput();
      if (this.loading){
        await this.intermediaryService.dismissLoading();
        this.loading = false;
      }
    } catch (exception) {
      if (this.loading){
        await this.intermediaryService.dismissLoading();
        this.loading = false;
      }
    }
  }

  resetScanner(){
    this.scannerManual.value = '';
    this.inputValue = '';
  }

  getPackingScanned(caseToGet: string): string {
    switch (caseToGet) {
      case 'zero':
        return this.destinies['000'] ? `(${this.destinies['000']})` : '';
      case 'incidence':
        return this.destinies['incidence'] ? `(${this.destinies['incidence']})` : '';
    }

    return '';
  }

}
