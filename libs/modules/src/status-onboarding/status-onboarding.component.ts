import { Component, OnInit, ViewChild } from '@angular/core';
import { PaginatorComponent } from '../components/paginator/paginator.component';
import { MatSort, MatTableDataSource, Sort } from '@angular/material';
import { IntermediaryService } from '@suite/services';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {TableEmitter } from './../../../services/src/models/tableEmitterType';

@Component({
  selector: 'status-onboarding',
  templateUrl: './status-onboarding.component.html',
  styleUrls: ['./status-onboarding.component.scss'],
})
export class StatusOnBoardingComponent implements OnInit {


  constructor(
    private intermediaryService: IntermediaryService,

  ) { }

  ngOnInit() {
    
  }


  

}
