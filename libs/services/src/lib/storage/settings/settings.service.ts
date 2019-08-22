import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';
import {AppSettingsModel} from "../../../models/storage/AppSettings";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private static readonly STORAGE_KEY_PRINTER_BLUETOOTH_MAC_ADDRESS = "printer_bluetooth_mac_address";

  constructor(
  ) {}

  /**
   * Get types of order products to make an orderby
   * @return types to make an orderby
   */
  async getDeviceSettings(): Promise<Observable<AppSettingsModel.AppSettings>>{
    return new Promise((resolve, reject) => {
      resolve(Observable.create((obs) => {
        obs.next({
          printerBluetoothMacAddress: localStorage.getItem(SettingsService.STORAGE_KEY_PRINTER_BLUETOOTH_MAC_ADDRESS)
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
      localStorage.setItem(SettingsService.STORAGE_KEY_PRINTER_BLUETOOTH_MAC_ADDRESS, data.printerBluetoothMacAddress);
      resolve();
    });
  }
}
