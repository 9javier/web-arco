import {Component, OnInit, ViewChild} from "@angular/core";
import {ItemReferencesProvider} from "../../../services/src/providers/item-references/item-references.provider";
import {AudioProvider} from "../../../services/src/providers/audio-provider/audio-provider.provider";
import {IntermediaryService, SizeModel, WarehouseModel, WarehousesService} from "@suite/services";
import {ScannerManualComponent} from "../components/scanner-manual/scanner-manual.component";
import {PickingStoreService} from "../../../services/src/lib/endpoint/picking-store/picking-store.service";
import Warehouse = WarehouseModel.Warehouse;
import Size = SizeModel.Size;

@Component({
  selector: 'app-ventilation-no-sorter',
  templateUrl: './ventilation-no-sorter.component.html',
  styleUrls: ['./ventilation-no-sorter.component.scss']
})

export class VentilationNoSorterComponent implements OnInit {

  @ViewChild('scannerManual') scannerManual: ScannerManualComponent;

  inputValue: string = null;
  showScanner: boolean = true;
  warehouse: Warehouse;
  waitingForCage: boolean = false;
  scannedCode: string;
  size: Size;

  constructor(
    private itemReferencesProvider: ItemReferencesProvider,
    private audioProvider: AudioProvider,
    private intermediaryService: IntermediaryService,
    private pickingStoreService: PickingStoreService,
    private warehousesService: WarehousesService
  ) {}

  ngOnInit() {
    this.scannerManual.focusToInput();
  }

  updateValue(event){
    this.inputValue = event;
  }

  async scan(){
    if (this.itemReferencesProvider.checkCodeValue(this.inputValue) === this.itemReferencesProvider.codeValue.PRODUCT) {
      await this.intermediaryService.presentLoading('Procesando...');
      let originScan;
      await this.pickingStoreService.getByProductReference({reference: this.inputValue})
        .then(response => { originScan = response.data});
      if(originScan && originScan.length != 0){
        if(originScan.picking_store_products_destinyWarehouseId == 3){
          console.log('Tengo destino 0.');
          // A implementar.
        }else{
          await this.warehousesService.getWarehouseAndSize({
            warehouse: originScan.picking_store_products_destinyWarehouseId,
            size: originScan.product_shoes_unit_sizeId
          })
            .then(response => {
              this.warehouse = response.data.warehouse;
              this.size = response.data.size;
            });
          this.scannerManual.value = '';
          this.scannedCode = this.inputValue;
          this.inputValue = null;
          this.showScanner = false;
          this.waitingForCage = true;

          await this.intermediaryService.dismissLoading();
        }
      }else{
        console.log('No tengo escaneo de origen.');
        // A implementar.
      }
    } else {
      this.audioProvider.playDefaultError();
      await this.intermediaryService.presentToastError('Escanea un código de caja de producto.', 1500);
      this.scannerManual.focusToInput();
    }
  }

}
