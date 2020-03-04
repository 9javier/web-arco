import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { TemplateSorterModel } from '../../../models/endpoints/TemplateSorter';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SorterTemplateService {

  /**urls for sorter service */
  private postCreateTemplateSorterUrl: string = environment.apiSorter + "/sorter/templates";
  private getTemplateSorterUrl: string = environment.apiSorter + "/sorter/templates";
  private putUpdateTemplateSorterUrl: string = environment.apiSorter + "/sorter/templates/{{id}}";
  private deleteSorterUrl: string = environment.apiSorter + "/sorter/templates/{{id}}";
  private getShowUrl: string = environment.apiSorter + "/sorter/templates/{{id}}";
  private getActiveTemplateUrl: string = environment.apiSorter + '/sorter/templates/active';

  constructor(private http: HttpClient) { }
  getIndex(): Observable<TemplateSorterModel.ResponseTemplate> {
    return this.http.get<TemplateSorterModel.ResponseTemplate>(this.getTemplateSorterUrl).pipe(map(response => {
      return response;
    }));
  }

  postCreate(data: TemplateSorterModel.Template): Observable<TemplateSorterModel.ResponseTemplateCreate> {

    return this.http.post<TemplateSorterModel.ResponseTemplateCreate>(this.postCreateTemplateSorterUrl, data)
    .pipe(
      map(response => {
       return response;
      },
      catchError((err) => {
        return of([]);
      })
    ));
  }

  updateTemplateSorter(data: TemplateSorterModel.Template, id: number): Observable<TemplateSorterModel.ResponseTemplateCreate> {
    return this.http.put<TemplateSorterModel.ResponseTemplateCreate>(this.putUpdateTemplateSorterUrl.replace("{{id}}",String(id)), data)
    .pipe(map(response => {
      return response;
    }));
  }

  deleteTemplateSorter(id: number) {
    return this.http.delete(this.deleteSorterUrl.replace("{{id}}",String(id)));
  }

  getShow(id: number): Observable<any> {
    return this.http.get(this.getShowUrl.replace("{{id}}",String(id))).pipe(map(response => {
      return response;
    }));
  }

  getActiveTemplate(): Observable<TemplateSorterModel.Template> {
    return this.http.get<TemplateSorterModel.ResponseActiveTemplate>(this.getActiveTemplateUrl).pipe(map(response => {
      return response.data;
    }));
  }
}
