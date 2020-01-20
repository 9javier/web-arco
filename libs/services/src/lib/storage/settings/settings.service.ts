import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import {AppSettingsModel} from "../../../models/storage/AppSettings";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private static readonly STORAGE_KEY_PRINTER_BLUETOOTH_MAC_ADDRESS = "printer_bluetooth_mac_address";
  private static readonly STORAGE_KEY_TRANSFER_PACKING_LAST_METHOD = "transfer_packing_last_method";
  private static readonly STORAGE_KEY_TRANSFER_VENTILATION_LAST_METHOD = "transfer_ventilation_last_method";

  constructor(
  ) {}

  /**
   * Get types of order products to make an orderby
   * @return types to make an orderby
   */
  async getDeviceSettings(): Promise<Observable<AppSettingsModel.AppSettings>>{
    console.debug("PRINT::getDeviceSettings 1 [" + new Date().toJSON() + "]");
    return new Promise((resolve, reject) => {
      resolve(Observable.create((obs) => {
        console.debug("PRINT::getDeviceSettings 2 [" + new Date().toJSON() + "]");
        obs.next({
          printerBluetoothMacAddress: localStorage.getItem(SettingsService.STORAGE_KEY_PRINTER_BLUETOOTH_MAC_ADDRESS),
          transferPackingLastMethod: localStorage.getItem(SettingsService.STORAGE_KEY_TRANSFER_PACKING_LAST_METHOD),
          transferVentilationLastMethod: localStorage.getItem(SettingsService.STORAGE_KEY_TRANSFER_VENTILATION_LAST_METHOD)
        });
      }));
    });
  }

  /**
   * Get types of order products to make an orderby
   * @return types to make an orderby
   */
  async saveDeviceSettings(data: AppSettingsModel.AppSettings) {
    return new Promise((resolve, reject) => {
      if (data.printerBluetoothMacAddress) {
        localStorage.setItem(SettingsService.STORAGE_KEY_PRINTER_BLUETOOTH_MAC_ADDRESS, data.printerBluetoothMacAddress);
      }
      if (data.transferPackingLastMethod) {
        localStorage.setItem(SettingsService.STORAGE_KEY_TRANSFER_PACKING_LAST_METHOD, data.transferPackingLastMethod);
      }
      if (data.transferVentilationLastMethod) {
        localStorage.setItem(SettingsService.STORAGE_KEY_TRANSFER_VENTILATION_LAST_METHOD, data.transferVentilationLastMethod);
      }
      resolve();
    });
  }
}
