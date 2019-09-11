import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * @class
 * @description helps to create a crud service of any type of abstraction with less effort standarizing the crud methods
 */
@Injectable({
  providedIn: 'root'
})
export class CrudService<responseObject=any,requestObject=any,response=any,singleResponse=any>{

  /**url for request of generic objects */
  protected requestUrl:string;
  /**url for request of specific object dictaminted by the id */
  protected singleRequestUrl:string;

  constructor(protected http:HttpClient) { }

  getAll():Observable<responseObject[]>{
    return this.http.get<response>(this.requestUrl).pipe(map((response:response)=>{
      return (<any>response).data;
    }));
  }

  getIndex(id:number):Observable<responseObject>{
    return this.http.get<singleResponse>(this.singleRequestUrl.replace("{{id}}",String(id))).pipe(map(response=>{
      return (<any>response).data;
    }))
  }

  delete(id:number):Observable<responseObject>{
    return this.http.delete<singleResponse>(this.singleRequestUrl.replace("{{id}}",String(id))).pipe(map(response=>{
      return (<any>response).data;
    }))
  }

  update(id:number,object:requestObject):Observable<responseObject>{
    return this.http.put<singleResponse>(this.singleRequestUrl.replace("{{id}}",String(id)),object).pipe(map(response=>{
      return (<any>response).data;
    }))
  }

  store(object:requestObject[]):Observable<responseObject>{
    return this.http.post<singleResponse>(this.requestUrl,object).pipe(map(response=>{
      return (<any>response).data;
    }));
  }

}

