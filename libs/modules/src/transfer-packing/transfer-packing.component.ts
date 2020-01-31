import {Component, OnInit} from '@angular/core';
import {SettingsService} from "../../../services/src/lib/storage/settings/settings.service";
import {TransferPackingScanditService} from "../../../services/src/lib/scandit/transfer-packing/transfer-packing.service";
import {AlertController, Events} from "@ionic/angular";
import {Location} from "@angular/common";
import {KeyboardService} from "../../../services/src/lib/keyboard/keyboard.service";

@Component({
  selector: 'app-transfer-packing',
  templateUrl: './transfer-packing.component.html',
  styleUrls: ['./transfer-packing.component.scss']
})

export class TransferPackingComponent implements OnInit {

  private EXIT_FROM_SCANDIT: string = 'exit_from_scandit';

  private lastMethod: string = 'manual';

  private disableScanditScanner: boolean = false;

  constructor(
    private events: Events,
    private location: Location,
    private alertController: AlertController,
    private settingsService: SettingsService,
    private keyboardService: KeyboardService,
    private transferPackingScanditService: TransferPackingScanditService
  ) {}

  ngOnInit() {
    this.settingsService.getDeviceSettings()
      .then((resObservable) => {
        resObservable.subscribe((res) => {
          if (res.transferPackingLastMethod) {
            this.lastMethod = res.transferPackingLastMethod;
          } else {
            this.settingsService.saveDeviceSettings({ transferPackingLastMethod: this.lastMethod });
          }

          if (this.lastMethod == 'scandit') {
            this.useScanditMode();
          }
        });
      });

    this.events.subscribe(this.EXIT_FROM_SCANDIT, () => {
      if (this.lastMethod == 'scandit') {
        this.goPreviousPage();
      }
    });
  }

  ngOnDestroy() {
    this.events.unsubscribe(this.EXIT_FROM_SCANDIT);
  }

  public useScanditMode() {
    if ((<any>window).cordova) {
      if (this.disableScanditScanner) {
        this.presentWarningAlert('Acción no válida', 'Scandit no está disponible actualmente.');
      } else {
        this.transferPackingScanditService.transfer();
      }
    } else {
      console.warn("DEBUG::Scandit is not available to test in browser");
    }
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
