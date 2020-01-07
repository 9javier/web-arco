import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ScanditProvider {
  private _colorsMessage: Colors.Message = {
    error: { color: '#e8413e', name: 'danger' },
    info: { color: '#15789e', name: 'info' },
    success: { color: '#2F9E5A', name: 'success' }
  };
  get colorsMessage(): Colors.Message {
    return this._colorsMessage;
  }

  private _colorsHeader: Colors.Header = {
    background: { color: '#222428' },
    color: { color: '#FFFFFF' }
  };
  get colorsHeader(): Colors.Header {
    return this._colorsHeader;
  }

  private _colorText: Colors.Color = { color: '#FFFFFF' };
  get colorText(): Colors.Color {
    return this._colorText;
  }
}

namespace Colors {
  export interface Message {
    error: Color,
    info: Color,
    success: Color
  }
  export interface Header {
    background: Color,
    color: Color
  }
  export interface Color {
    color: string,
    name?: string
  }
}
