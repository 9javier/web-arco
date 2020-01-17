import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RequestsProvider } from '../../../providers/requests/requests.provider';

@Injectable({
  providedIn: 'root'
})
export class ListProductsCarrierService {

  constructor(
    private http: HttpClient,
    private requestsProvider: RequestsProvider
  ) { }

  getProducts():Observable<any>{
    const dataReturn = [
      {
        product: {
          reference: '001280160650399954',
          model: {
            reference: '12801',
            brand: {
              name: 'KRACK NAME 1'
            }
          },
          size: {
            name: '35'
          }
        },
        audit: {
          isAudit: true,
          hasSorter: false,
          incidence: true,
          rightAudit: false
        },
        destinyProduct: {
          reference: 'REFERENCE0001',
          name: 'NAME001'
        }
      },
      {
        product: {
          reference: '001280260650399954',
          model: {
            reference: '12802',
            brand: {
              name: 'KRACK NAME 2'
            }
          },
          size: {
            name: '40'
          }
        },
        audit: {
          isAudit: true,
          hasSorter: false,
          incidence: true,
          rightAudit: false
        },
        destinyProduct: {
          reference: 'REFERENCE0002',
          name: 'NAME002'
        }
      },
      {
        product: {
          reference: '001280360650399954',
          model: {
            reference: '12803',
            brand: {
              name: 'KRACK NAME 3'
            }
          },
          size: {
            name: '38'
          }
        },
        audit: {
          isAudit: true,
          hasSorter: false,
          incidence: true,
          rightAudit: false
        },
        destinyProduct: {
          reference: 'REFERENCE0003',
          name: 'NAME003'
        }
      },
      {
        product: {
          reference: '001280460650399954',
          model: {
            reference: '12804',
            brand: {
              name: 'KRACK NAME 4'
            }
          },
          size: {
            name: '43'
          }
        },
        audit: {
          isAudit: true,
          hasSorter: false,
          incidence: true,
          rightAudit: false
        },
        destinyProduct: {
          reference: 'REFERENCE0004',
          name: 'NAME004'
        }
      }
    ];

    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ data: dataReturn});
      }, 1000);
    });
  }
}
