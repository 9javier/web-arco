import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { TemplateColorsModel } from '../../../models/endpoints/TemplateColors';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TemplateColorsService {

  private getColorsUrl: string = environment.apiBase + "/sorter/templates/colors";

  constructor(private http: HttpClient) { }
  
  getIndex(): Observable<TemplateColorsModel.ResponseTemplateColors> {
    return this.http.get<TemplateColorsModel.ResponseTemplateColors>(this.getColorsUrl).pipe(map(response => {
      return response;
    }));
  }
}
