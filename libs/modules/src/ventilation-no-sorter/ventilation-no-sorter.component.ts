import {Component, OnInit, ViewChild} from "@angular/core";
import {ItemReferencesProvider} from "../../../services/src/providers/item-references/item-references.provider";
import {AudioProvider} from "../../../services/src/providers/audio-provider/audio-provider.provider";
import {IntermediaryService, WarehouseModel, WarehousesService} from "@suite/services";
import {ScannerManualComponent} from "../components/scanner-manual/scanner-manual.component";
import {PickingStoreService} from "../../../services/src/lib/endpoint/picking-store/picking-store.service";
import Warehouse = WarehouseModel.Warehouse;

@Component({
  selector: 'app-ventilation-no-sorter',
  templateUrl: './ventilation-no-sorter.component.html',
  styleUrls: ['./ventilation-no-sorter.component.scss']
})

export class VentilationNoSorterComponent implements OnInit {

  @ViewChild('scannerManual') scannerManual: ScannerManualComponent;

  inputValue: string = null;

  message: string = '¡Hola! Escanea un artículo para comenzar';

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
          let warehouse = null;
          await this.warehousesService.getWarehouse({id: originScan.picking_store_products_destinyWarehouseId})
            .then(response => {
              warehouse = response.data;
            });
          this.scannerManual.value = '';
          this.inputValue = null;
          this.message = 'El destino de este artículo es '+warehouse.reference+' '+warehouse.name;
          await this.intermediaryService.dismissLoading();
          this.scannerManual.focusToInput();
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
