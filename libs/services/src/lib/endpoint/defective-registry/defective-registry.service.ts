import { HttpRequestModel } from 'libs/services/src/models/endpoints/HttpRequest';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DefectiveRegistryModel } from '../../../models/endpoints/DefectiveRegistry';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DefectiveRegistryService {
  private baseUrl: string;
  private indexRegistryHistoricFalseUrl: string;
  private indexHistoricTrueUrl: string;
  private entitiesFiltersFalseUrl: string;
  private entitiesFiltersFalseUrlAl: string;
  private entitiesFiltersTrueUrl: string;
  private getHistoricalUrl: string;
  private getHistoricalAlUrl: string;
  private getDefectList: string;
  private getLastHistoricalUrl: string;
  private getProvidersUrl: string;
  private getBrandsByProvidersUrl: string;
  private getDataUrl: string;
  private emitData = new BehaviorSubject({});
  private getData$ = this.emitData.asObservable();
  private refreshListRegistry = new BehaviorSubject<boolean>(false);
  refreshListRegistry$ = this.refreshListRegistry.asObservable();

  constructor(private http: HttpClient) {
    this.baseUrl = environment.apiSorter;
    this.indexRegistryHistoricFalseUrl = `${this.baseUrl}/defects/registry/all/false`;
    this.indexHistoricTrueUrl = `${this.baseUrl}/defects/registry/all`;
    this.entitiesFiltersTrueUrl = `${this.baseUrl}/defects/registry/filters`;
    this.entitiesFiltersFalseUrl = `${this.baseUrl}/defects/registry/filters/false`;
    this.entitiesFiltersFalseUrlAl = `${this.baseUrl}/defects/registry/filters/false/al`;
    this.getHistoricalUrl = `${this.baseUrl}/defects/registry/product-historial`;
    this.getHistoricalAlUrl = `${this.baseUrl}/defects/registry/product-historial/al`;
    this.getDefectList = `${this.baseUrl}/defects/registry/listDefects/la`;
    this.getLastHistoricalUrl = `${this.baseUrl}/defects/registry/get-last-historial-product`;
    this.getDataUrl = `${this.baseUrl}/defects/registry/get-data`;
    this.getProvidersUrl = `${this.baseUrl}/defects/registry/providers`;
    this.getBrandsByProvidersUrl = `${this.baseUrl}/defects/registry/providers/brands`;
  }

  indexHistoricTrue(body: DefectiveRegistryModel.IndexRequest): Observable<DefectiveRegistryModel.DataSource> {
    return this.http.post<HttpRequestModel.Response>(this.indexHistoricTrueUrl, body).pipe(
      map(resp => resp.data)
    )
  }

  indexHistoricFalse(body: DefectiveRegistryModel.IndexRequest): Observable<DefectiveRegistryModel.DataSource> {
    return this.http.post<HttpRequestModel.Response>(this.indexRegistryHistoricFalseUrl, body).pipe(
      map(resp => resp.data)
    )
  }

  getFiltersEntitiesTrue() {
    const body = {
      storeDetection: [],
      dateDetection: [],
      statusManagementDefect: [],
      defectTypeParent: [],
      defectTypeChild: [],
      numberObservations: [],
      barCode: [],
      photo: [],
      warehouse: [],
      factoryReturn: [],
    };

    return this.http.post<HttpRequestModel.Response>(this.entitiesFiltersTrueUrl, body).pipe(
      map(resp => resp.data)
    )
  }

  getFiltersEntitiesFalse() {
    const body = {
      storeDetection: [],
      dateDetection: [],
      statusManagementDefect: [],
      defectTypeParent: [],
      defectTypeChild: [],
      numberObservations: [],
      barCode: [],
      photo: [],
      warehouse: [],
      factoryReturn: [],
    };

    return this.http.post<HttpRequestModel.Response>(this.entitiesFiltersFalseUrl, body).pipe(
      map(resp => resp.data)
    )
  }

  getFiltersEntitiesFalseAl() {
    const body = {
      id: [],
      user: [],
      product: [],
      model: [],
      size: [],
      brand: [],
      color: [],
      storeDetection: [],
      dateDetection: [],
      statusManagementDefect: [],
      defectTypeParent: [],
      defectTypeChild: [],
      barCode: [],
      warehouse: [],
      factoryReturn: []
    };

    return this.http.post<HttpRequestModel.Response>(this.entitiesFiltersFalseUrlAl, body).pipe(
      map(resp => resp.data)
    )
  }

  getHistorical(body): Observable<any> {
    return this.http.post(this.getHistoricalUrl, body).pipe(map((response: any) => {
      return response.data;
    }));
  }

  //getListDefectAfterUpdate(body) {
  getHistoricalAl(body): Observable<any> {
    return this.http.post(this.getHistoricalAlUrl, body).pipe(map((response: any) => {
      return response.data;
    }));
  }

   getListDefectAfterUpdate(body) {
     this.callList(body).subscribe(data =>{
       console.log(data);
       this.emitData.next(data);
     });
   }

  getListDefect(body: DefectiveRegistryModel.IndexRequest): Observable<DefectiveRegistryModel.DataSource> {
    return this.http.post<HttpRequestModel.Response>(this.getDefectList, body).pipe(
      map(resp => resp.data)
    )
  }

  getData() {
    return this.getData$;
  }

  callList(form): Observable<any> {
    return this.http.post<any>(this.getDefectList, form).pipe(
      (map((resp: any) => {
        return resp.data;
      }))
    );
  }

  getLastHistorical(body): Observable<any> {
    return this.http.post(this.getLastHistoricalUrl, body).pipe(map((response: any) => {
      return response.data;
    }));
  }

  getDataDefect(body): Observable<any> {
    return this.http.post(this.getDataUrl, body).pipe(map((response: any) => {
      return response.data;
    }));
  }

  getProviders(): Observable<any> {
    return this.http.get<HttpRequestModel.Response>(this.getProvidersUrl).pipe(
      map(resp => resp.data)
    )
  }

  getBrandsByProviders(providerId: number): Observable<any> {
    const body = {
      providerId
    };
    return this.http.post(this.getBrandsByProvidersUrl, body).pipe(map((response: any) => {
      return response.data;
    }));
  }
  setRefreshList(refresh: boolean) {
    this.refreshListRegistry.next(refresh);
  }

  expeditions(form): Observable<any>{
    const body = {
      id:1
    };
    return this.http.post(this.getBrandsByProvidersUrl, body).pipe(map((response: any) => {
      let  data = {
        listIncidencesWithFormat: [
          {
            id:1,
            name:"operators"
          },
          {
            id:2,
            name:"name"
          },
          {
            id:3,
            name:"lastname"
          },
          {
            id:4,
            name:"dni"
          },
          {
            id:5,
            name:"phone"
          },
          {
            id:6,
            name:"direction"
          },
          {
            id:7,
            name:"province"
          },
          {
            id:8,
            name:"country"
          },
        ], 
        results:[
          {
            operator:'DHL',
            name:"fulanito",
            lastname:"fulanito",
            dni:"dni",
            phone:"32221321",
            direction:"mexico",
            province:"guadalajara",
            country:"mexico",
            postalcode:"23452",
            packages:"2"
          },
          {
            operator:'DHL',
            name:"fulanito",
            lastname:"fulanito",
            dni:"dni",
            phone:"32221321",
            direction:"mexico",
            province:"guadalajara",
            country:"mexico",
            postalcode:"23452",
            packages:"2"
          },
          {
            operator:'DHL',
            name:"fulanito",
            lastname:"fulanito",
            dni:"dni",
            phone:"32221321",
            direction:"mexico",
            province:"guadalajara",
            country:"mexico",
            postalcode:"23452",
            packages:"2"
          },
          {
            operator:'DHL',
            name:"fulanito",
            lastname:"fulanito",
            dni:"dni",
            phone:"32221321",
            direction:"mexico",
            province:"guadalajara",
            country:"mexico",
            postalcode:"23452",
            packages:"2"
          },
        ], 
        pagination:{
          selectPage: 1,
          firstPage: 1,
          lastPage: 1,
          limit: 10,
          totalResults: 4
        }, 
        listAvailableStatus:[
          {id: 1, name: "Pendiente Decisión"},
          {id: 2, name: "Pendiente Reparación"},
          {id: 3, name: "Reparado"},
          {id: 4, name: "En Stock"},
          {id: 5, name: "En Transito"},
        ],
      };
      return data;
    }));
    

  }
   
  getFilters(){
    const body = {
      id: [],
      user: [],
      product: [],
      model: [],
      size: [],
      brand: [],
      color: [],
      storeDetection: [],
      dateDetection: [],
      statusManagementDefect: [],
      defectTypeParent: [],
      defectTypeChild: [],
      barCode: [],
      warehouse: [],
      factoryReturn: []
    };

    return this.http.post<HttpRequestModel.Response>(this.entitiesFiltersFalseUrlAl, body).pipe(
      map(resp =>{
        let filters = {
          operator:[
            {
              id:1,
              name:'DHL'
            }
          ],
          name:[
            {
              id:1,
              name:'fulanito'
            }
          ],
          lastname:[
            {
              id:1,
              name:'fulanito'
            }
          ],
          dni:[
            {
              id:1,
              name:'dni'
            }
          ],
          phone:[
            {
              id:1,
              name:'32221321'
            }
          ],
          direction:[
            {
              id:1,
              name:'mexico'
            }
          ],
          province:[
            {
              id:1,
              name:'guadalajara'
            }
          ],
          country:[
            {
              id:1,
              name:'mexico'
            }
          ],
          postalcode:[
            {
              id:1,
              name:'23452'
            }
          ],
          packages:[
            {
              id:1,
              name:'2'
            }
          ],
        }

        return filters;
      })
    )
  }
}
