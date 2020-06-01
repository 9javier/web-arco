import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { NewProductModel } from 'libs/services/src/models/endpoints/NewProduct';
import { RequestsProvider } from '../../../providers/requests/requests.provider';
import { ExcellModell } from 'libs/services/src/models/endpoints/Excell';
import { AuthenticationService } from '../authentication/authentication.service';
import { from, Observable } from "rxjs";
import {switchMap} from "rxjs/operators";
import { BehaviorSubject } from 'rxjs';

import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse
} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DropFilesService {
  private uploadFileUrl:string = environment.uploadFiles;
  private image = new BehaviorSubject(null)
  private $image = this.image.asObservable()
  constructor(
    private http: HttpClient,
    private requestsProvider: RequestsProvider,
    private auth: AuthenticationService,

  ) { }

  uploadFile(data):Observable<any>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      const currentToken = token;
      const headers = new HttpHeaders({ Authorization: currentToken });
      return this.http.post(this.uploadFileUrl+'?type=defects',data, { headers: headers}).pipe(map(response=>{
        // console.log(response);
        return response;
      }));
    }));
  }

  uploadReturnArchive(data):Observable<any>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      const currentToken = token;
      const headers = new HttpHeaders({ Authorization: currentToken });
      return this.http.post(this.uploadFileUrl+'?type=archives',data, { headers: headers}).pipe(map(response=>{
        // console.log(response);
        return response;
      }));
    }));
  }

  uploadReturnDeliveryNote(data):Observable<any>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      const currentToken = token;
      const headers = new HttpHeaders({ Authorization: currentToken });
      return this.http.post(this.uploadFileUrl+'?type=delivery_notes',data, { headers: headers}).pipe(map(response=>{
        // console.log(response);
        return response;
      }));
    }));
  }

  setImage(file){
    this.image.next(file);
  }

  getImage(){
    return this.$image;
  }
}
