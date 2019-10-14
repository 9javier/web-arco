import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { TemplateZoneModel } from '../../../models/endpoints/TemplateZone';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import {MatrixSorterModel} from "../../../models/endpoints/MatrixSorter";

@Injectable({
  providedIn: 'root'
})
export class TemplateZonesService {

  /**urls for zones service */
  private postCreateZoneTemplateUrl: string = environment.apiSorter + "/sorter/templates/{{idTemplate}}/zones";
  private getZoneTemplateUrl: string = environment.apiSorter + "/sorter/templates/{{idTemplate}}/zones";
  private putUpdateZoneTemplateUrl: string = environment.apiSorter + "/sorter/templates/{{idTemplate}}/zones/{{id}}";
  private deleteZoneTemplateUrl: string = environment.apiSorter + "/sorter/templates/{{idTemplate}}/zones/{{id}}";
  private getShowUrl: string = environment.apiSorter + "/sorter/templates/{{idTemplate}}/zones/{{id}}";
  /** urls zones warehouse */
  private postCreateZoneWarehouseUrl: string = environment.apiSorter + "/sorter/templates/{{idTemplate}}/zones/warehouses";
  private getZoneWarehousesUrl: string = environment.apiSorter + "/sorter/templates/{{idTemplate}}/zones/warehouses";
  private putUpdateZoneWarehousesUrl: string = environment.apiSorter + "/sorter/templates/{{idTemplate}}/zones/warehouses/{{id}}";
  private deleteZoneWarehousesUrl: string = environment.apiSorter + "/sorter/templates/{{idTemplate}}/zones/warehouses/{{id}}";
  private assignZoneWarehousesUrl: string = environment.apiSorter + "/sorter/templates/{{idTemplate}}/zones/warehouses/assign-warehouses";
  private getMatrixByTemplateUrl: string = environment.apiSorter + "/sorters/{{id}}/templates/{{idTemplate}}/zones/ways/matrix";
  private assignPrioritiesUrl: string = environment.apiSorter + "/sorter/templates/{{idTemplate}}/zones/ways/assign";
  private getTemplteZonesAndWaysUrl: string = environment.apiSorter + "/sorter/templates/{{idTemplate}}/zones/ways";
  private assignWaysUrl: string = environment.apiSorter + "/sorter/templates/{{idTemplate}}/zones/ways/assign-ways";
  private getMatrixTemplateSorterUrl: string = environment.apiSorter + '/sorters/{{idSorter}}/templates/{{idTemplate}}/zones/ways/matrix';

  constructor(private http: HttpClient) { }
  
  getIndex(idTemplate: number): Observable<TemplateZoneModel.ResponseZone> {
    return this.http.get<TemplateZoneModel.ResponseZone>(this.getZoneTemplateUrl.replace("{{idTemplate}}",String(idTemplate)))
    .pipe(map(response => {
      return response;
    }));
  }

  postCreate(data: TemplateZoneModel.Zone, idTemplate: number): Observable<TemplateZoneModel.ResponseZoneCreate> {
    return this.http.post<TemplateZoneModel.ResponseZoneCreate>(this.postCreateZoneTemplateUrl.replace("{{idTemplate}}",String(idTemplate)), data)
    .pipe(
      map(response => {
       return response;
      },
      catchError((err) => {
        console.log('caught rethrown error, providing fallback value');
        return of([]);
      })
    ));
  }

  updateTemplateZone(data: TemplateZoneModel.Zone, id: number, idTemplate: number): Observable<TemplateZoneModel.ResponseZoneCreate> {
    return this.http.put<TemplateZoneModel.ResponseZoneCreate>(
      this.putUpdateZoneTemplateUrl.replace("{{idTemplate}}",String(idTemplate)).replace("{{id}}",String(id)),
      data
    )
    .pipe(map(response => {
      return response;
    }));
  }

  deleteTemplateZone(id: number, idTemplate: number) {
    return this.http.delete<any>(this.deleteZoneTemplateUrl.replace("{{idTemplate}}",String(idTemplate)).replace("{{id}}",String(id)))
    .pipe(map(response => {
      return response;
    }));;
  }

  getShowTemplateZone(id: number, idTemplate: number): Observable<any> {
    return this.http.get<any>(this.getShowUrl.replace("{{idTemplate}}",String(idTemplate)).replace("{{id}}",String(id)))
    .pipe(map(response => {
      return response;
    }));;
  }

  getIndexZonesWarehouses(idTemplate: number): Observable<TemplateZoneModel.ResponseZone> {
    return this.http.get<TemplateZoneModel.ResponseZone>(this.getZoneWarehousesUrl.replace("{{idTemplate}}",String(idTemplate)))
    .pipe(map(response => {
      return response;
    }));
  }

  postCreateZoneWarehouse(data: TemplateZoneModel.ZonesWarehouses, idTemplate: number): Observable<TemplateZoneModel.ResponseZoneCreate> {
    return this.http.post<TemplateZoneModel.ResponseZoneCreate>(this.postCreateZoneWarehouseUrl.replace("{{idTemplate}}",String(idTemplate)), data)
    .pipe(
      map(response => {
       return response;
      },
      catchError((err) => {
        console.log('caught rethrown error, providing fallback value');
        return of([]);
      })
    ));
  }

  updateZoneWarehouse(data: TemplateZoneModel.ZonesWarehouses, id: number, idTemplate: number): Observable<TemplateZoneModel.ResponseZoneCreate> {
    return this.http.put<TemplateZoneModel.ResponseZoneCreate>(
      this.putUpdateZoneWarehousesUrl.replace("{{idTemplate}}",String(idTemplate)).replace("{{id}}",String(id)),
      data
    )
    .pipe(map(response => {
      return response;
    }));
  }

  deleteZoneWarehouseSorter(id: number, idTemplate: number) {
    return this.http.delete<any>(this.deleteZoneWarehousesUrl.replace("{{idTemplate}}",String(idTemplate)).replace("{{id}}",String(id)))
    .pipe(map(response => {
      return response;
    }));;
  }

  assignZoneWarehouseSorter(data: TemplateZoneModel.ZonesWarehouses, idTemplate: number): Observable<any> {
     return this.http.post<TemplateZoneModel.ResponseZoneCreate>(
      this.assignZoneWarehousesUrl.replace("{{idTemplate}}",String(idTemplate)),
      data
    )
    .pipe(map(response => {
      return response;
    }));
  }

  getMatrixByTemplate(id: number, idTemplate: number): Observable<any> {
    return this.http.get<any>(this.getMatrixByTemplateUrl.replace("{{id}}",String(id)).replace("{{idTemplate}}",String(idTemplate)))
    .pipe(map(response => {
      return response;
    }));
  }

  getTemplateZonesAndWays(idTemplate: number): Observable<any> {
    return this.http.get<any>(this.getTemplteZonesAndWaysUrl.replace("{{idTemplate}}",String(idTemplate)))
    .pipe(map(response => {
      return response;
    }));
  }

  assignPriorities(data, idTemplate: number): Observable<any> {
    return this.http.post<any>(this.assignPrioritiesUrl.replace("{{idTemplate}}",String(idTemplate)), data)
    .pipe(map(response => {
      return response;
    }));
  }

  assignWays(data, idTemplate: number): Observable<any> {
    console.log(data)
    return this.http.post<any>(this.assignWaysUrl.replace("{{idTemplate}}",String(idTemplate)), data)
    .pipe(map(response => {
      return response;
    }));
  }

  getMatrixTemplateSorter(idSorter: number, idTemplate: number): Observable<MatrixSorterModel.MatrixTemplateSorter[]> {
    let url = this.getMatrixTemplateSorterUrl;
    url = url.replace('{{idSorter}}', idSorter.toString());
    url = url.replace('{{idTemplate}}', idTemplate.toString());

    return this.http.get<MatrixSorterModel.ResponseMatrixTemplateSorter>(url).pipe(map(response => {
      return response.data;
    }));
  }
}
