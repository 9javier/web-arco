import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';

import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import {PATH} from "../../../../../../config/base";
import { TypeUsersProcesses } from '../../../models/endpoints/UsersProcesses';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const PATH_GET_INDEX: string = PATH('Users Processes', 'Index');
const PATH_ASSIGN: string = PATH('Users Processes', 'Asignar procesos');
const PATH_UNASSIGN: string = PATH('Users Processes', 'Desasignar procesos');

@Injectable({
  providedIn: 'root'
})
export class UserProcessesService {

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) { }
  
  /**
   * Get all users and their processes
   * @return an observable with array of user of data
   * */
  getIndex():Observable<Array<TypeUsersProcesses.UsersProcesses>>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.get<TypeUsersProcesses.ResponseIndex>(PATH_GET_INDEX,{headers}).pipe(
        map((response:TypeUsersProcesses.ResponseIndex)=>{
          return response.data;
        })
        );
    }));

  };

  /**
   * Assign process to users
   * @param usersProcesses the users with their process to be assigned
   */
  postAssign(usersProcesses:Array<TypeUsersProcesses.UsersProcessesToSend>):Observable<TypeUsersProcesses.ResponseAssign>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.post<TypeUsersProcesses.ResponseAssign>(PATH_ASSIGN,usersProcesses,{headers})
    }));
    
  }

    /**
   * Unassign process to users
   * @param usersProcesses the users with their process to be assigned
   */
  postUnAssign(usersProcesses:Array<TypeUsersProcesses.UsersProcessesToSend>):Observable<TypeUsersProcesses.ResponseUnassign>{
    return from(this.auth.getCurrentToken()).pipe(switchMap(token=>{
      let headers:HttpHeaders = new HttpHeaders({Authorization:token});
      return this.http.post<TypeUsersProcesses.ResponseUnassign>(PATH_UNASSIGN,usersProcesses,{headers})
    }));
  }

}
