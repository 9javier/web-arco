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
  private postCreateTemplateSorterUrl: string = environment.apiBase + "/sorter/templates";
  private getTemplateSorterUrl: string = environment.apiBase + "/sorter/templates";
  private putUpdateTemplateSorterUrl: string = environment.apiBase + "/sorter/templates/{{id}}";
  private deleteSorterUrl: string = environment.apiBase + "/sorter/templates/{{id}}";
  constructor(private http: HttpClient) { }
  
  getIndex(): Observable<TemplateSorterModel.ResponseTemplate> {
    return this.http.get<TemplateSorterModel.ResponseTemplate>(this.getTemplateSorterUrl).pipe(map(response => {
      return response;
    }));
  }

  postCreate(data: TemplateSorterModel.Template): Observable<TemplateSorterModel.ResponseTemplateCreate> {
    console.log(data)
    return this.http.post<TemplateSorterModel.ResponseTemplateCreate>(this.postCreateTemplateSorterUrl, data)
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

  updateTemplateSorter(data: TemplateSorterModel.Template, id: number): Observable<TemplateSorterModel.ResponseTemplateCreate> {
    return this.http.put<TemplateSorterModel.ResponseTemplateCreate>(this.putUpdateTemplateSorterUrl.replace("{{id}}",String(id)), data)
    .pipe(map(response => {
      return response;
    }));
  }

  deleteTemplateSorter(id: number) {
    return this.http.delete(this.deleteSorterUrl.replace("{{id}}",String(id)));
  }
}
