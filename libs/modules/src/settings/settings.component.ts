import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {SettingsService} from "../../../services/src/lib/storage/settings/settings.service";
import {ToastController} from "@ionic/angular";
import {PrinterConnectionService} from "../../../services/src/lib/printer-connection/printer-connection.service";

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
    private toastController: ToastController,
    private printerConnectionService: PrinterConnectionService,
  ) {
  }

  ngOnInit() {
    this.settingsService.getDeviceSettings()
      .then((incomingDataObservable) => incomingDataObservable.subscribe(value => {
        this.form.patchValue(value);
      }));
  }

  /**
   * Update the values for the user processes
   */
  submit(): void {
    this.settingsService.saveDeviceSettings(this.form.value)
      .then(() => {
        this.presentToast("Ajustes guardados", "success");
        this.printerConnectionService.disconnect();
        this.printerConnectionService.connect();
      });
  }

  async presentToast(msg, color) {
    const toast = await this.toastController.create({
      message: msg,
      position: 'top',
      duration: 3750,
      color: color || "primary"
    });
    toast.present();
  }
}
