import {Component, OnInit, ViewChild} from '@angular/core';
import {ScannerManualComponent} from "../../../components/scanner-manual/scanner-manual.component";
import {IntermediaryService} from "../../../../../services/src/lib/endpoint/intermediary/intermediary.service";

@Component({
  selector: 'suite-ean-scanner',
  templateUrl: './ean-scanner.component.html',
  styleUrls: ['./ean-scanner.component.scss']
})
export class EanScannerComponent implements OnInit {

  @ViewChild(ScannerManualComponent) scannerManual: ScannerManualComponent;

  constructor(
    private intermediaryService: IntermediaryService
  ) { }

  ngOnInit() {

  }

  eanScanned(response: string) {
    this.intermediaryService.presentLoading('Comprobando EAN...', () => {
      console.log('Test::Response', response);
      setTimeout(() => {
        this.intermediaryService.dismissLoading();
      }, 3 * 1000);
    });
  }
}
