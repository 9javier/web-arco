import {Injectable} from '@angular/core';
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";
import {SettingsService} from "../../storage/settings/settings.service";

declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class TransferPackingScanditService {

  private timeoutHideText;

  constructor(
    private settingsService: SettingsService,
    private scanditProvider: ScanditProvider
  ) {}

  async transfer() {
    ScanditMatrixSimple.init((res) => {
      if (res && res.barcode) {
        this.settingsService.saveDeviceSettings({ transferPackingLastMethod: 'scandit' })
      }

      ScanditMatrixSimple.setText(
        "Funcionalidad no definida actualmente",
        this.scanditProvider.colorsMessage.error.color,
        this.scanditProvider.colorText.color,
        16);
      this.hideTextMessage(1500);
    }, 'Traspaso', this.scanditProvider.colorsHeader.background.color, this.scanditProvider.colorsHeader.color.color);
  }

  private hideTextMessage(delay: number) {
    if (this.timeoutHideText) {
      clearTimeout(this.timeoutHideText);
    }
    this.timeoutHideText = setTimeout(() => {
      ScanditMatrixSimple.showText(false);
    }, delay);
  }

}


