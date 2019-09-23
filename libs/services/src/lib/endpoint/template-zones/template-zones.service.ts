import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { TemplateZoneModel } from '../../../models/endpoints/TemplateZone';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TemplateZonesService {

  /**urls for sorter service */
  private postCreateZoneTemplateUrl: string = environment.apiBase + "/sorter/templates/{{idTemplate}}/zones";
  private getZoneTemplateUrl: string = environment.apiBase + "/sorter/templates/{{idTemplate}}/zones";
  private putUpdateZoneTemplateUrl: string = environment.apiBase + "/sorter/templates/{{idTemplate}}/zones/{{id}}";
  private deleteZoneTemplateUrl: string = environment.apiBase + "/sorter/templates/{{idTemplate}}/zones/{{id}}";
  constructor(private http: HttpClient) { }
  
  getIndex(idTemplate: number): Observable<TemplateZoneModel.ResponseZone> {
    return this.http.get<TemplateZoneModel.ResponseZone>(this.getZoneTemplateUrl.replace("{{idTemplate}}",String(idTemplate)))
    .pipe(map(response => {
      return response;
    }));
  }

  postCreate(data: TemplateZoneModel.Zone, idTemplate: number): Observable<TemplateZoneModel.ResponseZoneCreate> {
    console.log(data)
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

  updateTemplateSorter(data: TemplateZoneModel.Zone, id: number, idTemplate: number): Observable<TemplateZoneModel.ResponseZoneCreate> {
    return this.http.put<TemplateZoneModel.ResponseZoneCreate>(
      this.putUpdateZoneTemplateUrl.replace("{{idTemplate}}",String(idTemplate)).replace("{{id}}",String(id)),
      data
    )
    .pipe(map(response => {
      return response;
    }));
  }

  deleteTemplateSorter(id: number, idTemplate: number) {
    return this.http.delete<any>(this.deleteZoneTemplateUrl.replace("{{idTemplate}}",String(idTemplate)).replace("{{id}}",String(id)))
    .pipe(map(response => {
      return response;
    }));;
  }
}
