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
    if(!this.packingPhase) {
      if (this.itemReferencesProvider.checkCodeValue(this.inputValue) === this.itemReferencesProvider.codeValue.PRODUCT) {
        await this.pickingStoreService.getByProductReference({reference: this.inputValue})
          .then(response => {
            this.originScan = response.data
          });
        if (this.originScan && this.originScan.length != 0) {
          await this.warehousesService.getWarehouseAndSize({
            warehouse: this.originScan.picking_store_products_destinyWarehouseId,
            size: this.originScan.product_shoes_unit_sizeId
          })
            .then(response => {
              this.destinyWarehouse = response.data.warehouse;
              this.size = response.data.size;
            });
          if(this.destinies[this.destinyWarehouse.reference]){
            this.newDestiny = false;
            this.packingMessage = 'ASIGNAR A EMBALAJE '+this.destinies[this.destinyWarehouse.reference];
          }else{
            this.newDestiny = true;
            this.packingMessage = 'ASIGNAR A EMBALAJE';
          }
          this.scannedCode = this.inputValue;
          this.resetScanner();
          this.showScanner = false;
          this.waitingForPacking = true;
          this.packingPhase = true;
        } else {
          this.audioProvider.playDefaultError();
          await this.intermediaryService.presentToastError('El código escaneado no tiene escaneo de salida.', 1500);
          this.resetScanner();
          this.scannerManual.focusToInput();
        }
      } else {
        this.audioProvider.playDefaultError();
        await this.intermediaryService.presentToastError('Escanea un código de caja de producto.', 1500);
        this.resetScanner();
        this.scannerManual.focusToInput();
      }
    }else{
      if (this.itemReferencesProvider.checkCodeValue(this.inputValue) === this.itemReferencesProvider.codeValue.PACKING){
        this.scannedPacking = this.inputValue;
        this.carrierService.getSingle(this.scannedPacking).subscribe(value => {
          this.packing = value;
          this.destinies[this.destinyWarehouse.reference] = this.packing.reference;
          this.resetScanner();
          this.assignToPacking();
        });
      }else{
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
  }

  scanPacking(){
    this.scanMessage = 'Escanea un embalaje para continuar';
    this.waitingForPacking = false;
    this.showScanner = true;
    this.scannerManual.focusToInput();
  }

  async assignToPacking(){
    if (!this.loading){
      await this.intermediaryService.presentLoading('Procesando...');
      this.loading = true;
    }
    let inventoryProcess = {
      productReference: this.scannedCode,
      packingReference: this.scannedPacking,
      warehouseId: this.originScan.product_shoes_unit_initialWarehouseId,
      force: false
    };
    await this.inventoryService.postStore(inventoryProcess);
    this.resetScanner();
    this.scanMessage = '¡Hola! Escanea un artículo para comenzar';
    this.waitingForPacking = false;
    this.showScanner = true;
    this.packingPhase = false;
    this.scannerManual.focusToInput();
    if (this.loading){
      await this.intermediaryService.dismissLoading();
      this.loading = false;
    }
  }

  resetScanner(){
    this.scannerManual.value = '';
    this.inputValue = '';
  }

}
