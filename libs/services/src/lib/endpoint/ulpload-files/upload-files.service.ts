import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { HttpRequestModel } from '../../../models/endpoints/HttpRequest';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {
  private uploadFileBaseUrl = environment.uploadFiles + '/base'
  private deleteFileUrl = environment.uploadFiles
  private signature = new BehaviorSubject(null)
  private $signature = this.signature.asObservable()
  constructor(private http: HttpClient) { }

  uploadFileBase(base:string){
    return this.http.post<HttpRequestModel.Response>(this.uploadFileBaseUrl, {base}).pipe(
      map(resp => resp.data)
    );
  }
  deleteFile(id: number) {
    return this.http.delete<HttpRequestModel.Response>(this.deleteFileUrl+'/'+ id)
  }

  setSignature(base64: string) {
    this.signature.next(base64);
  }
  signatureEventAsign() {
    return this.$signature
  }
}
