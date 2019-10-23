import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService, environment, UserModel } from '@suite/services';
import { RackModel } from '../../../models/endpoints/rack.model';

@Injectable({
  providedIn: 'root'
})
export class RackService {
  private rackUrl:string = environment.apiBase+"/sorter/racks";
  private singleRackUrl:string = environment.apiBase+"/sorter/racks/";
  constructor(
    private http:HttpClient,
    private auth: AuthenticationService
  ) { }

  async getIndex(): Promise<Observable<HttpResponse<RackModel.ResponseIndex>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });

    return this.http.get<RackModel.ResponseIndex>(this.rackUrl, {
      headers,
      observe: 'response'
    });
  }

  delete(id: number):Observable<any>{
    return this.http.delete(`${this.singleRackUrl}${id}`);
  }
}
