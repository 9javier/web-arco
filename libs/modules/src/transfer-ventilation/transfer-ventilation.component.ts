import {Component, OnInit} from '@angular/core';
import {SettingsService} from "../../../services/src/lib/storage/settings/settings.service";
import {AlertController, Events} from "@ionic/angular";
import {Location} from "@angular/common";

@Component({
  selector: 'app-transfer-ventilation',
  templateUrl: './transfer-ventilation.component.html',
  styleUrls: ['./transfer-ventilation.component.scss']
})

export class TransferVentilationComponent implements OnInit {

  private lastMethod: string = 'manual';

  constructor(
    private events: Events,
    private location: Location,
    private alertController: AlertController,
    private settingsService: SettingsService,
  ) {}

  ngOnInit() {
    this.settingsService.getDeviceSettings()
      .then((resObservable) => {
        resObservable.subscribe((res) => {
          if (res.transferVentilationLastMethod) {
            this.lastMethod = res.transferVentilationLastMethod;
          } else {
            this.settingsService.saveDeviceSettings({ transferVentilationLastMethod: this.lastMethod });
          }
        });
      });
  }

  private goPreviousPage () {
    this.location.back();
  }

  private async presentWarningAlert(title: string, message: string) {
    const alert = await this.alertController.create({
      backdropDismiss: false,
      header: title,
      message: message,
      buttons: ['Cerrar']
    });

    await alert.present();
  }

}
