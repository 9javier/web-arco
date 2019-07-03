import {Injectable} from '@angular/core';
import {ScanditProvider} from "../../../providers/scandit/scandit.provider";

declare let Scandit;
declare let GScandit;
declare let ScanditMatrixSimple;

@Injectable({
  providedIn: 'root'
})
export class PickingScanditService {

  constructor(
    private scanditProvider: ScanditProvider
  ) {}

  async reception() {
    let listProducts = [
      {
        "product": {
          "model": {
            "reference": "366383",
            "brand": {
              "name": "Nike"
            }
          },
          "size": {
            "name": "39"
          }
        }
      },
      {
        "product": {
          "model": {
            "reference": "366389",
            "brand": {
              "name": "New balance"
            }
          },
          "size": {
            "name": "38"
          }
        }
      },
      {
        "product": {
          "model": {
            "reference": "366389",
            "brand": {
              "name": "Nike"
            }
          },
          "size": {
            "name": "38"
          }
        }
      },
      {
        "product": {
          "model": {
            "reference": "366389",
            "brand": {
              "name": "Puma"
            }
          },
          "size": {
            "name": "38"
          }
        }
      },
      {
        "product": {
          "model": {
            "reference": "366389"
          },
          "size": {
            "name": "38"
          }
        }
      },
      {
        "product": {
          "model": {
            "reference": "366389",
            "brand": {
              "name": "Adidas"
            }
          },
          "size": {
            "name": "38"
          }
        }
      },
      {
        "product": {
          "model": {
            "reference": "366389",
            "brand": {
              "name": "Marca China"
            }
          },
          "size": {
            "name": "38"
          }
        }
      },
      {
        "product": {
          "model": {
            "reference": "366389",
            "brand": {
              "name": "Otra marca China"
            }
          },
          "size": {
            "name": "38"
          }
        }
      },
      {
        "product": {
          "model": {
            "reference": "366389"
          },
          "size": {
            "name": "38"
          }
        }
      },
      {
        "product": {
          "model": {
            "reference": "366389",
            "brand": {
              "name": "Adidas"
            }
          },
          "size": {
            "name": "38"
          }
        }
      }
    ];
    ScanditMatrixSimple.initPickingStores((response) => {
      if (response.result) {
        if (response.action == 'matrix_simple') {
          ScanditMatrixSimple.sendPickingStoresProducts(listProducts);
        }
      }
    }, 'Picking', this.scanditProvider.colorsHeader.background.color, this.scanditProvider.colorsHeader.color.color);
  }

}
