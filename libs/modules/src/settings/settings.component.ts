import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SettingsService } from "../../../services/src/lib/storage/settings/settings.service";
import { PrinterConnectionService } from "../../../services/src/lib/printer-connection/printer-connection.service";
import { IntermediaryService } from '@suite/services';
import { TimesToastType } from '../../../services/src/models/timesToastType';
import { HolderTooltipText } from '../../../services/src/lib/tooltipText/holderTooltipText.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {

  form: FormGroup = this.formBuilder.group({
    printerBluetoothMacAddress: ['', [Validators.pattern('^([0-9A-F]{2}:){5}[0-9A-F]{2}$')]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private settingsService: SettingsService,
    private intermediaryService: IntermediaryService,
    private printerConnectionService: PrinterConnectionService,
    private holderTooltipText: HolderTooltipText,
  ) {
  }

  ngOnInit() {
    this.settingsService.getDeviceSettings()
      .then((incomingDataObservable) => incomingDataObservable.subscribe(value => {
        this.form.patchValue(value);
      }));
  }



  showTooltip() { }

  btnOnClick(idElement: string, txtElement?: string) {
    this.holderTooltipText.setTootlTip(idElement, true);
  }

  /**
   * Update the values for the user processes
   */
  submit(): void {
    this.intermediaryService.presentLoading("Guardando configuración...",() => {
      this.settingsService.saveDeviceSettings(this.form.value)
        .then(() => {
          this.printerConnectionService.disconnect();
          this.printerConnectionService.connect().then((data: boolean) => {
            this.intermediaryService.dismissLoading();
            if(data==true){
              this.intermediaryService.presentToastSuccess('Conectado a la impresora', TimesToastType.DURATION_SUCCESS_TOAST_3750);
            }else{
              this.intermediaryService.presentToastError('No ha sido posible conectarse con la impresora', TimesToastType.DURATION_ERROR_TOAST);
            }
          });
        });
    });
  }
}
