import {Component, OnInit, ViewChild} from "@angular/core";
import {ItemReferencesProvider} from "../../../services/src/providers/item-references/item-references.provider";
import {AudioProvider} from "../../../services/src/providers/audio-provider/audio-provider.provider";
import {CarrierService, IntermediaryService, SizeModel, WarehouseModel, WarehousesService} from "@suite/services";
import {ScannerManualComponent} from "../components/scanner-manual/scanner-manual.component";
import {PickingStoreService} from "../../../services/src/lib/endpoint/picking-store/picking-store.service";
import Warehouse = WarehouseModel.Warehouse;
import Size = SizeModel.Size;
import {PackingInventoryService} from "../../../services/src/lib/endpoint/packing-inventory/packing-inventory.service";
import {CarrierModel} from "../../../services/src/models/endpoints/carrier.model";
import {PackingInventoryModel} from "../../../services/src/models/endpoints/PackingInventory";

@Component({
  selector: 'app-ventilation-no-sorter',
  templateUrl: './ventilation-no-sorter.component.html',
  styleUrls: ['./ventilation-no-sorter.component.scss']
})

export class VentilationNoSorterComponent implements OnInit {

  @ViewChild('scannerManual') scannerManual: ScannerManualComponent;

  inputValue: string = null;
  showScanner: boolean = true;
  originScan;
  warehouse: Warehouse;
  waitingForPacking: boolean = false;
  scannedCode: string;
  scannedPacking: string;
  size: Size;
  newDestiny: boolean = true;
  scanMessage: string = '¡Hola! Escanea un artículo para comenzar';
  packingPhase: boolean = false;
  packing: CarrierModel.Carrier;

  constructor(
    private itemReferencesProvider: ItemReferencesProvider,
    private audioProvider: AudioProvider,
    private intermediaryService: IntermediaryService,
    private pickingStoreService: PickingStoreService,
    private warehousesService: WarehousesService,
    private packingInventoryService: PackingInventoryService,
    private carrierService: CarrierService
  ) {}

  ngOnInit() {
    setTimeout(()=>this.scannerManual.focusToInput(),500);
  }

  updateValue(event){
    this.inputValue = event;
  }

  async scan(){
    await this.intermediaryService.presentLoading('Procesando...');
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
              this.warehouse = response.data.warehouse;
              this.size = response.data.size;
            });
          this.scannedCode = this.inputValue;
          this.resetScanner();
          this.showScanner = false;
          this.waitingForPacking = true;
          this.packingPhase = true;
        } else {
          console.log('No tengo escaneo de origen.');
          // A implementar.
        }
      } else {
        this.audioProvider.playDefaultError();
        await this.intermediaryService.presentToastError('Escanea un código de caja de producto.', 1500);
        this.scannerManual.focusToInput();
        this.scannedPacking = this.inputValue;
        this.resetScanner();
        this.assignToPacking();
      }
    }else{
      if (this.itemReferencesProvider.checkCodeValue(this.inputValue) === this.itemReferencesProvider.codeValue.PACKING){
        this.scannedPacking = this.inputValue;
        this.carrierService.getSingle(this.scannedPacking).subscribe(value => {
          this.packing = value;
          this.resetScanner();
          this.assignToPacking();
        });
      }else{
        this.audioProvider.playDefaultError();
        await this.intermediaryService.presentToastError('Escanea un código de embalaje.', 1500);
        this.scannerManual.focusToInput();
        this.scannedPacking = this.inputValue;
        this.resetScanner();
        this.assignToPacking();
      }
    }
    await this.intermediaryService.dismissLoading();
  }

  scanPacking(){
    this.scanMessage = 'Escanea un embalaje para continuar';
    this.waitingForPacking = false;
    this.showScanner = true;
    setTimeout(()=>this.scannerManual.focusToInput(),500);
  }

  async assignToPacking(){
    //llamar función de back que asigne
    let packingInventory: PackingInventoryModel.PackingInventory = {
      packingType: 1,
      packingId: this.packing.id,
      productId: this.originScan.product_shoes_unit_id,
      userId: 8
    };
    await this.packingInventoryService.postAdd(packingInventory);
    //volver a la vista inicial para escanear otro artículo

  }

  resetScanner(){
    this.scannerManual.value = '';
    this.inputValue = null;
  }

}
