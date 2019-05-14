import {Injectable} from '@angular/core';
import {SCANDIT_API_KEY} from "../../../../../config/base";

declare let Scandit;
declare let GScandit;

@Injectable({
  providedIn: 'root'
})
export class ScanditService {
  constructor() {
  }

  setApiKey() {
    Scandit.License.setAppKey(SCANDIT_API_KEY);
  }

  scanReferences() {
    GScandit.matrix_bubble((response) => {
      console.log("TEST::GScandit response", response);
      GScandit.setDataReference(response.barcode.id, response.barcode.data, response.barcode.data, '10,99', [{attribute_name:'40', color: 'Azul'}], false, "Nothing", "Nothing");
    }, '', '', 1);
  }
}
