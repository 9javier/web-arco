import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService, environment } from '@suite/services';
import { RackModel } from '../../../models/endpoints/rack.model';
import { map } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RackService {
  private rackUrl:string = environment.apiBase+"/sorter/racks";
  constructor(
    private http:HttpClient,
    private auth: AuthenticationService
  ) { }

  form: FormGroup = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(5)]),
    reference: new FormControl('', [Validators.required, Validators.pattern('^E[0-9]{4}')]),
    warehouse: new FormControl('', Validators.required)
  });

  initializeFormGroup() {
    this.form.setValue({
      id: '',
      name: '',
      reference: '',
      warehouse: ''
    });
  }

  populateForm(rack: RackModel.Rack) {
    this.form.setValue({
      id: rack.id,
      name: rack.name,
      reference: rack.reference,
      warehouse: rack.warehouse
    });
  }

  async getIndex(): Promise<Observable<HttpResponse<RackModel.ResponseIndex>>> {
    const currentToken = await this.auth.getCurrentToken();
    const headers = new HttpHeaders({ Authorization: currentToken });

    return this.http.get<RackModel.ResponseIndex>(this.rackUrl, {
      headers,
      observe: 'response'
    });
  }

  delete(id: number):Observable<any>{
    return this.http.delete(`${this.rackUrl}/${id}`);
  }

  store(rack: RackModel.Rack):Observable<RackModel.Rack> {
    return this.http.post<RackModel.SingleRackResponse>(this.rackUrl,rack).pipe(map(response=>{
      return response.data;
    }));
  }

  update(id: number, rack: RackModel.Rack) {
    return this.http.put<RackModel.SingleRackResponse>(`${this.rackUrl}/${id}`, rack).pipe(map((response) =>{
      return response.data;
    }));
  }
}
