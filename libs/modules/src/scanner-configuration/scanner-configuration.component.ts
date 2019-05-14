import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import {ScannerConfigurationService} from "../../../services/src/lib/scanner-configuration/scanner-configuration.service";

@Component({
  selector: 'suite-ui-crud-scanner-configuration',
  templateUrl: './scanner-configuration.component.html',
  styleUrls: ['./scanner-configuration.component.scss']
})
export class ScannerConfigurationComponent implements OnInit {

  usabilityOptions: any[] = [];
  scannableCodes: any[] = [];

  constructor(
    private modalController: ModalController,
    private scannerConfigurationService: ScannerConfigurationService
  ) {}

  ngOnInit() {
    this.usabilityOptions = this.scannerConfigurationService.usabilityOptions;
    this.scannableCodes = this.scannerConfigurationService.scannableCodes;
  }

  close() {
    this.scannerConfigurationService.usabilityOptions = this.usabilityOptions;
    this.scannerConfigurationService.scannableCodes = this.scannableCodes;
    this.modalController.dismiss();
  }

  enableConfiguration(event, configuration) {
    event.stopPropagation();
    configuration.value = !configuration.value;
  }

}
