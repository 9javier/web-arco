import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ScanditProvider {
  private _colorsMessage: Colors.Message = {
    error: {color: '#e8413e', name: 'danger'},
    info: {color: '#15789e', name: 'info'},
    success: {color: '#2F9E5A', name: 'success'}
  };
  get colorsMessage(): Colors.Message {
    return this._colorsMessage;
  }

  private _colorsHeader: Colors.Header = {
    background: {color: '#222428'},
    color: {color: '#FFFFFF'}
  };
  get colorsHeader(): Colors.Header {
    return this._colorsHeader;
  }

  private _colorText: Colors.Color = {color: '#FFFFFF'};
  get colorText(): Colors.Color {
    return this._colorText;
  }

  private _codeValue: CodeValue = {
    JAIL: 'jail',
    PALLET: 'pallet',
    PRODUCT: 'product'
  };
  get codeValue(): CodeValue {
    return this._codeValue;
  }

  private _codeRegex: Regex[] = [
    {
      value: 'jail',
      regex: /J([0-9]){4}/
    },
    {
      value: 'pallet',
      regex: /P([0-9]){4}/
    },
    {
      value: 'product',
      regex: /([0]){2}([0-9]){6}([0-9]){2}([0-9]){3}([0-9]){5}$/
    }
  ];

  public checkCodeValue(code: string): string {
    for (let regex of this._codeRegex) {
      if (code.match(regex.regex)) {
        return regex.value;
      }
    }
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

export interface CodeValue {
  JAIL: string,
  PALLET: string,
  PRODUCT: string
}

export interface Regex {
  regex: RegExp,
  value: string
}
