import {Component, OnInit, ViewChild} from "@angular/core";
import {ItemReferencesProvider} from "../../../services/src/providers/item-references/item-references.provider";
import {AudioProvider} from "../../../services/src/providers/audio-provider/audio-provider.provider";
import {IntermediaryService} from "@suite/services";
import {ScannerManualComponent} from "../components/scanner-manual/scanner-manual.component";
import {PickingStoreService} from "../../../services/src/lib/endpoint/picking-store/picking-store.service";

@Component({
  selector: 'app-ventilation-no-sorter',
  templateUrl: './ventilation-no-sorter.component.html',
  styleUrls: ['./ventilation-no-sorter.component.scss']
})

export class VentilationNoSorterComponent implements OnInit {

  @ViewChild('scannerManual') scannerManual: ScannerManualComponent;

  inputValue: string = null;

  constructor(
    private itemReferencesProvider: ItemReferencesProvider,
    private audioProvider: AudioProvider,
    private intermediaryService: IntermediaryService,
    private pickingStoreService: PickingStoreService
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
        .then(response => { originScan = response.data.length > 0 });
      if(originScan){
        // do something
      }else{
        // do something
      }
      await this.intermediaryService.dismissLoading();
    } else {
      this.audioProvider.playDefaultError();
      await this.intermediaryService.presentToastError('Escanea un código de caja de producto.', 1500);
      this.scannerManual.focusToInput();
    }
  }

}
