import { of } from 'rxjs';
import { reception } from './mock';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReceptionsAvelonService {

  constructor(
    private http: HttpClient
  ) { }

  getReceptions() {
    return of(reception);
  }
}
