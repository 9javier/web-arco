import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { RequestsProvider } from 'libs/services/src/providers/requests/requests.provider';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class MarketplacesService {

  private apiBase = 'https://localhost:5001/api';
  private getMapDataRulesUrl = this.apiBase + "/MapDataRules";
  private getMapEntitiesUrl = this.apiBase + "/EnumMetadata/get/mapentity";

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private requestsProvider: RequestsProvider
  ) {}

  getMapEntities():Observable<any>{ 
    return this.http.get<any>(this.getMapEntitiesUrl, {}).pipe(map(response=>{
      return response;
    }));
  }
  getMapDataRules():Observable<any>{ 
    return this.http.get<any>(this.getMapDataRulesUrl, {}).pipe(map(response=>{
      return response;
    }));
  }
}
