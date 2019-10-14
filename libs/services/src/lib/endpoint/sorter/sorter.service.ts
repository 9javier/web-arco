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
  private postCreateSorterUrl: string = environment.apiSorter + "/sorters";
  private getSortersUrl: string = environment.apiSorter + "/sorters";
  private putUpdateSorterUrl: string = environment.apiSorter + "/sorters/{{id}}";
  private deleteSorterUrl: string = environment.apiSorter + "/sorters/{{id}}";
  private getFirstSorterUrl: string = environment.apiSorter + '/sorters/first';
  private getShowUrl: string = environment.apiSorter + "/sorters/{{id}}";

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

  getShow(id: number): Observable<any> {
    return this.http.get(this.getShowUrl.replace("{{id}}",String(id))).pipe(map(response => {
      return response;
    }));
  }
}
