import { ReceptionAvelonModel } from '@suite/services';
import { of } from 'rxjs';
import { reception } from './mock';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReceptionsAvelonService {
  url: string;
  constructor(
    private http: HttpClient
  ) {
    this.url = `${environment.apiSorter}/reception/all`
  }

  getReceptions() {
    return this.http.get<ReceptionAvelonModel.Reception>(this.url);
  }
}
