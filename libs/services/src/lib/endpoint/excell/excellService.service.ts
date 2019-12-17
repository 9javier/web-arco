import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../authentication/authentication.service';
import { RequestsProvider } from '../../../providers/requests/requests.provider';


@Injectable({
  providedIn: 'root'
})
export class ExcellServiceService {

  

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private requestsProvider: RequestsProvider
  ) {}



  
}
