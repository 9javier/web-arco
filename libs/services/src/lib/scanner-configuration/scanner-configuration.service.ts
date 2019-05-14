import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScannerConfigurationService {

  private _usabilityOptions: any[] = [];
  private _scannableCodes: any[] = [];

  constructor() {}

  public init() {
    this.usabilityOptions = [
      {
        icon: 'flash',
        name: 'Flash',
        value: false,
        disabled: false
      },
      {
        icon: 'musical-note',
        name: 'Sonidos',
        value: false,
        disabled: false
      },
      {
        icon: 'md-expand',
        name: 'Marco',
        value: false,
        disabled: false
      },
      {
        icon: 'phone-landscape',
        name: 'Bloquear orientación',
        value: false,
        disabled: false
      },
      {
        icon: 'infinite',
        name: 'Escaneo continuo',
        value: false,
        disabled: false
      },
      {
        icon: 'notifications',
        name: 'Notificaciones',
        value: false,
        disabled: false
      },
    ]
  }

  get usabilityOptions(): any[] {
    return this._usabilityOptions;
  }

  set usabilityOptions(value: any[]) {
    this._usabilityOptions = value;
  }

  get scannableCodes(): any[] {
    return this._scannableCodes;
  }

  set scannableCodes(value: any[]) {
    this._scannableCodes = value;
  }
}
