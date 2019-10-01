import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { SorterModel } from '../../../models/endpoints/Sorter';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SorterService {

  /**urls for sorter service */
  private postCreateSorterUrl: string = environment.apiBase + "/sorters";
  private getSortersUrl: string = environment.apiBase + "/sorters";
  private putUpdateSorterUrl: string = environment.apiBase + "/sorters/{{id}}";
  private deleteSorterUrl: string = environment.apiBase + "/sorters/{{id}}";
  private getFirstSorterUrl: string = environment.apiBase + '/sorters/first';

  constructor(private http: HttpClient) { }
  
  getIndex(): Observable<SorterModel.ResponseSorter> {
    return this.http.get<SorterModel.ResponseSorter>(this.getSortersUrl).pipe(map(response => {
      return response;
    }));
  }

  postCreate(data: SorterModel.Sorter): Observable<SorterModel.ResponseSorterCreate> {
    return this.http.post<SorterModel.ResponseSorterCreate>(this.postCreateSorterUrl, data).pipe(map(response => {
      return response;
    }));
  }

  updateSorter(data: SorterModel.Sorter, id: number): Observable<SorterModel.ResponseSorterUpdate> {
    return this.http.put<SorterModel.ResponseSorterUpdate>(this.putUpdateSorterUrl.replace("{{id}}",String(id)), data)
    .pipe(map(response => {
      return response;
    }));
  }

  deleteSorter(id: number) {
    return this.http.delete(this.deleteSorterUrl.replace("{{id}}",String(id)));
  }

  getFirstSorter(): Observable<SorterModel.FirstSorter> {
    return this.http.get<SorterModel.ResponseFirstSorter>(this.getFirstSorterUrl).pipe(map(response => {
      return response.data;
    }));
  }
}
