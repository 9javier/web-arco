import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ItemReferencesProvider {

  private _codeValue: CodeValue = {
    BOX: 'box',
    CONTAINER: 'container',
    CONTAINER_OLD: 'container_old',
    JAIL: 'jail',
    PACKING: 'packing',
    PALLET: 'pallet',
    PRODUCT: 'product',
    PRODUCT_MODEL: 'product_model',
    PRODUCT_UNDEFINED: 'product_undefined',
    PACKAGE: 'package',
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
      value: this._codeValue.PACKING,
      regex: /[a-zA-Z][0-9]{4}/
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
      value: this._codeValue.PRODUCT_UNDEFINED,
      regex: /(\w){1,18}$/
    },
    {
      value: this._codeValue.BOX,
      regex: /B([0-9]){4}/
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
      value: this._codeValue.PACKAGE,
      regex: /UQ([0-9]){6}/
    }
  ];

  public checkCodeValue(code: string): string {
    for (let regex of this._codeRegex) {
      if (code.match(regex.regex)) {
        return regex.value;
      }
    }
  }

  public checkSpecificCodeValue(code: string, item: string): boolean {
    const codeRegex = this._codeRegex.find(regex => regex.value == item);

    if (codeRegex) {
      return !!code.match(codeRegex.regex);
    }

    return false;
  }
}

export interface CodeValue {
  BOX: string,
  CONTAINER: string,
  CONTAINER_OLD: string,
  JAIL: string,
  PACKING: string,
  PALLET: string,
  PRODUCT: string,
  PRODUCT_MODEL: string,
  PRODUCT_UNDEFINED: string,
  PACKAGE: string
}

export interface Regex {
  regex: RegExp,
  value: string
}
