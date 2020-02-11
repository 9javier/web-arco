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
  private userRegisterTimeUrl:string = environment.apiBase+"/users-register-time/user";
  private getListUsersRegisterUrl: string = environment.apiBase + "/users-register-time/";
  private getNewUserListUrl: string = environment.apiBase + '/users-register-time/users-pickings';
  private getUserShoesPicking: string = environment.apiBase + '/workwaves/users/picking';
 ;

  constructor(
    private http:HttpClient,
    
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

  /**
   * Register a time of work of employee in the system
   * @param request - the object to be registered
   */
  userRegisterTime():Observable<UserTimeModel.UserRegisterTime>{
    return this.http.get<UserTimeModel.UserRegisterTimeResponse>(this.userRegisterTimeUrl).pipe(map(response=>{
      return response.data;
    }));
  }

  /**
   * List employees and if they are active or inactive
   */
  getListUsersRegister():Observable<UserTimeModel.ListUsersRegisterTimeActiveInactive>{
    return this.http.get<UserTimeModel.ListUsersRegisterResponse>(this.getListUsersRegisterUrl).pipe(map(response=>{
      return response.data;
    }));
  }
  /**
   * List employees and if they are active or inactive
   */
  getNewListUsersRegister():Observable<UserTimeModel.ListUsersRegisterTimeActiveInactive>{
    return this.http.get<UserTimeModel.ListUsersRegisterResponse>(this.getNewUserListUrl).pipe(map(response=>{
      return response.data;
    }));
  }

  getUsersShoesPicking(body:Array<Number>){
    return this.http.post(this.getUserShoesPicking,body).pipe(map(response=>{
      return response;
      
    }));

  
  }




}
