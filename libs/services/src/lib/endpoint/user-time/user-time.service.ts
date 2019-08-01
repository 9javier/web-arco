import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { UserTimeModel } from 'libs/services/src/models/endpoints/user-time.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserTimeService {

  /**Urls for user time service */
  private registerTimeUrl:string = environment.apiBase+"/users-register-time/";

  constructor(
    private http:HttpClient
  ) { }

    /**
     * Register a time of work of employee in the system
     * @param request - the object to be registered
     */
    registerTime(request:UserTimeModel.UserTimeRequest):Observable<UserTimeModel.UserTime>{
      return this.http.post<UserTimeModel.UserTimeResponse>(this.registerTimeUrl,request).pipe(map(response=>{
        return response.data;
      }));
    }

}
