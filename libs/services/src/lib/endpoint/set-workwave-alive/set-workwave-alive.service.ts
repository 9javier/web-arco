import { Injectable } from '@angular/core';
import {from, Observable} from "rxjs";
import {WorkwaveModel} from "../../../models/endpoints/Workwaves";
import {switchMap} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "@suite/services";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SetWorkwaveAliveService {

  private _intervalExecutedId: number;
  private postKeepWorkwaveAliveUrl: string = environment.apiBase+"/workwaves/keepalive";

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {}

  postKeepWorkwaveAlive(workwaveId: number) {
    from(this.auth.getCurrentToken()).pipe(switchMap(token => {
      let headers: HttpHeaders = new HttpHeaders({ Authorization: token });
      return this.http.post<WorkwaveModel.ResponseKeepAlive>(this.postKeepWorkwaveAliveUrl, { workwaveId: workwaveId }, { headers });
    }));
  }

  get intervalExecutedId(): number {
    return this._intervalExecutedId;
  }

  set intervalExecutedId(value: number) {
    this._intervalExecutedId = value;
  }
}
