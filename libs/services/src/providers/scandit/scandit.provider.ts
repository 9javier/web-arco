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

  private _codeValue: CodeValue = {
    CONTAINER: 'container',
    CONTAINER_OLD: 'container_old',
    JAIL: 'jail',
    PALLET: 'pallet',
    PRODUCT: 'product',
    PRODUCT_MODEL: 'product_model',
    PRODUCT_UNDEFINED: 'product_undefined'
  };
  get codeValue(): CodeValue {
    return this._codeValue;
  }

  private _codeRegex: Regex[] = [
    {
      value: this._codeValue.CONTAINER,
      regex: /([A-Z]){1,4}([0-9]){3}A([0-9]){2}C([0-9]){3}$/
    },
    {
      value: this._codeValue.CONTAINER_OLD,
      regex: /P([0-9]){2}[A-Z]([0-9]){2}$/
    },
    {
      value: this._codeValue.JAIL,
      regex: /J([0-9]){4}/
    },
    {
      value: this._codeValue.PALLET,
      regex: /P([0-9]){4}/
    },
    {
      value: this._codeValue.PRODUCT,
      regex: /([0]){2}([0-9]){6}([0-9]){2}([0-9]){3}([0-9]){5}$/
    },
    {
      value: this._codeValue.PRODUCT_MODEL,
      regex: /([0-9]){1,6}$/
    },
    {
      value: this._codeValue.PRODUCT_MODEL,
      regex: /([0-9]){1,6}$/
    },
    {
      value: this._codeValue.PRODUCT_UNDEFINED,
      regex: /(\w){1,18}$/
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
  CONTAINER: string,
  CONTAINER_OLD: string,
  JAIL: string,
  PALLET: string,
  PRODUCT: string,
  PRODUCT_MODEL: string,
  PRODUCT_UNDEFINED: string
}

export interface Regex {
  regex: RegExp,
  value: string
}
